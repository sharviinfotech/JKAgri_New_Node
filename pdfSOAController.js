const fs = require("fs");
const path = require("path");
const { pdfCreate } = require("./models/userCreationModel");

const PDF_FOLDER_PATH = "D:/jk_pdfs"; // your PDF folder

// Function for cron to delete & insert PDFs automatically
const processAndDeleteSOA = async () => {
    try {
        // Use a Regex to find all fileName fields starting with "SOA_"
        // 'i' flag makes it case-insensitive if needed
        const result = await pdfCreate.deleteMany({ 
            fileName: { $regex: /^SOA_/, $options: 'i' } 
        });

        console.log(`🗑️ DB Cleanup: Removed ${result.deletedCount} records starting with SOA_`);
    } catch (err) {
        console.error(`❌ Error during DB cleanup:`, err.message);
    }
};

module.exports = { processAndDeleteSOA };
