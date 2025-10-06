const mongoose = require('mongoose');

 const uri = "mongodb+srv://paramesh:do7zSGvCunwKJORR@cluster0.e4oz0ms.mongodb.net/JK_AGRI";
// const uri = "mongodb://SharviDb:Sharvi%401234@192.168.1.4:27017/JK_AGRI?authSource=admin&ssl=false";
// const uri = "mongodb://plantserver%5Cplant:JKal%402023@192.168.13.64:27017/JK_Agri_Database?authSource=admin&ssl=false";
// const uri = "mongodb://192.168.13.64:27017/JK_Agri_Database?authSource=admin&ssl=false";
// const uri = "mongodb://jk_user:jk_pass123@192.168.13.64:27017/JK_Agri_Database?authSource=JK_Agri_Database";
// const uri = "mongodb://jk_user:jk_pass123@192.168.13.64:27017/JK_Agri_Database?authSource=JK_Agri_Database";







const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000,
        });
        console.log("Database Connected successfully");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

module.exports = connectDB;


// server ip address 192.9.200.24
// user name IT-11
// password 
// SQL server name DESKTOP-UFFGBFI
// SQL username DESKTOP-UFFGBFI\IT-11


// const sql = require('mssql');

// const config = {
//   user: `DESKTOP-UFFGBFI\IT-11`,
//   password: 'Home@198100#',
//   server: '192.9.200.24', // Or your server name/IP
//   database: 'SQL',
//   options: {
//     encrypt: true, // Use if Azure SQL
//     trustServerCertificate: true // Use this for local development
//   }
// };

// sql.connect(config)
//   .then(() => console.log('Connected to SQL Server'))
//   .catch(err => console.error('Connection error:', err));

// module.exports = sql;
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('SQL', null, null, {
//   host: '192.9.200.24',
//   dialect: 'mssql',
//   port: 1433,
//   dialectOptions: {
//     authentication: {
//       type: 'ntlm',
//       options: {
//         domain: 'DESKTOP-UFFGBFI',
//         encrypt: false
//       }
//     }
//   }
// });


// // Test connection
// sequelize.authenticate()
//   .then(() => console.log('Connected to SQL Server via Sequelize'))
//   .catch(err => console.error('Sequelize connection error:', err));

// module.exports = sequelize;




// const config = {
//   server: '192.9.200.24',
//   database: 'etimetracklite1',
//   driver: 'msnodesqlv8',
//   options: {
//     encrypt: false,
//     trustServerCertificate: true, // Accept self-signed certificates
//     trustedConnection: true, // Enable Windows Authentication
//   },
//   authentication: {
//     type: 'ntlm',
//     options: {
//       userName: 'IT-11', // Your Windows username
//       password: 'Home@198100#', // Windows password
//       domain: 'DESKTOP-UFFGBFI' //  domain
//     }
//   },
// };

// async function connectDB() {
//   try {
//     let pool = await sql.connect(config);
//     console.log('Connected to SQL Server');
//     return pool;
//   } catch (err) {
//     console.error('Database connection failed:', err);
//   }
// }
// module.exports = { connectDB, sql,config };

