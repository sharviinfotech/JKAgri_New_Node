const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { DashboardData } = require('./models/userCreationModel');

const EXCEL_FOLDER_PATH = "D:/";
const EXCEL_FILE_NAME = "Dashboard.xlsx";
const SHEET_NAME = "Dashboard_Data";

const startReadingEcelsFiles = async () => {
  try {
    console.log("📊 Excel Reader Started...");

    const filePath = path.join(EXCEL_FOLDER_PATH, EXCEL_FILE_NAME);

    if (!fs.existsSync(filePath)) {
      console.error("❌ Excel file not found:", filePath);
      return;
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[SHEET_NAME];

    if (!sheet) {
      console.error("❌ Sheet not found:", SHEET_NAME);
      return;
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: 0 });

    if (!rows.length) {
      console.warn("⚠ Excel sheet is empty");
      return;
    }

    const payload = rows.map(row => ({
      customerCode: row["Customer Code"],
      totalValue: row["Total Value"],
      crnValue: row["Crn Value"],
      drnValue: row["Drn Value"],
      invoiceValue: row["Inv Value"],
      soaValue: row["Soa Value"],
      balValue: row["Balcnf Value"],
      absValue: row["Abs Value"],
      outstandingValue: row["Outstanding Value"],
      dataLastUpdatedOn: new Date()
    }));

    // 🔁 Replace old data with new data
    await DashboardData.deleteMany({});
    await DashboardData.insertMany(payload);

    console.log(`✅ Excel data synced (${payload.length} records)`);

  } catch (err) {
    console.error("❌ Excel Reader Error:", err.message);
  }
};

module.exports = { startReadingEcelsFiles };
