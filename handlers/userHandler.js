module.exports = (() => {
    const userMethods = require('../apiMethods/reportMethods');
    const filedata = require('../fileReader')
   
    return {
       
       
        submitLogin:(req,res)=>userMethods.userLogin(req,res),
        forgot:(req,res)=>userMethods.forgotPassword(req,res),
        deleteData:(req,res)=>userMethods.deleteGlobally(req,res),
        // postXlsx:(req,res)=>userMethods.xlsxSubmit(req,res),
        // setXlsx:(req,res)=>filedata.readExcelFile(req,res)
        // setXlsx:(req,res)=>userMethods.getXlsx(req,res),
        pdfCreation:(req,res)=>userMethods.pdfSubmit(req,res),
        savedPdf:(req,res)=>userMethods.getPdf(req,res),
        listOfPdfs:(req,res)=>userMethods.allPdfList(req,res),
        userCreationNew: (req, res) => userMethods.userCreationSave(req, res),
        getAllUser:(req,res)=>userMethods.getAllUserLists(req,res),
        updateUserCreation:(req,res)=>userMethods.updateUserCreation(req,res),
        Queries:(req,res)=>userMethods.QueriesSave(req,res)
        
    };
})();
