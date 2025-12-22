const cron = require("node-cron");
const { startReadingEcelsFiles } = require("./readDashboardData");
const {startReadingEcelsOutStandingFiles} =require("./readOutstandingData")

// 🕘 Morning 9:00 AM
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Morning Excel Sync");
  await startReadingEcelsFiles();
  await startReadingEcelsOutStandingFiles()
});

// 🕕 Evening 6:00 PM
// cron.schedule("0 18 * * *", async () => {
//   console.log("⏰ Evening Excel Sync");
//   await startReadingEcelsFiles();
// await startReadingEcelsOutStandingFiles()
// });

// 🕕 Evening 5:40 PM
cron.schedule("* * * * *", async () => {
  console.log("⏰ Test Excel Sync at 5:40 PM");
  await startReadingEcelsFiles();
  await startReadingEcelsOutStandingFiles()
});
