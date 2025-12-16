// mailService.js
const nodemailer = require("nodemailer");

// Create transporter for Outlook (Office 365 SMTP)
const transporter = nodemailer.createTransport({
 host: "smtp.office365.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: "sankalp@jkagri.com",
    pass: "jk@l2025",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// Function to send feedback/query email
async function sendQueryMail({ CustomerName, CustomerId, Queries,emailAddress,mobileNumber, feedbackType }) {
  try {
    const mailOptions = {
      from: `sankalp@jkagri.com`,
      to: `sunilkumar@sharviinfotech.com`, // send to same inbox or change as needed
      subject: `Sankalp - Customer Code - Feedback/Query`,
      html: `
      <h2>Dear Team,</h2>
        <h4>I would like to share the following feedback:</h4>
        <p><strong>Customer Name:</strong> ${CustomerName}</p>
        <p><strong>Customer ID:</strong> ${CustomerId}</p>
        <p><strong>Customer Email:</strong> ${emailAddress}</p>
        <p><strong>Customer Mobile:</strong> ${mobileNumber}</p>
        <p><strong>Feedback Type:</strong> ${feedbackType}</p>
        <p><strong>Feedback Details:</strong> ${Queries}</p>

        <p>Kindly review and take necessary action.</p>
        <div>Thanks and regards,</div>
       <div> ${CustomerName}</div>
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
