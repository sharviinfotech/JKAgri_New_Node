
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { DashboardData } = require('./models/userCreationModel');

const CSV_FOLDER_PATH = "D:/jk_pdfs";
const CSV_FILE_NAME = "Dashboard.csv";

function parseDate(dateStr) {
  if (!dateStr) return null;
  const [datePart, timePart] = dateStr.trim().split(/\s+/);
  const [dd, mm, yyyy] = datePart.split("-");
  return new Date(`${yyyy}-${mm}-${dd} ${timePart}`);
}

function parseNumber(value) {
  if (!value) return 0;
  let str = value.toString().trim();
  if (str.endsWith("-")) return -parseFloat(str.replace("-", ""));
  return parseFloat(str) || 0;
}

const startReadingCsvFile = async () => {
  try {
    console.log("📊 CSV Reader Started...");

    const filePath = path.join(CSV_FOLDER_PATH, CSV_FILE_NAME);

    if (!fs.existsSync(filePath)) {
      console.error("❌ CSV file not found:", filePath);
      return;
    }

    const payload = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        payload.push({
          customerCode: row["Customer Code"],
          totalValue: parseNumber(row["Total Value"]),
          crnValue: parseNumber(row["Crn Value"]),
          drnValue: parseNumber(row["Drn Value"]),
          invoiceValue: parseNumber(row["Inv Value"]),
          soaValue: parseNumber(row["Soa Value"]),
          balValue: parseNumber(row["Balcnf Value"]),
          absValue: parseNumber(row["Abs Value"]),
          outstandingValue: parseNumber(row["Outstanding Value"]),
          dataLastUpdatedOn: parseDate(row["Timestamp"])
        });
      })
      .on("end", async () => {
        await DashboardData.deleteMany({});
        await DashboardData.insertMany(payload);
        console.log(`✅ CSV data synced (${payload.length} records)`);
      });

  } catch (err) {
    console.error("❌ CSV Reader Error:", err.message);
  }
};

module.exports = { startReadingCsvFile };



// const XLSX = require("xlsx");
// const fs = require("fs");
// const path = require("path");
// const { DashboardData } = require('./models/userCreationModel');

// const EXCEL_FOLDER_PATH = "D:/";
// const EXCEL_FILE_NAME = "Dashboard.xlsx";
// const SHEET_NAME = "Dashboard_Data";
// function excelSerialToDate(serial) {
//   if (!serial || isNaN(serial)) return null;

//   const excelEpoch = new Date(1899, 11, 30);
//   return new Date(excelEpoch.getTime() + Number(serial) * 86400000);
// }

// const startReadingEcelsFiles = async () => {
//   try {
//     console.log("📊 Excel Reader Started...");

//     const filePath = path.join(EXCEL_FOLDER_PATH, EXCEL_FILE_NAME);

//     if (!fs.existsSync(filePath)) {
//       console.error("❌ Excel file not found:", filePath);
//       return;
//     }

//     const workbook = XLSX.readFile(filePath);
//     const sheet = workbook.Sheets[SHEET_NAME];

//     if (!sheet) {
//       console.error("❌ Sheet not found:", SHEET_NAME);
//       return;
//     }

//     const rows = XLSX.utils.sheet_to_json(sheet, { defval: 0 });

//     if (!rows.length) {
//       console.warn("⚠ Excel sheet is empty");
//       return;
//     }

//     const payload = rows.map(row => ({
//       customerCode: row["Customer Code"],
//       totalValue: row["Total Value"],
//       crnValue: row["Crn Value"],
//       drnValue: row["Drn Value"],
//       invoiceValue: row["Inv Value"],
//       soaValue: row["Soa Value"],
//       balValue: row["Balcnf Value"],
//       absValue: row["Abs Value"],
//       outstandingValue: row["Outstanding Value"],
//       dataLastUpdatedOn: excelSerialToDate(row["Timestamp"])
//     }));

//     // 🔁 Replace old data with new data
//     await DashboardData.deleteMany({});
//     await DashboardData.insertMany(payload);

//     console.log(`✅ Excel data synced (${payload.length} records)`);

//   } catch (err) {
//     console.error("❌ Excel Reader Error:", err.message);
//   }
// };

// module.exports = { startReadingEcelsFiles };
