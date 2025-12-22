module.exports = (() => {
    const express = require('express');
    const router = express.Router();
    const userHandler = require('../handlers/userHandler');
    router.post('/JkAgri/authenticationLogin', userHandler.submitLogin);
    router.post('/JkAgri/forgotPassword', userHandler.forgot);
    router.post('/JkAgri/deteleGlobal', userHandler.deleteData);
    // router.post('/get/xlsxDataSubmit',userHandler.postXlsx),
    // router.get('/get/capturedXlsxData',userHandler.setXlsx),
    router.post('/JkAgri/pdfSave', userHandler.pdfCreation),
        router.get('/JkAgri/getPdf', userHandler.savedPdf),
        router.get('/JkAgri/GetlistOfPdfs', userHandler.listOfPdfs),
        router.post('/JkAgri/userNewCreation', userHandler.userCreationNew);
    router.put('/JkAgri/updateExitUser/:UniqueId', userHandler.updateUserCreation);
    router.get('/JkAgri/getAllUserList', userHandler.getAllUser);
    router.post('/JkAgri/feedBackQueries', userHandler.Queries);
    router.get('/JkAgri/getAllQueries', userHandler.getAllQueries);

    router.post('/JkAgri/OrganizationSave', userHandler.orgSave);
    router.get('/JkAgri/getAllOrg', userHandler.getAllOrg);

    router.post('/JkAgri/getDashboardData', userHandler.getDashboarddata)
    router.post('/JkAgri/fetchDataBasedOnLogin', userHandler.fetchBasedonInput),
        router.post('/JkAgri/fetchOutstandingData', userHandler.outStandingDataList)
          router.get('/JkAgri/stateList', userHandler.stateList);
router.post('/JkAgri/ChangeORResetPassword',userHandler.crPassword);
    console.log('enter route')

    // router.post('/', userHandler.createUser);

    return router;
})();
