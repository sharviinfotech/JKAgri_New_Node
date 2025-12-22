const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { outstandingSchema } = require('./models/userCreationModel');

const EXCEL_FOLDER_PATH = "D:/";
const EXCEL_FILE_NAME = "Dashboard.xlsx";
const SHEET_NAME = "Outingstanding_Data";
const parseAmount = (value) => {
  if (!value) return 0;
  return Number(String(value).replace(/,/g, ""));
};
const startReadingEcelsOutStandingFiles = async () => {
try {
    console.log("📊 Outstanding Excel Reader Started...");

    const filePath = path.join(EXCEL_FOLDER_PATH, EXCEL_FILE_NAME);
    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found:", filePath);
      return;
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[SHEET_NAME];

    if (!sheet) {
      console.error("❌ Sheet not found:", SHEET_NAME);
      return;
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      console.warn("⚠ Sheet empty");
      return;
    }

    const payload = rows.map(row => ({
      customerCode: row["Customer"],
      customerName: row["Name"],

      state: row["State"],
      place: row["Place"],

      debit: parseAmount(row["Debit"]),
      credit: parseAmount(row["Credit"]),
      dso: parseFloat(row["DSO"]) || 0,

      bucket_0_30: parseAmount(row["0 -00030"]),
      bucket_31_60: parseAmount(row["00031 -00060"]),
      bucket_61_90: parseAmount(row["00061 -00090"]),
      bucket_91_120: parseAmount(row["00091 -00120"]),
      bucket_121_180: parseAmount(row["00121 -00180"]),
      bucket_181_365: parseAmount(row["00181 -00365"]),
      bucket_366_730: parseAmount(row["00366 -00730"]),
      bucket_731_1095: parseAmount(row["00731 -01095"]),
      bucket_gt_1095: parseAmount(row[">01095"]),

      accountGroup: row["ACCOUNT GROUP"],
      accountGroupName: row["ACCOUNT GROUP NAME"],
     profitCenter:row["PROFIT CENTER"],
     profitCenterText:row["PROFIT CENTER TEXT"],
      ciName: row["CI NAME"],
      chName: row["CH NAME"],
      blName: row["BL NAME"],
      tmName: row["TM NAME"],

      dataLastUpdatedOn: new Date()
    }));

    await outstandingSchema.deleteMany({});
    await outstandingSchema.insertMany(payload);

    console.log(`✅ Outstanding data synced (${payload.length} records)`);

  } catch (err) {
    console.error("❌ Outstanding Reader Error:", err.message);
  }
};

module.exports = { startReadingEcelsOutStandingFiles };
