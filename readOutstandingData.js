const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { outstandingSchema } = require('./models/userCreationModel');

const CSV_FOLDER_PATH = "D:/jk_pdfs";
const CSV_FILE_NAME = "Outstanding_Data.csv";

// ✅ Convert "8999.86-" → -8999.86 and remove commas
const parseAmount = (value) => {
  if (!value) return 0;

  let str = value.toString().trim().replace(/,/g, "");

  if (str.endsWith("-")) {
    return -parseFloat(str.replace("-", ""));
  }

  return parseFloat(str) || 0;
};

// ✅ Convert "29-01-2026  10:34:59" → Date
const parseDate = (dateStr) => {
  if (!dateStr) return null;

  const [datePart, timePart] = dateStr.trim().split(/\s+/);
  const [dd, mm, yyyy] = datePart.split("-");

  return new Date(`${yyyy}-${mm}-${dd} ${timePart}`);
};

const startReadingCsvOutStandingFiles = async () => {
  try {
    console.log("📊 Outstanding CSV Reader Started...");

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
          customerCode: row["Customer"],
          customerName: row["Name"],

          state: row["State"],
          place: row["Place"],

          debit: parseAmount(row["Debit"]),
          credit: parseAmount(row["Credit"]),
          dso: parseAmount(row["DSO"]),

          bucket_0_30: parseAmount(row["0-30"]),
          bucket_31_60: parseAmount(row["31-60"]),
          bucket_61_90: parseAmount(row["61-90"]),
          bucket_91_120: parseAmount(row["91-120"]),
          bucket_121_180: parseAmount(row["121-180"]),
          bucket_181_365: parseAmount(row["181-365"]),
          bucket_366_730: parseAmount(row["366-730"]),
          bucket_731_1095: parseAmount(row["731-1095"]),
          bucket_gt_1095: parseAmount(row[">1095"]),

          accountGroup: row["ACCOUNT GROUP"],
          accountGroupName: row["ACCOUNT GROUP NAME"],

          ciName: row["CI NAME"],
          chName: row["CH NAME"],
          blName: row["BL NAME"],
          tmName: row["TM NAME"],

          dataLastUpdatedOn: parseDate(row["Timestamp"]) || new Date()
        });
      })
      .on("end", async () => {
        await outstandingSchema.deleteMany({});
        await outstandingSchema.insertMany(payload);

        console.log(`✅ Outstanding CSV data synced (${payload.length} records)`);
      });

  } catch (err) {
    console.error("❌ Outstanding CSV Reader Error:", err.message);
  }
};

module.exports = { startReadingCsvOutStandingFiles };



// const XLSX = require("xlsx");
// const fs = require("fs");
// const path = require("path");
// const { outstandingSchema } = require('./models/userCreationModel');

// const EXCEL_FOLDER_PATH = "D:/";
// const EXCEL_FILE_NAME = "Dashboard.xlsx";
// const SHEET_NAME = "Outingstanding_Data";
// const parseAmount = (value) => {
//   if (!value) return 0;
//   return Number(String(value).replace(/,/g, ""));
// };
// const startReadingEcelsOutStandingFiles = async () => {
// try {
//     console.log("📊 Outstanding Excel Reader Started...");

//     const filePath = path.join(EXCEL_FOLDER_PATH, EXCEL_FILE_NAME);
//     if (!fs.existsSync(filePath)) {
//       console.error("❌ File not found:", filePath);
//       return;
//     }

//     const workbook = XLSX.readFile(filePath);
//     const sheet = workbook.Sheets[SHEET_NAME];

//     if (!sheet) {
//       console.error("❌ Sheet not found:", SHEET_NAME);
//       return;
//     }

//     const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

//     if (!rows.length) {
//       console.warn("⚠ Sheet empty");
//       return;
//     }

//     const payload = rows.map(row => ({
//       customerCode: row["Customer"],
//       customerName: row["Name"],

//       state: row["State"],
//       place: row["Place"],

//       debit: parseAmount(row["Debit"]),
//       credit: parseAmount(row["Credit"]),
//       dso: parseFloat(row["DSO"]) || 0,

//       bucket_0_30: parseAmount(row["0-30"]),
//       bucket_31_60: parseAmount(row["31-60"]),
//       bucket_61_90: parseAmount(row["61-90"]),
//       bucket_91_120: parseAmount(row["91-120"]),
//       bucket_121_180: parseAmount(row["121-180"]),
//       bucket_181_365: parseAmount(row["181-00365"]),
//       bucket_366_730: parseAmount(row["366-00730"]),
//       bucket_731_1095: parseAmount(row["731-01095"]),
//       bucket_gt_1095: parseAmount(row[">1095"]),

//       accountGroup: row["ACCOUNT GROUP"],
//       accountGroupName: row["ACCOUNT GROUP NAME"],
//      profitCenter:row["PROFIT CENTER"],
//      profitCenterText:row["PROFIT CENTER TEXT"],
//       ciName: row["CI NAME"],
//       chName: row["CH NAME"],
//       blName: row["BL NAME"],
//       tmName: row["TM NAME"],

//       dataLastUpdatedOn: new Date()
//     }));

//     await outstandingSchema.deleteMany({});
//     await outstandingSchema.insertMany(payload);

//     console.log(`✅ Outstanding data synced (${payload.length} records)`);

//   } catch (err) {
//     console.error("❌ Outstanding Reader Error:", err.message);
//   }
// };

// module.exports = { startReadingEcelsOutStandingFiles };
