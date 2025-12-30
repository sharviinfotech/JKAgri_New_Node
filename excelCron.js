// excelCron.js
const cron = require("node-cron");
const { startReadingEcelsFiles } = require("./readDashboardData");
const { startReadingEcelsOutStandingFiles } = require("./readOutstandingData");
const { processAndDeleteSOA } = require("./pdfSOAController");
const { processAndSendPdfs } = require("./pdfReader"); // Import the worker function directly

let isRunning = false;

const runFullSync = async (label) => {
    if (isRunning) {
        console.log(`⏳ [${label}] Previous sync still running, skipping...`);
        return;
    }

    isRunning = true;
    console.log(`🚀 ********************** [${label}] Full Sync Started: ${new Date().toLocaleString()} **********************`);

    try {
        // STEP 1: Delete SOAs from DB first
        console.log("🗑️ Step 1: Cleaning SOA records...");
        await processAndDeleteSOA();

        // STEP 2: Read Excel Data
        console.log("📊 Step 2: Reading Excel Files...");
        await startReadingEcelsFiles();
        await startReadingEcelsOutStandingFiles();

        // STEP 3: Process and Upload PDFs
        console.log("📤 Step 3: Processing/Uploading PDFs...");
        await processAndSendPdfs();

        console.log(`✅ ********************** [${label}] Full Sync Completed Successfully **********************`);
    } catch (err) {
        console.error(`❌ --- [${label}] Sync Failed:`, err.message);
    } finally {
        isRunning = false;
    }
};

// 1. Every Minute Sync
cron.schedule("* * * * *", () => runFullSync("Every Minute Sync"));

// 2. Morning 5 AM Sync (Note: changed to '0 5 * * *' to run exactly at 5:00:00)
cron.schedule("0 5 * * *", () => runFullSync("5 AM Morning Sync"));

// 3. Night 8 PM Sync
cron.schedule("0 20 * * *", () => runFullSync("8 PM Night Sync"));

// Testing (Every minute)
// cron.schedule("* * * * *", async () => {
//     console.log("⏰ Minute Sync started");
//     await processAndDeleteSOA();
//     // await startReadingEcelsFiles();
//     // await startReadingEcelsOutStandingFiles();
// });


// const cron = require("node-cron");
// const { startReadingEcelsFiles } = require("./readDashboardData");
// const { startReadingEcelsOutStandingFiles } = require("./readOutstandingData");
// const { processAndSendPdfs } = require("./pdfSOAController"); // cron-friendly function

// // Morning 9:00 AM
// cron.schedule("0 9 * * *", async () => {
//   console.log("⏰ Morning Excel + PDF Sync started");
//   await processAndSendPdfs();
//   await startReadingEcelsFiles();
//   await startReadingEcelsOutStandingFiles();
  
// });

// // Every minute (for testing)
// cron.schedule("* * * * *", async () => {
//   await processAndSendPdfs();
//   console.log("⏰ Test Excel + PDF Sync every minute");
//   await startReadingEcelsFiles();
//   await startReadingEcelsOutStandingFiles();
// });









// // const cron = require("node-cron");
// // const { startReadingEcelsFiles } = require("./readDashboardData");
// // const {startReadingEcelsOutStandingFiles} =require("./readOutstandingData")

// // // 🕘 Morning 9:00 AM
// // cron.schedule("0 9 * * *", async () => {
// //   console.log("⏰ Morning Excel Sync");
// //   await startReadingEcelsFiles();
// //   await startReadingEcelsOutStandingFiles()
// // });

// // // 🕕 Evening 6:00 PM
// // // cron.schedule("0 18 * * *", async () => {
// // //   console.log("⏰ Evening Excel Sync");
// // //   await startReadingEcelsFiles();
// // // await startReadingEcelsOutStandingFiles()
// // // });

// // // 🕕 Evening 5:40 PM
// // cron.schedule("* * * * *", async () => {
// //   console.log("⏰ Test Excel Sync at 5:40 PM");
// //   await startReadingEcelsFiles();
// //   await startReadingEcelsOutStandingFiles()
// // });
