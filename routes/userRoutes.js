module.exports = (() => {
    const express = require('express');
    const router = express.Router();
    const userHandler = require('../handlers/userHandler');
    router.post('/JkAgri/authenticationLogin',userHandler.submitLogin);
    router.post('/JkAgri/forgotPassword',userHandler.forgot);
    router.post('/JkAgri/deteleGlobal',userHandler.deleteData);
    // router.post('/get/xlsxDataSubmit',userHandler.postXlsx),
    // router.get('/get/capturedXlsxData',userHandler.setXlsx),
    router.post('/JkAgri/pdfSave',userHandler.pdfCreation),  
    router.get('/JkAgri/getPdf',userHandler.savedPdf),
    router.get('/JkAgri/GetlistOfPdfs',userHandler.listOfPdfs),
    router.post('/JkAgri/userNewCreation',userHandler.userCreationNew);
    router.put('/JkAgri/updateExitUser/:UniqueId',userHandler.updateUserCreation);
    router.get('/JkAgri/getAllUserList',userHandler.getAllUser);
    router.post('/JkAgri/feedBackQueries',userHandler.Queries);
    console.log('enter route')
    
    // router.post('/', userHandler.createUser);

    return router;
})();
