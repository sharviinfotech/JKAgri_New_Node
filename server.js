const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require('body-parser');
const { readExcelFile } = require('./fileReader');
const { startPdfProcessing } = require('./pdfReader');

const app = express();
// const PORT = process.env.PORT || 3000;
// const SERVER_URL = process.env.SERVER_URL || "http://192.168.13.64";

const { BASE_SERVER_URL, BASE_PORT } = require('./baseFile');

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());



// Async function to initialize app
(async () => {
  try {
    connectDB();
    console.log("✅ Database connected");
    const routes = require("./routes");
    // Load API routes
    app.use("/api", routes);
    // Process files after DB connection
    // readExcelFile();
    startPdfProcessing();
    require("./useractivityreader");
    // Start server only after DB is ready
    app.listen(BASE_PORT, () => {
     console.log(`🚀 Server running on ${BASE_SERVER_URL}:${BASE_PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1); // Exit the process if DB connection fails
  }
})();


