const fs = require("fs");
const axios = require("axios");
const path = require("path");

const PDF_FOLDER_PATH = "D:/jk_pdfs";
const { BASE_SERVER_URL, BASE_PORT } = require("./baseFile");

// const CHECK_PDF_API = `http://${BASE_SERVER_URL}:${BASE_PORT}/api/get/getPdf`;
// const PDF_SUBMIT_API = `http://${BASE_SERVER_URL}:${BASE_PORT}/api/get/pdfSave`;
const CHECK_PDF_API = `${BASE_SERVER_URL}:${BASE_PORT}/api/get/getPdf`;
const PDF_SUBMIT_API = `${BASE_SERVER_URL}:${BASE_PORT}/api/get/pdfSave`;


// Main PDF processing function
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

    const checkResults = await Promise.all(pdfFiles.map(file =>
      axios.get(CHECK_PDF_API, { params: { fileName: file } })
        .then(res => ({ file, exists: res.data.exists }))
        .catch(err => {
          console.error(`🚨 Error checking ${file}:`, err?.response?.data || err.message);
          return { file, exists: false }; // Assume not found if error
        })
    ));

    const newPdfs = checkResults.filter(r => !r.exists);

    if (newPdfs.length === 0) {
      console.log("✅ All PDFs already exist. Nothing new to upload.");
      return;
    }

    console.log(`📄 ${newPdfs.length} new PDFs found. Uploading...`);

    const uploadResults = await Promise.all(newPdfs.map(({ file }) => {
      const filePath = path.join(PDF_FOLDER_PATH, file);

      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Skipped missing file: ${file}`);
        return;
      }

      const fileBuffer = fs.readFileSync(filePath);
      const base64 = fileBuffer.toString("base64");
      const pdfName = file.replace(/\.pdf$/i, "");

      return axios.post(PDF_SUBMIT_API, {
        fileName: file,
        pdfName,
        fileData: base64
      }, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 30000 // 30 seconds
      })
        .then(res => {
          console.log(`✅ Uploaded: ${file} - ${res.data.message}`);
        })
        .catch(err => {
           console.log(`✅ Failed to upload File`);
          // console.error(`🚨 Failed to upload ${file}:`, err?.response?.data || err.message);
        });
    }));

    await Promise.all(uploadResults);
  } catch (err) {
    console.error("🚨 Error in processAndSendPdfs:", err.message || err);
  }
};

// Scheduler to run PDF sync repeatedly
const startPdfProcessing = () => {
  console.log("🚀 Running PDF sync now...");

  processAndSendPdfs().then(() => {
    console.log("✅ Initial PDF sync complete. Scheduling every 1 minute...");

    setInterval(() => {
      console.log("⏳ Checking for new PDFs...");
      processAndSendPdfs();
    }, 60 * 1000); // Every 60 seconds
  });
};

module.exports = { startPdfProcessing };


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


