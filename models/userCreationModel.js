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
        tmCode:{
             type: String,
            required: false,
        },
        tmContact:{
             type: String,
            required: false,
        },
         chCode:{
             type: String,
            required: false,
        },
          chContact:{
             type: String,
            required: false,
        },
         // New fields
    currentLoginAt: { type: Date },   // latest login
    lastLoginAt: { type: Date },      // previous login
    last6MonthsStatus: { type: Boolean, default: true } // new field
    
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


const QueriesSchema = new mongoose.Schema({

    QueriesUniqueId:{
        type: Number,
        required: true,
        unique:true
    } ,
    CustomerName:{
        type:String,
        required:true
    },
    CustomerId:{
        type:String,
        required:true
    },
      emailAddress:{
        type:String,
        required:true
    },
      mobileNumber:{
        type:String,
        required:true
    },
      feedbackType:{
        type:String,
        required:true
    },
    Queries:{
        type:String,
        required:true
    },
   sentDateTimeAt: { type: Date }, 
})
const QueriesCountSchema = new mongoose.Schema({
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


const OrganizationHirarchySchema = new mongoose.Schema({

    OrganizationUniqueId:{
        type: Number,
        required: true,
        unique:true
    } ,
    nsmCode:{
        type:String,
        required:true
    },
    nsmName:{
        type:String,
        required:true
    },
      nsmContact:{
        type:String,
        required:true
    },
      
     ciCode:{
        type:String,
        required:true
    },
    ciName:{
        type:String,
        required:true
    },
      ciContact:{
        type:String,
        required:true
    },
     chCode:{
        type:String,
        required:true
    },
    chName:{
        type:String,
        required:true
    },
      chContact:{
        type:String,
        required:true
    },
     tmCode:{
        type:String,
        required:true
    },
    tmName:{
        type:String,
        required:true
    },
      tmContact:{
        type:String,
        required:true
    },
    savedDateTimeAt:{
        type: Date
    }
})
const OrganizationCount = new mongoose.Schema({
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
const DashboardSchema = new mongoose.Schema({
  customerCode: { type: String, required: true },

  totalValue: { type: Number, default: 0 },
  crnValue: { type: Number, default: 0 },
  drnValue: { type: Number, default: 0 },
  invoiceValue: { type: Number, default: 0 },
  soaValue: { type: Number, default: 0 },
  commercialValue: { type: Number, default: 0 },
  absValue: { type: Number, default: 0 },
  outstandingValue: { type: Number, default: 0 },

  savedAt: { type: Date, default: Date.now }
});


const userCreation =mongoose.model('userCreation',userCreationSchema);
const userCount = mongoose.model('userCount',userCountSchema);
const customerCreation =mongoose.model('customerCreation',customerCreationSchema);
const customerCount= mongoose.model('customerCount',customerCountSchema)
const chargesCreation= mongoose.model('chargesCreation',chargesCreationSchema)
const chargesCount= mongoose.model('chargeCount',chargesCountSchema)
const xlsxCreation= mongoose.model('xlsxData',capturedXlsxSchema)
// const pdfCreate = mongoose.model('Pdf', pdfSchema);
const pdfCreate = mongoose.model('All_Pdfs_Data', pdfSchema);

const QueriesData =mongoose.model('QueriesData',QueriesSchema);
const QueriesCount = mongoose.model('QueriesCount',QueriesCountSchema);

const OrganizationHirarchy =mongoose.model('OrganizationHirarchy',OrganizationHirarchySchema);
const OrgCount = mongoose.model('OrganizationCount',OrganizationCount);

const DashboardData = mongoose.model("DashboardData", DashboardSchema);


// Export as an object
module.exports = { userCreation,userCount,customerCreation,customerCount,chargesCreation,chargesCount,xlsxCreation,pdfCreate,QueriesData,QueriesCount,OrganizationHirarchy,OrgCount,DashboardData};
