const axios = require("axios");

async function fetchInvoiceList() {
    try {
        const data = {
            
        }
        const response = await axios.post('http://localhost:3000/api/invoice/getAllInvoices', data);
        // console.log("response",response)
        // console.log("Invoice Data: 123", JSON.stringify(response.data.data, null, 2));
        const postResponse = response.data.data
        const pendingInvoices = postResponse.filter(invoice => invoice.status === "Pending");
        // console.log("postResponse", JSON.stringify(postResponse, null, 2));
        return pendingInvoices

    } catch (error) {
        console.error("Error fetching invoices:", error.message);
    }
}

module.exports = { fetchInvoiceList };
