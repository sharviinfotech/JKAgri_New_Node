const fs = require("fs");
const path = require("path");
const { pdfCreate } = require("./models/userCreationModel");

const PDF_FOLDER_PATH = "D:/jk_pdfs"; // your PDF folder

// Function for cron to delete & insert PDFs automatically
const processAndDeleteSOA = async () => {
    try {
        // Use a Regex to find fileName fields starting with "SOA_" OR "BALCNF_"
        // ^(SOA_|BALCNF_) means starts with either string
        const result = await pdfCreate.deleteMany({ 
            fileName: { $regex: /^(SOA_|BALCNF_)/, $options: 'i' } 
        });

       console.log(`🗑️ DB Cleanup: Removed ${result.deletedCount} records starting with SOA_ or BALCNF_`);
    } catch (err) {
        console.error(`❌ Error during DB cleanup:`, err.message);
    }
};

module.exports = { processAndDeleteSOA };
