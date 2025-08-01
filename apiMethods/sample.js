
const nodemailer = require('nodemailer');
const sendCredentials = async (req, res) => {
    console.log('sendCredentials',req.body)
   
    try {
      console.log(`Attempting to fetch credentials for`, req.body);
   
      // Fetch user credentials
      const userData = await thirdPartyService.getUserCredentialsByEmail(req.body);
   
      if (!userData?.ZUSER || !userData?.ZPASSWORD) {
        return res.status(404).json({
          status: false,
          message: 'User credentials not found',
        });
      }
   
      const { ZUSER, ZPASSWORD } = userData;
   const email=req.body.ZMAIL
   console.log("mailsent", email)
      const mailOptions = {
        from: 'noreply.itapps@hbl.in',
        to: email,
        subject: 'Your Login Credentials',
        html: `
         <p>Dear User,</p>
   
  <p>We are pleased to provide you with your login credentials:</p>
   
  <p><strong>Username:</strong> ${ZUSER}</p>  
  <p><strong>Password:</strong> ${ZPASSWORD}</p>  
   
  <p>For security reasons, please keep this information strictly confidential. If you have any questions or require assistance, do not hesitate to contact our support team.</p>  
   
  <p>Best regards,</p>  
  <p> Sharviinfotech</p>  
   
        `,
      };
   
      // Send the email
      await transporter.sendMail(mailOptions);
   
      console.log('Email sent successfully to:', email);
   
      res.status(200).json({
        status: true,
        message: 'Email sent successfully with credentials!',
      });
   
      // Send a password alert
      await thirdPartyService.sendPasswordAlert(email);
    } catch (error) {
      console.error('Error sending credentials:', error.message);
      res.status(500).json({
        status: false,
        message: 'Failed to send email.',
        error: error.message,
      });
    }
  };


  const transporter = nodemailer.createTransport({
    host: "smtp.logix.in",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: "noreply.itapps@hbl.in",
      pass: "Happy#1968",
    },
  });
   
  // Helper function to send emails
  const sendEmails = async (recipient, subject, message) => {
    const mailOptions = {
      from: 'noreply.itapps@hbl.in',
      to: 'sriramunaidug@sharviinfotech.com',
      subject: 'Calibration due date is pending',
      text: message,
    };
   
    return transporter.sendMail(mailOptions);
  };