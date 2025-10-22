// mailService.js
const nodemailer = require("nodemailer");

// Create transporter for Outlook (Office 365 SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "retailer@jkagri.com",
    pass: "JKAL@2025",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// Function to send feedback/query email
async function sendQueryMail({ CustomerName, CustomerId, Queries }) {
  try {
    const mailOptions = {
      from: `<retailer@jkagri.com>`,
      to: `<retailer@jkagri.com>`, // send to same inbox or change as needed
      subject: `Customer Query from ${CustomerName} (ID: ${CustomerId})`,
      html: `
        <h2>Customer Query</h2>
        <p><strong>Customer ID:</strong> ${CustomerId}</p>
        <p><strong>Customer Name:</strong> ${CustomerName}</p>
        <p><strong>Query:</strong> ${Queries}</p>
        <p><i>Sent on: ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata"
        })}</i></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully:", info.messageId);
    return true;
  } catch (err) {
    console.error("Mail send failed:", err);
    return false;
  }
}

module.exports = { sendQueryMail };
