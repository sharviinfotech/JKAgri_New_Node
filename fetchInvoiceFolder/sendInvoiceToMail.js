
const axios = require("axios");
const nodemailer = require("nodemailer");
const recevieInvoiceSendToMail = require('../fetchInvoiceFolder/intialmailsend')


// const sendInvoiceDataToEmail = async (toEmail, postTotalInvoiceList) => {
//     console.log("toEmail", toEmail, "postTotalInvoiceList", typeof (postTotalInvoiceList));
//     let arrayData = [];
//     arrayData.push(JSON.stringify(JSON.parse(postTotalInvoiceList)));
//     console.log("arrayData", arrayData);

//     // Create a transporter using SMTP or any other email service
//     let transporter = nodemailer.createTransport({
//         service: "sunilakula1919@gmail.com", // or another service like 'outlook', 'smtp.mailtrap.io', etc.
//         auth: {
//             user: "<your-email>@gmail.com", // Your email address
//             pass: "<your-email-password>", // Your email password (consider using environment variables for security)
//         },
//     });

//     if (Array.isArray(arrayData)) {
//         const tableRows = arrayData
//             .map((data) => {
//                 const header = data.header || {};
//                 return `
//                     <tr>
//                         <td>${data.invoiceUniqueNumber || 'N/A'}</td>
//                         <td>${header.ProformaInvoiceDate || 'N/A'}</td>
//                         <td>${header.ProformaCustomerName || 'N/A'}</td>
//                         <td>${header.ProformaTypeOfAircraft || 'N/A'}</td>
//                         <td>${header.ProformaCity || 'N/A'}</td>
//                         <td>${header.BookingSector || 'N/A'}</td>
//                         <td>${header.BookingDateOfJourny || 'N/A'}</td>
//                         <td>${header.grandTotal || 'N/A'}</td>
//                         <td>
//                             <a href="javascript:void(0);" onclick="approveInvoice()" style="padding: 5px 10px; background-color: green; color: white; text-decoration: none; margin-right: 5px;">
//                                 Approve
//                             </a>
//                             <a href="javascript:void(0);" onclick="approveInvoice()" style="padding: 5px 10px; background-color: red; color: white; text-decoration: none;">
//                                 Reject
//                             </a>
//                         </td>
//                     </tr>
//                 `;
//             })
//             .join("");

//         let mailOptions = {
//             from: "sunilkumar@sharviinfotech.com", // sender address
//             to: toEmail, // recipient address
//             subject: "Invoice Pending Approval", // Subject line
//             html: `
//                 <p>Hi Team,</p>
//                 <p>Please find below the Invoice pending for your approval:</p>
//                 <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
//                     <thead style="background-color: #f2f2f2;">
//                         <tr>
//                             <th class="text-nowrap">Invoice Number</th>
//                             <th class="text-nowrap">Invoice Date</th>
//                             <th class="text-nowrap">Customer Name</th>
//                             <th class="text-nowrap">Type Of Aircraft</th>
//                             <th class="text-nowrap">City</th>
//                             <th class="text-nowrap">Destination</th>
//                             <th class="text-nowrap">Date Of Journey</th>
//                             <th class="text-nowrap">Total Amount</th>
//                             <th class="text-nowrap">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${tableRows}
//                     </tbody>
//                 </table>
//                 <p>Thanks,<br>The Approval Team</p>
//             `,
//         };

//         try {
//             await transporter.sendMail(mailOptions);
//             console.log("Email sent successfully!");
//         } catch (error) {
//             console.error("Error sending email:", error);
//         }
//     } else {
//         console.log("Invalid data format");
//     }
// };

// module.exports = { sendInvoiceDataToEmail };
const transporter = nodemailer.createTransport({
    host: "smtp.logix.in",
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: "noreply.itapps@hbl.in",
        pass: "Happy#1968",
    },
});


const sendInvoiceDataToEmail = async (toEmail, postTotalInvoiceList) => {
    // console.log("toEmail", toEmail, "postTotalInvoiceList", typeof (postTotalInvoiceList));
    console.log("toEmail", toEmail,);

    let arrayData = [];

    // Parse only once and ensure it's an array
    try {
        arrayData = JSON.parse(postTotalInvoiceList);
        // console.log("Parsed arrayData:", arrayData);
    } catch (e) {
        console.error("Error parsing postTotalInvoiceList:", e);
        return;
    }

    // console.log("arrayData:", arrayData);
    // console.log(Array.isArray(arrayData)); // Should print true if the data is an array

    // Ensure dataArray is an array
    let dataArray = Array.isArray(arrayData) ? arrayData : [arrayData];
    // console.log(Array.isArray(dataArray)); // Should print true

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        // console.error("Error: dataArray is undefined or empty", dataArray);
        tableRows = "<tr><td colspan='9'>No invoices found</td></tr>";
        return
    } else {
        // console.log("dataArray type:", typeof (dataArray), "dataArray", dataArray);

        // Ensure no undefined or null items in the array
        dataArray = dataArray.filter(item => item !== undefined && item !== null);
        // console.log("dataArray filtered:", dataArray);

        // Assuming dataArray is an array of objects, now you can map through it
        tableRows = dataArray.map((data, index) => {
            if (!data) {
                console.error("Error: data object is undefined", data);
                return "";
            }

            const header = data.header || {}; // Ensure header exists
            return `
                <tr>
                    <td>${data.invoiceUniqueNumber || 'N/A'}</td>
                    <td>${header.ProformaInvoiceDate || 'N/A'}</td>
                    <td>${header.ProformaCustomerName || 'N/A'}</td>
                    <td>${header.ProformaTypeOfAircraft || 'N/A'}</td>
                    <td>${header.ProformaCity || 'N/A'}</td>
                    <td>${header.BookingSector || 'N/A'}</td>
                    <td>${header.startBookingDateOfJourny || 'N/A'}/${header.endBookingDateOfJourny || 'N/A'}</td>
                    <td>${data.grandTotal || 'N/A'}</td>
                    <td>
    <div style="display: flex; justify-content: center; gap: 10px;">
        <a href="http://localhost:3000/api/invoice/approveorrejectMail?originalUniqueId=${data.originalUniqueId}&status=Approved&reason=approvedFromMail&invoiceApprovedOrRejectedByUser=MD&invoiceUniqueNumber=${data.invoiceUniqueNumber}" 
           style="background-color: green; color: white; padding: 5px 10px; text-decoration: none; border-radius: 5px; text-align: center;">
           Approve
        </a>

        <a href="http://localhost:3000/api/invoice/approveorrejectMail?originalUniqueId=${data.originalUniqueId}&status=Rejected&reason=rejectedFromMail&invoiceApprovedOrRejectedByUser=MD&invoiceUniqueNumber=${data.invoiceUniqueNumber}" 
           style="background-color: red; color: white; padding: 5px 10px; text-decoration: none; border-radius: 5px; text-align: center;">
           Reject
        </a>
    </div>
</td>


                    
                </tr>
            `;
        }).join(""); // Ensure dataArray is an array

    }
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        document.addEventListener('click', (event) => {
            console.log("Click event detected");

            if (event.target.classList.contains('approve-btn')) {
                const originalUniqueId = event.target.getAttribute('data-invoice-reference');
                console.log('Approve button clicked for originalUniqueId:', originalUniqueId);
                approveInvoice(originalUniqueId);
            }

            if (event.target.classList.contains('reject-btn')) {
                const originalUniqueId = event.target.getAttribute('data-invoice-reference');
                console.log('Reject button clicked for originalUniqueId:', originalUniqueId);
                rejectInvoice(originalUniqueId);
            }
        });
    } else {
        console.log("document is not available, likely running in a server environment.");
    }



    const mailOptions = {
        from: 'noreply.itapps@hbl.in',
        to: toEmail,  // Use the toEmail parameter instead of obj.userEmail
        subject: 'Invoice Pending Approval',
        html: `
        <p>Hi Team,</p>
        <p>Please find below the Invoice pending for your approval:</p>
        <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    <th class="text-nowrap">Invoice Number</th>
                    <th class="text-nowrap">Invoice Date</th>
                    <th class="text-nowrap">Customer Name</th>
                    <th class="text-nowrap">Type Of Aircraft</th>
                    <th class="text-nowrap">City</th>
                    <th class="text-nowrap">Destination</th>
                    <th class="text-nowrap">Date Of Journey</th>
                    <th class="text-nowrap">Total Amount</th>
                    <th class="text-nowrap">Action</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
        <p>Thanks,<br>The Approval Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Invoice email sent successfully");
    } catch (error) {
        console.error("Error sending invoice email", error);
    }
}

// Assuming you have approveInvoice and rejectInvoice functions defined somewhere
const approveInvoice = async (originalUniqueId) => {
    console.log('Invoice approved for reference:', originalUniqueId);

    const requestBody = {
        originalUniqueId: originalUniqueId,
        status: "Approved",
        reason: "ApprrovedFromMail",
        invoiceApprovedOrRejectedByUser: "MD"
    };

    try {
        const response = await fetch('http://localhost:3000/api/invoice/invoiceApprovedOrRejected', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Invoice approved:", result);
            
        } else {
            console.error("Failed to approve invoice:", result);
        }
    } catch (error) {
        console.error("Error approving invoice:", error);
    }
};

const rejectInvoice = async (originalUniqueId) => {
    console.log('Invoice rejected for reference:', originalUniqueId);

    const requestBody = {
        originalUniqueId: originalUniqueId,
        status: "Rejected",
        reason: "RejectedFromMail",
        invoiceApprovedOrRejectedByUser: "MD"
    };

    try {
        const response = await fetch('http://localhost:3000/api/invoice/invoiceApprovedOrRejected', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Invoice rejected:", result);
           
        } else {
            console.error("Failed to reject invoice:", result);
        }
    } catch (error) {
        console.error("Error rejecting invoice:", error);
    }
};



const sendEmails = async (recipient, subject, message) => {
    const mailOptions = {
        from: 'noreply.itapps@hbl.in',
        to: 'sriramunaidug@sharviinfotech.com',
        subject: '',
        text: message,
    };

    return transporter.sendMail(mailOptions);
};





module.exports = { sendInvoiceDataToEmail };