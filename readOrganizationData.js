const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { OrganizationHirarchy, OrgCount,userCreation,userCount } = require('./models/userCreationModel');

const EXCEL_FOLDER_PATH = "D:/";
const EXCEL_FILE_NAME = "InternalEmployeeData.csv";
const filePath = path.join(EXCEL_FOLDER_PATH, EXCEL_FILE_NAME);


// Configuration for User CSV
const USER_EXCEL_PATH = "D:/";
const USER_FILE_NAME = "ExternalEmployeeData.csv";
const userFilePath = path.join(USER_EXCEL_PATH, USER_FILE_NAME);

const processOrganizationCSV = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if file exists before proceeding
            if (!fs.existsSync(filePath)) {
                console.log(`⚠️ File not found at ${filePath}, skipping...`);
                return resolve({ success: false, message: "File not found" });
            }

            // Step 1: Delete all existing organization records
            console.log("🗑️ Cleaning existing Organization records...");
            await OrganizationHirarchy.deleteMany({});

            // Step 2: Reset counter to base value 800
            console.log("🔄 Resetting Organization counter...");
            await OrgCount.deleteMany({}); 
            await OrgCount.create({
                name: "OrganizationUniqueId",
                value: 800
            });

            const results = [];
            let currentId = 800;

            // Step 3: Stream and Parse CSV
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    currentId++;
                    results.push({
                        OrganizationUniqueId: currentId,
                        nsmCode: row.nsmCode,
                        nsmName: row.nsmName,
                        nsmContact: row.nsmContact,
                        ciCode: row.ciCode,
                        ciName: row.ciName,
                        ciContact: row.ciContact,
                        chCode: row.chCode,
                        chName: row.chName,
                        chContact: row.chContact,
                        tmCode: row.tmCode,
                        tmName: row.tmName,
                        tmContact: row.tmContact,
                        savedDateTimeAt: new Date()
                    });
                })
                .on('end', async () => {
                    try {
                        if (results.length > 0) {
                            await OrganizationHirarchy.insertMany(results);
                            await OrgCount.findOneAndUpdate(
                                { name: "OrganizationUniqueId" },
                                { value: currentId }
                            );
                        }
                        
                        console.log(`✅ Successfully imported ${results.length} organization records.`);
                        resolve({ success: true, count: results.length });
                    } catch (err) {
                        reject(err);
                    }
                })
                .on('error', (err) => reject(err));

        } catch (error) {
            console.error("❌ Error in processOrganizationCSV:", error);
            reject(error);
        }
    });
};
const processUserCSV = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync(userFilePath)) {
                console.log(`⚠️ User file not found at ${userFilePath}, skipping...`);
                return resolve({ success: false, message: "User file not found" });
            }

            // Step 1: Delete all existing user records
            console.log("🗑️ Cleaning existing User records...");
            await userCreation.deleteMany({});

            // Step 2: Reset counter to base value 800
            console.log("🔄 Resetting User counter...");
            await userCount.deleteMany({}); 
            await userCount.create({
                name: "userUniqueId",
                value: 2600001
            });

            const userResults = [];
            let currentUserId = 2600001;

            // Step 3: Stream and Parse CSV
            fs.createReadStream(userFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    currentUserId++;
                    userResults.push({
                        userUniqueId: currentUserId,
                        userName: row.userName,
                        userFirstName: row.userFirstName,
                        userLastName: row.userLastName,
                        userEmail: row.userEmail,
                        userContact: row.userContact,
                        userPassword: row.userPassword || "123456", // Default if missing
                        userConfirmPassword: row.userPassword || "123456",
                        userStatus: row.userStatus === 'true', // Convert string to boolean
                        userActivity: row.userActivity,
                        tmCode: row.tmCode,
                        tmContact: row.tmContact,
                        chCode: row.chCode,
                        chContact: row.chContact,
                        ciCode: row.ciCode,
                        nsmCode: row.nsmCode,
                        userState: row.userState,
                        currentLoginAt: new Date(),
                        lastLoginAt: null,
                        last6MonthsStatus: true
                    });
                })
                .on('end', async () => {
                    try {
                        if (userResults.length > 0) {
                            await userCreation.insertMany(userResults);
                            await userCount.findOneAndUpdate(
                                { name: "userUniqueId" },
                                { value: currentUserId }
                            );
                        }
                        console.log(`✅ Successfully imported ${userResults.length} User records.`);
                        resolve({ success: true, count: userResults.length });
                    } catch (err) {
                        reject(err);
                    }
                })
                .on('error', (err) => reject(err));

        } catch (error) {
            console.error("❌ Error in processUserCSV:", error);
            reject(error);
        }
    });
};



module.exports = { processOrganizationCSV,processUserCSV };