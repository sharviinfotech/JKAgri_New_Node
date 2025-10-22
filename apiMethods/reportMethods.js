const axios = require('axios');
const { userCreation, userCount, xlsxCreation, pdfCreate, QueriesData, QueriesCount } = require('../models/userCreationModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const moment = require('moment');
const nodemailer = require('nodemailer');
// const { sendInvoiceDataToEmail } = require('../fetchInvoiceFolder/sendInvoiceToMail'); // Import email function
const recevieInvoiceSendToMail = require('../fetchInvoiceFolder/intialmailsend');
const { sql, config } = require('../config/db');
const { userLast6Months } = require("../baseFile");
const { sendQueryMail } = require("../mailService");
function formatDate(date) {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;

    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
}

module.exports = (() => {
    return {



        // userLogin: async (req, res) => {
        //     try {
        //         const { userName, userPassword } = req.body; // Get username and password
        //         console.log("userName", userName, userPassword);

        //         const user = await userCreation.findOne({ userName }); // Find user by username
        //         console.log("user", user)
        //         if (!user) {
        //             return res.status(404).json({
        //                 message: "User Not Found. Please enter a valid User",
        //                 status: 404,
        //                 isValid: false
        //             });
        //         }
        //         let obj = {
        //             userName: user.userName,
        //             userFirstName: user.userFirstName,
        //             userLastName: user.userLastName,
        //             userEmail: user.userEmail,
        //             userUniqueId: user.userUniqueId,
        //             userStatus: user.userStatus,
        //             isValid: user.userStatus,
        //             userActivity: user.userActivity
        //         }
        //         console.log("password", userPassword, "user.userPassword", user.userPassword);
        //         if (user.userStatus == false) {
        //             return res.status(200).json({
        //                 message: "User Not In Active",
        //                 status: 200,
        //                 data: obj,
        //             });
        //         }
        //         // Compare plain password directly
        //         if (userPassword !== user.userPassword) {
        //             return res.status(400).json({
        //                 message: "Invalid Credentials",
        //                 status: 400,
        //                 isValid: false
        //             });
        //         }

        //         const token = jwt.sign(
        //             { id: user._id, userName: user.userName }, // JWT payload with username
        //             process.env.JWT_SECRET || "your_jwt_secret",
        //             { expiresIn: "1h" }
        //         );



        //         res.status(200).json({
        //             message: "Login Successful",
        //             status: 200,
        //             data: obj,
        //             token
        //         });
        //     } catch (error) {
        //         res.status(500).json({ message: "Server Error", status: 500, isValid: false, error: error.message });
        //     }
        // },
        userLogin: async (req, res) => {
            try {
                const { userName, userPassword } = req.body;
                const user = await userCreation.findOne({ userName });
                const now = new Date();

                if (!user) {
                    return res.status(404).json({
                        message: "User Not Found",
                        status: 404,
                        isValid: false
                    });
                }
                if (user.userStatus == false && user.last6MonthsStatus == false) {
                    return res.status(403).json({
                        message: "You have not logged in for the last 5 minutes (testing mode). Your account has been inactivated.",
                        status: 403,
                        isValid: false
                    });
                }
                // Check admin controlled status
                if (!user.userStatus) {
                    return res.status(403).json({
                        message: "User Not Active. Contact admin.",
                        status: 403,
                        isValid: false
                    });
                }

                // Compare password
                console.log("userPassword",userPassword,user)
                if (userPassword !== user.userPassword) {
                    return res.status(400).json({
                        message: "Invalid Credentials",
                        status: 400,
                        isValid: false
                    });
                }

                const PRODUCTION = userLast6Months; // true = prod, false = testing

                // For non-admin users, check inactivity
                if (user.userActivity === 'USER') {
                    console.log("Enter into User");
                    let lastLogin = user.currentLoginAt || now;

                    // 🔹 Difference calculation
                    let inactiveTime;
                    if (PRODUCTION) {
                        // Production: 6 months inactivity
                        inactiveTime = (1000 * 60 * 60 * 24 * 30 * 6); // 6 months in milliseconds
                    } else {
                        // Testing: 5 minutes inactivity
                        inactiveTime = (1000 * 60 * 5); // 5 minutes in milliseconds
                    }

                    if ((now - new Date(lastLogin)) >= inactiveTime) {
                        user.userStatus = false;
                        user.last6MonthsStatus = false;
                        await user.save();

                        return res.status(403).json({
                            message: PRODUCTION
                                ? "You have not logged in for the last 6 months. Your account has been inactivated."
                                : "You have not logged in for the last 5 minutes (testing mode). Your account has been inactivated.",
                            status: 403,
                            isValid: false
                        });
                    } else {
                        user.last6MonthsStatus = true;
                    }

                    // Update login timestamps for all users (ADMIN & USER)
                    user.lastLoginAt = user.currentLoginAt || now;
                    user.currentLoginAt = now;

                } else {
                    console.log("Enter into Admin");
                    // Update login timestamps for all users (ADMIN & USER)
                    user.lastLoginAt = user.currentLoginAt || now;
                    user.currentLoginAt = now;
                    user.last6MonthsStatus = true;
                }


                await user.save();

                const obj = {
                    userName: user.userName,
                    userFirstName: user.userFirstName,
                    userLastName: user.userLastName,
                    userEmail: user.userEmail,
                    userUniqueId: user.userUniqueId,
                    userStatus: user.userStatus,
                    isValid: user.userStatus,
                    userActivity: user.userActivity,
                    currentLoginAt: formatDate(user.currentLoginAt),
                    lastLoginAt: formatDate(user.lastLoginAt),
                    last6MonthsStatus: user.last6MonthsStatus
                };

                const token = jwt.sign(
                    { id: user._id, userName: user.userName },
                    process.env.JWT_SECRET || "your_jwt_secret",
                    { expiresIn: "1h" }
                );

                res.status(200).json({
                    message: "Login Successful",
                    status: 200,
                    data: obj,
                    token
                });

            } catch (error) {
                res.status(500).json({
                    message: "Server Error",
                    status: 500,
                    isValid: false,
                    error: error.message
                });
            }
        },



        forgotPassword: async (req, res) => {

            console.log("forgotPassword", req.res)
            try {
                const { userEmail } = req.body;
                console.log("userEmail", userEmail)
                if (!userEmail) {
                    return res.status(400).json({ message: "Email is required" });
                }
                const user = await userCreation.findOne({ userEmail: userEmail });
                console.log("user", user)
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                let obj = {
                    userUniqueId: user.userUniqueId,
                    userEmail: user.userEmail,
                    userName: user.userName,
                    userPassword: user.userPassword,
                }

                res.status(200).json({
                    message: "Password reset email sent successfully",
                    status: 200,
                    data: obj
                })
                enterIntoSendMail(obj)
            }
            catch (error) {
                res.status(500).json({
                    message: "500 Internal Server Error",
                    status: 500
                })
            }

        },
        resetPassword: async (req, res) => {
            console.log("resetPassword req.body", req.body)
            try {
                const { userUniqueId, userName, currentPassword, newPassword, confirmPassword } = req.body;

                // Check if user exists
                const user = await userCreation.findOne({ userName });
                if (!user) {
                    return res.status(404).json({ message: "User not found", status: 404 });
                }

                // Verify current password (since no hashing, we do a direct comparison)
                if (user.userPassword !== currentPassword) {
                    return res.status(400).json({ message: "Current password is incorrect", status: 400 });
                }

                // Check if new password and confirm password match
                if (newPassword !== confirmPassword) {
                    return res.status(400).json({ message: "Please check New password and confirm password", status: 400 });
                }

                // Update password in database
                user.userPassword = newPassword;
                user.userConfirmPassword = confirmPassword;
                await user.save();

                res.status(200).json({ message: "Password reset successfully", status: 200 });

            } catch (error) {
                res.status(500).json({ message: "Failed to reset password", status: 500, error: error.message });
            }
        },

        // xlsxSubmit: async (req, res) => {
        //     try {
        //         const xlsxList = req.body;

        //         console.log('xlsxList reqbody:', xlsxList.xlsxList);

        //         if (!Array.isArray(xlsxList.xlsxList) || xlsxList.xlsxList.length === 0) {
        //             return res.status(400).json({ message: "Invalid data received", status: 400 });
        //         }

        //         // Transforming keys to match schema before saving
        //         const transformedData = xlsxList.xlsxList.map(item => ({
        //             serialNo: item['S.No'],        // Renamed field
        //             codeNo: item['Code No'],       // Renamed field
        //             employeeName: item['Name of Employee'], // Renamed field
        //             department: item.Department,   // Matches schema
        //             contractor: item.Contractor || "Unknown" // Ensure contractor field
        //         }));

        //         let insertedCount = 0;
        //         let updatedCount = 0;

        //         for (const data of transformedData) {
        //             // Check if a record with the same serialNo and codeNo exists
        //             const existingRecord = await xlsxCreation.findOneAndUpdate(
        //                 { 'xlsxList.serialNo': data.serialNo, 'xlsxList.codeNo': data.codeNo },
        //                 { $set: { 'xlsxList.$': data } },  // Update the matched record
        //                 { new: true } // Return updated record
        //             );

        //             if (existingRecord) {
        //                 updatedCount++;
        //             } else {
        //                 // If no record exists, insert new record
        //                 await xlsxCreation.updateOne(
        //                     {},
        //                     { $push: { xlsxList: data } }, // Push new data into xlsxList array
        //                     { upsert: true } // Create new record if no document exists
        //                 );
        //                 insertedCount++;
        //             }
        //         }

        //         return res.status(200).json({
        //             message: `XLSX data processed successfully`,
        //             inserted: insertedCount,
        //             updated: updatedCount,
        //             status: 200,
        //         });

        //     } catch (err) {
        //         console.error("Error saving data:", err);
        //         return res.status(500).json({
        //             message: "Failed to save XLSX data",
        //             error: err.message,
        //             status: 500,
        //         });
        //     }
        // },

        // API to Fetch Data
        // getXlsx: async (req, res) => {
        //     try {
        //         const result = await xlsxCreation.find();
        //         console.log("Fetched Data:", result);



        //         return res.status(200).json({
        //             responseData: result,
        //             count: result[0].xlsxList.length,
        //             message: "XLSX List fetched successfully",
        //             statusCode: 200,
        //         });

        //     } catch (err) {
        //         console.error("Error fetching data:", err);
        //         return res.status(500).json({
        //             message: "Failed to fetch data",
        //             error: err.message,
        //             statusCode: 500,
        //         });
        //     }
        // },
        // pdfSubmit: async (req, res) => {
        //     console.log("pdfSubmit req.body", req.body);
        //     try {
        //         const { fileName, fileData } = req.body;

        //         if (!fileName || !fileData) {
        //             return res.status(400).json({ message: "Missing fileName or fileData" });
        //         }

        //         // ✅ Extract pdfName (Remove ".pdf" extension)
        //         const pdfName = fileName.replace(/\.pdf$/i, "");

        //         // ✅ Prevent duplicates
        //         const existingPdf = await pdfCreate.findOne({ fileName });
        //         if (existingPdf) {
        //             return res.status(409).json({ message: "PDF already exists" });
        //         }

        //         // ✅ Save to DB with pdfName
        //         const newPdf = new pdfCreate({ fileName, pdfName, fileData });
        //         await newPdf.save();

        //         return res.status(201).json({ message: "PDF saved successfully", pdfName });

        //     } catch (error) {
        //         console.error("🚨 Error saving PDF:", error);
        //         return res.status(500).json({ message: "Failed to save PDF", error: error.message });
        //     }
        // },

        // API to Fetch Data
        // API to Fetch Data or Check if PDF Exists
        pdfSubmit: async (req, res) => {
            try {
                const { fileName, fileData } = req.body;
                if (!fileName || !fileData) {
                    return res.status(400).json({ message: "Missing fileName or fileData" });
                }

                const pdfName = fileName.replace(/\.pdf$/i, "");
                let monthAndYear = null;

                // 1️⃣ DD.MM.YYYY
                let match = pdfName.match(/\d{2}[.]\d{2}[.]\d{4}/);
                if (match) {
                    monthAndYear = match[0]; // already correct
                }

                // 2️⃣ DD-MM-YYYY → convert to DD.MM.YYYY
                if (!monthAndYear) {
                    match = pdfName.match(/\d{2}[-]\d{2}[-]\d{4}/);
                    if (match) {
                        monthAndYear = match[0].replace(/-/g, '.');
                    }
                }

                // 3️⃣ MM_YYYY → assume day = 01 → convert to DD.MM.YYYY
                if (!monthAndYear) {
                    match = pdfName.match(/(0[1-9]|1[0-2])_\d{4}/);
                    if (match) {
                        const [mon, yr] = match[0].split('_');
                        monthAndYear = `01.${mon}.${yr}`;
                    }
                }

                // 4️⃣ MM-YYYY → assume day = 01 → convert to DD.MM.YYYY
                if (!monthAndYear) {
                    match = pdfName.match(/(0[1-9]|1[0-2])-\d{4}/);
                    if (match) {
                        const [mon, yr] = match[0].split('-');
                        monthAndYear = `01.${mon}.${yr}`;
                    }
                }

                // ✅ Prevent duplicates
                const existingPdf = await pdfCreate.findOne({ fileName });
                if (existingPdf) {
                    return res.status(409).json({ message: "PDF already exists" });
                }

                // ✅ Save with DD.MM.YYYY format
                const newPdf = new pdfCreate({ fileName, pdfName, fileData, monthAndYear });
                await newPdf.save();

                return res.status(201).json({ message: "PDF saved successfully", pdfName, monthAndYear });

            } catch (error) {
                console.error("🚨 Error saving PDF:", error);
                return res.status(500).json({ message: "Failed to save PDF", error: error.message });
            }
        },






        getPdf: async (req, res) => {
            try {
                const { fileName } = req.query;
                if (!fileName) {
                    return res.status(400).json({ message: "Missing fileName", status: 400 });
                }

                const pdfData = await pdfCreate.findOne({ fileName });

                if (!pdfData) {
                    return res.status(200).json({ exists: false });
                }

                return res.status(200).json({ exists: true });

            } catch (error) {
                console.error("Error checking PDF:", error);
                return res.status(500).json({ message: "Failed to check PDF", error: error.message });
            }
        },

        userCreationSave: async (req, res) => {
            console.log("userCreationSave", req, res)
            try {
                console.log("req.body", req.body);
                const { userName, userFirstName, userLastName, userEmail, userContact, userPassword, userConfirmPassword, userStatus, userActivity } = req.body;
                console.log("userPassword", userPassword, "userConfirmPassword", userConfirmPassword);

                if (userPassword !== userConfirmPassword) {
                    return res.status(400).json({ message: "Passwords do not match", status: 400 });
                }

                const existingUser = await userCreation.findOne({ userEmail });
                if (existingUser) {
                    return res.status(400).json({ message: "User with this email already exists", status: 400 });
                }

                const counter = await userCount.findOneAndUpdate(
                    { name: "userUniqueId" },
                    { $inc: { value: 1 } },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
                const userUniqueId = counter.value;
                console.log("userUniqueId", userUniqueId);

                const now = new Date();

                const userPayload = new userCreation({
                    userName,
                    userFirstName,
                    userLastName,
                    userEmail,
                    userContact,
                    userPassword,         // plain text
                    userConfirmPassword,  // optional
                    userStatus,
                    userActivity,
                    userUniqueId,
                    currentLoginAt: now,          // initialize to now
                    lastLoginAt: null,            // no previous login yet
                    last6MonthsStatus: true       // new user is active in last 6 months by default
                });

                const saveNewUser = await userPayload.save();
                res.status(200).json({
                    message: "User Created Successfully",
                    data: {
                        userName: saveNewUser.userName,
                        userStatus: saveNewUser.userStatus,
                        userActivity: saveNewUser.userActivity,
                        userUniqueId: saveNewUser.userUniqueId
                    },
                    status: 200
                });
            } catch (error) {
                res.status(500).json({ message: "Failed to save the user", status: 500, error: error.message });
            }
        },



        updateUserCreation: async (req, res) => {
            try {
                const { UniqueId } = req.params;
                const updateUserData = req.body;

                // If admin sets userStatus true, reset last6MonthsStatus and login timestamps
                if (updateUserData.userStatus === true) {
                    const now = new Date();
                    updateUserData.last6MonthsStatus = true;
                    updateUserData.currentLoginAt = now;
                    updateUserData.lastLoginAt = now;
                }

                const updateUserObj = await userCreation.findOneAndUpdate(
                    { userUniqueId: UniqueId },
                    { $set: updateUserData },
                    { new: true, runValidators: true }
                );

                if (!updateUserObj) {
                    return res.status(404).json({ message: "User Not Found", status: 404 });
                }

                res.status(200).json({
                    message: "User Updated Successfully",
                    data: {
                        ...updateUserObj.toObject(),
                        currentLoginAt: formatDate(updateUserObj.currentLoginAt),
                        lastLoginAt: formatDate(updateUserObj.lastLoginAt)
                    },
                    status: 200
                });
            } catch (error) {
                res.status(500).json({ message: "Update Failed", status: 500, error: error.message });
            }
        },
        QueriesSave: async (req, res) => {
            try {
                console.log("req.body", req.body);
                const { CustomerName, CustomerId, Queries } = req.body;

                // Increment counter atomically
                let counter = await QueriesCount.findOneAndUpdate(
                    { name: "QueriesUniqueId" },
                    { $inc: { value: 1 } },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );

                const QueriesUniqueId = counter.value;

                const now = new Date();

                const queryPayload = new QueriesData({
                    QueriesUniqueId,
                    CustomerName,
                    CustomerId,
                    Queries,
                    sentDateTimeAt: now,
                });

                await queryPayload.save();

                // Send email
                const mailSent = await sendQueryMail({ CustomerName, CustomerId, Queries });

                res.status(200).json({
                    message: mailSent
                        ? "Feedback saved and mail sent successfully"
                        : "Feedback saved, but mail sending failed",
                    status: 200,
                });

            } catch (error) {
                console.error("Error in QueriesSave:", error);
                res.status(500).json({
                    message: "Feedback mail failed",
                    status: 500,
                    error: error.message,
                });
            }
        },


        // getAllUserLists: async (req, res) => {
        //     try {
        //         const usersList = await userCreation.find()
        //         console.log("usersList", usersList)
        //         if (usersList.length === 0) {
        //             res.json({
        //                 message: "No Data Available",
        //                 status: 200
        //             })
        //         }
        //         res.json({
        //             message: "User Data Fetched Successfully",
        //             data: usersList,
        //             status: 200
        //         })

        //     } catch (error) {

        //         res.json({
        //             error: error.message
        //         })
        //     }
        // },
        getAllUserLists: async (req, res) => {
            try {
                const usersList = await userCreation.find();

                if (!usersList.length) {
                    return res.json({ message: "No Data Available", status: 200 });
                }

                const formattedUsers = usersList.map(user => ({
                    _id: user._id,
                    userUniqueId: user.userUniqueId,
                    userName: user.userName,
                    userFirstName: user.userFirstName,
                    userLastName: user.userLastName,
                    userEmail: user.userEmail,
                    userContact: user.userContact,
                    userStatus: user.userStatus,
                    userActivity: user.userActivity,
                    currentLoginAt: formatDate(user.currentLoginAt),
                    lastLoginAt: formatDate(user.lastLoginAt),
                    last6MonthsStatus: user.last6MonthsStatus,
                    userPassword: user.userPassword,         // plain text
                    userConfirmPassword: user.userConfirmPassword,
                }));

                res.json({
                    message: "User Data Fetched Successfully",
                    data: formattedUsers,
                    status: 200
                });

            } catch (error) {
                res.status(500).json({ message: "Server Error", status: 500, error: error.message });
            }
        },

        allPdfList: async (req, res) => {
            try {
                const result = await pdfCreate.find();
                console.log("Fetched Data:", result);
                return res.status(200).json({
                    message: "PDF fetched successfully",
                    statusCode: 200,
                    responseCount: result.length,
                    responseData: result,

                });

            } catch (err) {
                console.error("Error fetching data:", err);
                return res.status(500).json({
                    message: "Failed to fetch data",
                    error: err.message,
                    statusCode: 500,
                });
            }
        },


    };
})();




