const mongoose = require('mongoose');
const { reviewed } = require('../handlers/userHandler');

const userCountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        unique: true,
    },
 
    value: {
        type: Number,
        default: 800,
    },
});

// user creation 
const userCreationSchema = new mongoose.Schema({      
    userUniqueId:{
        type: Number,
        required: true,
        unique:true
    } ,
        userName: {
            type: String,
            required: true,
        },
        userFirstName: {
            type: String,
            required: true,
        },
        userLastName: {
            type: String,
            required: false,
        },
        userEmail: {
            type: String,
            required: true,
        },
        userContact: {
            type: String,
            required: true,
        },
        userPassword: {
            type: String,
            required: true,
        },
        userConfirmPassword: {
            type: String,
            required: true,
        },
        userStatus: {
            type: Boolean,
            required: true,
        },
        userActivity: {
            type: String,
            required: true,
        },
        
        
    
    
});


const customerCreationSchema = new mongoose.Schema({

    customerUniqueId:{
        type: Number,
        required: true,
        unique:true
    } ,
    customerName:{
        type:String,
        required:true
    },
    customerAddress:{
        type:String,
        required:true
    },
    customerCity:{
        type:String,
        required:true
    },
    customerState:{
        type:String,
        required:true
    },
    customerPincode:{
        type:String,
        required:true
    },
    customerGstNo:{
        type:String,
        required:true
    },
    customerPanNo:{
        type:String,
        required:true
    },
    customerEmail:{
        type:String,
        required:true
    },
    customerContact:{
        type:Number,
        required:true
    },
    customerAlernativecontact:{
        type:Number,
        required:false
    },
    customerCreditPeriod:{
        type:String,
        required:true
    }

})
const customerCountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        unique: true,
    },
 
    value: {
        type: Number,
        default: 800,
    },
});
const chargesCreationSchema = new mongoose.Schema({

    chargesUniqueId:{
        type: Number,
        required: true,
        unique:true
    } ,
    chargesName:{
        type:String,
        required:true
    },
   

})
const chargesCountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        unique: true,
    },
 
    value: {
        type: Number,
        default: 800,
    },
});


const capturedXlsxSchema = new mongoose.Schema({
    xlsxList: [
        {
            serialNo: String,   // Renamed from 'S.No'
            codeNo: String,     // Renamed from 'Code No'
            employeeName: String, // Renamed from 'Name of Employee'
            department: String,  // Ensure proper casing
            contractor: String,  // If needed (since it was missing in the logs)
        },
    ],
});
const pdfSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileData: { type: String, required: true }, // Base64 string
    pdfName: { type: String }, // ✅ Store extracted pdfName
    monthAndYear: { type: String } // ✅ Store extracted Month-Year
}, { timestamps: true });



const userCreation =mongoose.model('userCreation',userCreationSchema);
const userCount = mongoose.model('userCount',userCountSchema);
const customerCreation =mongoose.model('customerCreation',customerCreationSchema);
const customerCount= mongoose.model('customerCount',customerCountSchema)
const chargesCreation= mongoose.model('chargesCreation',chargesCreationSchema)
const chargesCount= mongoose.model('chargeCount',chargesCountSchema)
const xlsxCreation= mongoose.model('xlsxData',capturedXlsxSchema)
// const pdfCreate = mongoose.model('Pdf', pdfSchema);
const pdfCreate = mongoose.model('All_Pdfs_Data', pdfSchema);




// Export as an object
module.exports = { userCreation,userCount,customerCreation,customerCount,chargesCreation,chargesCount,xlsxCreation,pdfCreate};
