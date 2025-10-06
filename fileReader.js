const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const axios = require('axios');

// Path to your XLSX file
const filePath = 'D:/EmployeeData (1).xlsx';

// API endpoint for submitting data
const XLSX_SUBMIT_API = "http://localhost:3000/api/get/xlsxDataSubmit"; // Update with actual API URL

// Store previous data for comparison
let previousData = [];

/**
 * Function to read Excel file and submit data if changes are detected
 */
const readExcelFile = async () => {
    console.log("🔍 Checking for new XLSX data...");

    try {
        if (!fs.existsSync(filePath)) {
            console.log("❌ XLSX file not found.");
            return;
        }

        // Read Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) {
            console.log("⚠️ No data found in XLSX file.");
            return;
        }

        // Format data correctly (Ensure names are strings)
        const formattedData = sheetData.map(record => ({
            ...record,
            "Name of Employee": String(record["Name of Employee"] || "")
        }));

        // Compare with previous data
        if (JSON.stringify(previousData) === JSON.stringify(formattedData)) {
            console.log("✅ No changes detected in XLSX file.");
            return;
        }

        console.log(`📂 Read ${formattedData.length} records from XLSX. Sending to API...`);
        console.log("📤 Data:", JSON.stringify(formattedData, null, 2));

        // Send updated data to the API
        const response = await axios.post(XLSX_SUBMIT_API, { xlsxList: formattedData });

        if (response.status === 200) {
            console.log("✅ XLSX data submitted successfully:", response.data.message);
            previousData = formattedData; // Update previous data after successful submission
        } else {
            console.log("❌ Failed to submit XLSX data:", response.data.message);
        }

    } catch (error) {
        console.error("🚨 Error processing XLSX file:", error.message);
    }
};

// Run the function initially
// readExcelFile();

// Schedule to run every 5 minutes
// setInterval(readExcelFile, 1 * 60 * 1000); // 5 minutes in milliseconds

module.exports = { readExcelFile };
