
const{sendInvoiceDataToEmail} =require('./sendInvoiceToMail')




const send = async  (s) =>{
    try {
        console.log("postInvoiceListInMail");

        const reqBody = {
            userActivity: "MD" // or "ADMIN" based on your requirement
        };

        // Call the API
        const response = await fetch("http://localhost:3000/api/invoice/getAllInvoices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });

        // Parse the response
        const responseData = await response.json();
        if (responseData.status !== 200) {
            throw new Error(responseData.message || "Failed to fetch invoice data");
        }

        const invoiceData = responseData.data;
        console.log("Invoice data received:", invoiceData);

        // Send email
        const email = "sunilkumar@sharviinfotech.com";
        await sendInvoiceDataToEmail(email, JSON.stringify(invoiceData, null, 2));

    } catch (error) {
        console.error("Error fetching invoice data:", error.message);
    }
}

module.exports = {send}