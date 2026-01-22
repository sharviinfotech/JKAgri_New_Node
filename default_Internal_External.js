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

const processInternalCsv = async () => {
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
const processExternalCustomer = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync(userFilePath)) {
                console.log(`⚠️ User file not found at ${userFilePath}, skipping...`);
                return resolve({ success: false, message: "User file not found" });
            }

            let updatedCount = 0;
            let skippedCount = 0;

            fs.createReadStream(userFilePath)
                .pipe(csv())
                .on('data', async (row) => {
                    try {
                        const result = await userCreation.updateOne(
                            { userName: row.userName }, // ✅ UNIQUE KEY
                            {
                                $set: {
                                    tmCode: row.tmCode,
                                    tmContact: row.tmContact,
                                    chCode: row.chCode,
                                    chContact: row.chContact,
                                    ciCode: row.ciCode,
                                    nsmCode: row.nsmCode,
                                    updatedAt: new Date()
                                }
                            }
                        );

                        if (result.matchedCount > 0) {
                            updatedCount++;
                        } else {
                            skippedCount++;
                        }
                    } catch (err) {
                        console.error(`❌ Error updating user ${row.userName}`, err);
                    }
                })
                .on('end', () => {
                    console.log("✅ External customer update completed");
                    console.log(`🔄 Updated Users : ${updatedCount}`);
                    console.log(`⏭️ Skipped Users : ${skippedCount}`);

                    resolve({
                        success: true,
                        updated: updatedCount,
                        skipped: skippedCount
                    });
                })
                .on('error', (err) => reject(err));

        } catch (error) {
            console.error("❌ Error in processExternalCustomer:", error);
            reject(error);
        }
    });
};



module.exports = { processInternalCsv,processExternalCustomer };