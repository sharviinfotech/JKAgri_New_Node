const cron = require("node-cron");
const { startReadingEcelsFiles } = require("./readDashboardData");
const { startReadingEcelsOutStandingFiles } = require("./readOutstandingData");
const { processAndDeleteSOA } = require("./pdfSOAController");
const { processAndSendPdfs } = require("./pdfReader"); 
const { processOrganizationCSV,processUserCSV } = require("./readOrganizationData");

let isRunning = false;

const runFullSync = async (label) => {
    if (isRunning) {
        console.log(`⏳ [${label}] Previous sync still running, skipping...`);
        return;
    }

    isRunning = true;
    console.log(`🚀 ********** [${label}] Full Sync Started: ${new Date().toLocaleString()} **********`);

    try {
        // NEW STEP: Process Organization CSV from D:/
        console.log("🏢 Step 0: Syncing Organization Hierarchy...");
        await processOrganizationCSV();
        await processUserCSV()

        // STEP 1: Delete SOAs from DB
        console.log("🗑️ Step 1: Cleaning SOA records...");
        await processAndDeleteSOA();

        // STEP 2: Read Excel Data
        console.log("📊 Step 2: Reading Excel Files...");
        await startReadingEcelsFiles();
        await startReadingEcelsOutStandingFiles();

        // STEP 3: Process and Upload PDFs
        console.log("📤 Step 3: Processing/Uploading PDFs...");
        await processAndSendPdfs();

        console.log(`✅ ********** [${label}] Full Sync Completed Successfully **********`);
    } catch (err) {
        console.error(`❌ --- [${label}] Sync Failed:`, err.message);
    } finally {
        isRunning = false;
    }
};

// Schedules
cron.schedule("0 5 * * *", () => runFullSync("5 AM Morning Sync"));
cron.schedule("0 20 * * *", () => runFullSync("8 PM Night Sync"));

// For testing (Uncomment if needed)
cron.schedule("* * * * *", () => runFullSync("Minute Sync"));