module.exports = (() => {
    const express = require('express');
    const router = express.Router();
    const userHandler = require('../handlers/userHandler');
    router.post('/invoice/authenticationLogin',userHandler.submitLogin);
    router.post('/invoice/forgotPassword',userHandler.forgot);
    router.post('/invoice/deteleGlobal',userHandler.deleteData);
    // router.post('/get/xlsxDataSubmit',userHandler.postXlsx),
    // router.get('/get/capturedXlsxData',userHandler.setXlsx),
    router.post('/get/pdfSave',userHandler.pdfCreation),  
    router.get('/get/getPdf',userHandler.savedPdf),
    router.get('/get/GetlistOfPdfs',userHandler.listOfPdfs),
    router.post('/invoice/userNewCreation',userHandler.userCreationNew);
    router.put('/invoice/updateExitUser/:UniqueId',userHandler.updateUserCreation);
    router.get('/invoice/getAllUserList',userHandler.getAllUser);
    console.log('enter route')
    
    // router.post('/', userHandler.createUser);

    return router;
})();
