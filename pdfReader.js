const fs = require("fs");
const axios = require("axios");
const path = require("path");
const cron = require('node-cron');
const PDF_FOLDER_PATH = "D:/jk_pdfs";
const { BASE_SERVER_URL, BASE_PORT } = require("./baseFile");

// const CHECK_PDF_API = `http://${BASE_SERVER_URL}:${BASE_PORT}/api/get/getPdf`;
// const PDF_SUBMIT_API = `http://${BASE_SERVER_URL}:${BASE_PORT}/api/get/pdfSave`;
const CHECK_PDF_API = `${BASE_SERVER_URL}:${BASE_PORT}/api/JkAgri/getPdf`;
const PDF_SUBMIT_API = `${BASE_SERVER_URL}:${BASE_PORT}/api/JkAgri/pdfSave`;


// Main PDF processing function
// const processAndSendPdfs = async () => {
//   try {
//     if (!fs.existsSync(PDF_FOLDER_PATH)) {
//       console.log("❌ PDF folder not found:", PDF_FOLDER_PATH);
//       return;
//     }

//     const pdfFiles = fs.readdirSync(PDF_FOLDER_PATH)
//       .filter(file => file.toLowerCase().endsWith(".pdf"));

//     if (pdfFiles.length === 0) {
//       console.log("⚠️ No PDFs found in the folder.");
//       return;
//     }

//     console.log(`📤 Found ${pdfFiles.length} PDFs. Checking for duplicates...`);

//     const checkResults = await Promise.all(pdfFiles.map(file =>
//       axios.get(CHECK_PDF_API, { params: { fileName: file } })
//         .then(res => ({ file, exists: res.data.exists }))
//         .catch(err => {
//           // console.error(`🚨 Error checking ${file}:`, err?.response?.data || err.message);
//           return { file, exists: false }; // Assume not found if error
//         })
//     ));

//     const newPdfs = checkResults.filter(r => !r.exists);

//     if (newPdfs.length === 0) {
//       console.log("✅ All PDFs already exist. Nothing new to upload.");
//       return;
//     }

//     console.log(`📄 ${newPdfs.length} new PDFs found. Uploading...`);

//     const uploadResults = await Promise.all(newPdfs.map(({ file }) => {
//       const filePath = path.join(PDF_FOLDER_PATH, file);

//       if (!fs.existsSync(filePath)) {
//         console.warn(`⚠️ Skipped missing file: ${file}`);
//         return;
//       }

//       const fileBuffer = fs.readFileSync(filePath);
//       const base64 = fileBuffer.toString("base64");
//       const pdfName = file.replace(/\.pdf$/i, "");

//       return axios.post(PDF_SUBMIT_API, {
//         fileName: file,
//         pdfName,
//         fileData: base64
//       }, {
//         maxContentLength: Infinity,
//         maxBodyLength: Infinity,
//         timeout: 30000 // 30 seconds
//       })
//         .then(res => {
//           console.log(`✅ Uploaded: ${file} - ${res.data.message}`);
//         })
//         .catch(err => {
//           //  console.log(`✅ Failed to upload File`);
//           // console.error(`🚨 Failed to upload ${file}:`, err?.response?.data || err.message);
//         });
//     }));

//     await Promise.all(uploadResults);
//   } catch (err) {
//     console.error("🚨 Error in processAndSendPdfs:", err.message || err);
//   }
// };
const processAndSendPdfs = async () => {
  try {
    if (!fs.existsSync(PDF_FOLDER_PATH)) {
      console.log("❌ PDF folder not found:", PDF_FOLDER_PATH);
      return;
    }

    const pdfFiles = fs.readdirSync(PDF_FOLDER_PATH)
      .filter(file => file.toLowerCase().endsWith(".pdf"));

    if (pdfFiles.length === 0) {
      console.log("⚠️ No PDFs found in the folder.");
      return;
    }

    console.log(`📤 Found ${pdfFiles.length} PDFs. Checking for duplicates...`);

    const checkResults = await Promise.all(
      pdfFiles.map(file =>
        axios.get(CHECK_PDF_API, { params: { fileName: file } })
          .then(res => ({ file, exists: res.data.exists }))
          .catch(() => ({ file, exists: false }))
      )
    );

    const newPdfs = checkResults.filter(r => !r.exists);

    if (!newPdfs.length) {
      console.log("✅ All PDFs already exist. Nothing new to upload.");
      return;
    }

    console.log(`📄 ${newPdfs.length} new PDFs found. Uploading...`);

    // 🔴 Upload SEQUENTIALLY (important)
    for (const { file } of newPdfs) {

      const filePath = path.join(PDF_FOLDER_PATH, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File missing: ${file}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(filePath);
      const base64 = fileBuffer.toString("base64");

      const pdfName = file.replace(/\.pdf$/i, "");

      // -----------------------------
      // ✅ Extract customerCode
      // Example: 2300006817_CRN_12001919_11-01-2026
      // -----------------------------
      const parts = pdfName.split("_");


      let customerCode = null;
      let docDate = null;
      const DOC_TYPES = ["CRN", "DRN", "SOA", "INV", "COP", "ABS", "AR", "BAF"];

      if (pdfName.startsWith("SOA_")) {
        // SOA format: SOA_customerCode_date
        const parts = pdfName.split("_");
        customerCode = parts[1] || null;
        docDate = parts[2] || null; // Optional if you want to send date too
      } else {
        // Other document types: e.g., 2300006817_CRN_12001919_11-01-2026
        const parts = pdfName.split("_");
        for (let i = 0; i < parts.length; i++) {
          if (DOC_TYPES.includes(parts[i])) {
            customerCode = parts[i + 1] || null;
            break;
          }
        }
      }

      // Validate customerCode
      if (!customerCode || !/^\d{6,12}$/.test(customerCode)) {
        console.warn(`⚠️ Invalid customerCode in ${file}`);
        customerCode = null;
      }

      try {
        const res = await axios.post(
          PDF_SUBMIT_API,
          {
            fileName: file,
            fileData: base64,
            customerCode // ✅ explicitly send
          },
          {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            // timeout: 5 * 60 * 1000 // 5 minutes
          }
        );

        console.log(`✅ Uploaded pdfReaderfile: ${file} (${customerCode})`);

      } catch (err) {
        console.error(
          `🚨 Upload failed: ${file}`,
          err?.response?.data || err.message
        );
      }
    }

  } catch (err) {
    console.error("🚨 Error in processAndSendPdfs:", err.message || err);
  }
};

// Scheduler to run PDF sync repeatedly
// const startPdfProcessing = () => {
//   console.log("🚀 Running PDF sync now...");

//   processAndSendPdfs().then(() => {
//     console.log("✅ Initial PDF sync complete. Scheduling every 1 minute...");

//     setInterval(() => {
//       console.log("⏳ Checking for new PDFs...");
//       processAndSendPdfs();
//     }, 60 * 1000); // Every 60 seconds
//   });
// };
let isProcessing = false;

// const startPdfProcessing = () => {
//   console.log("🚀 PDFREADER FILE Cron Scheduler Initialized...");

//   // Schedule task to run every minute
//   // Syntax: '* * * * *' (Minute, Hour, Day of Month, Month, Day of Week)
//   cron.schedule('* * * * *', async () => {
//     if (isProcessing) {
//       console.log("⏳ Previous task still running, skipping this minute.");
//       return;
//     }

//     isProcessing = true;
//     console.log(`⏰ Cron Triggered at: ${new Date().toLocaleString()}`);

//     try {
//       await processAndSendPdfs();
//       console.log("✅ PDF sync for Every one minute task finished successfully.");
//     } catch (err) {
//       console.error("❌ Cron Job Error:", err);
//     } finally {
//       isProcessing = false;
//     }
//   });


//    cron.schedule('* 5 * * *', async () => {
//        console.log("********* night  5 AM started ")
//     if (isProcessing) {
//       console.log("⏳ Previous task still running, skipping this minute.");
//       return;
//     }

//     isProcessing = true;
//     console.log(`⏰ Cron Triggered at: ${new Date().toLocaleString()}`);

//     try {
//       await processAndSendPdfs();
//       console.log("✅ PDF sync for Every morning 5 AM  task finished successfully.");
//     } catch (err) {
//       console.error("❌ Cron Job Error:", err);
//     } finally {
//       isProcessing = false;
//     }
//   });


//    cron.schedule('* 20 * * *', async () => {
//     console.log("********* night  8 PM started ")
//     if (isProcessing) {
//       console.log("⏳ Previous task still running, skipping this minute.");
//       return;
//     }

//     isProcessing = true;
//     console.log(`⏰ Cron Triggered at: ${new Date().toLocaleString()}`);

//     try {
//       await processAndSendPdfs();
//       console.log("✅ PDF sync Every morning 8 PM task finished successfully.");
//     } catch (err) {
//       console.error("❌ Cron Job Error:", err);
//     } finally {
//       isProcessing = false;
//     }
//   });
// };
module.exports = {processAndSendPdfs };


// ---------------------------------------------------

// const processAndSendPdf = async () => {
//     try {
//         if (!fs.existsSync(PDF_FILE_PATH)) {
//             console.log("❌ PDF file not found.");
//             return;
//         }

//         const pdfBuffer = fs.readFileSync(PDF_FILE_PATH);
//         const base64Pdf = pdfBuffer.toString('base64');

//         const payload = { fileName: "sample.pdf", fileData: base64Pdf };

//         console.log("📤 Sending PDF data to API...");

//         const response = await axios.post(PDF_SUBMIT_API, payload, {
//             maxContentLength: Infinity, // Allow large content
//             maxBodyLength: Infinity
//         });

//         console.log("✅ PDF Data Submitted Successfully:", response.data.message);
//     } catch (error) {
//         console.error("🚨 Error Processing PDF:", error.message);
//     }
// };
// setInterval(processAndSendPdf, 1 * 60 * 1000); // 5 minutes in milliseconds



/**
 * GET API: Fetch PDF from DB and return as Base64
 */
// const getPdf = async (req, res) => {
//     try {
//         const pdfData = await pdfModel.findOne(); // Fetch first PDF from DB

//         if (!pdfData) {
//             return res.status(404).json({ message: "No PDF found", status: 404 });
//         }

//         return res.status(200).json({
//             fileName: pdfData.fileName,
//             fileData: pdfData.fileData, // Base64 String
//             status: 200
//         });

//     } catch (error) {
//         console.error("Error fetching PDF:", error);
//         return res.status(500).json({ message: "Failed to fetch PDF", error: error.message });
//     }
// };


