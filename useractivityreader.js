// useractivityreader.js
const { userCreation } = require('./models/userCreationModel');
const { userLast6Months } = require("./baseFile");
// 🔹 Configurable values
const PRODUCTION = userLast6Months; // true = prod, false = testing

const CHECK_INTERVAL = PRODUCTION ? 24 * 60 * 60 * 1000 : 1 * 60 * 1000; // 1 day for prod, 1 min for test
const INACTIVITY_THRESHOLD = PRODUCTION ? 6 * 30 * 24 * 60 : 5; // 6 months in minutes for prod, 5 mins for test

async function checkInactiveUsers() {
    try {
        console.log("✅ Running inactive user check...");
        console.log(`⚙️ Mode: ${PRODUCTION ? 'Production' : 'Testing'}, Threshold: ${INACTIVITY_THRESHOLD} mins, Interval: ${CHECK_INTERVAL / 1000 / 60} mins`);

        const now = new Date();
        const users = await userCreation.find({ userActivity: 'USER' });

        for (let user of users) {
            const lastLogin = user.currentLoginAt || user.lastLoginAt;

            if (!lastLogin) {
                console.log(`ℹ️ User ${user.userName} has no login history. Skipping...`);
                continue;
            }

            // Difference in minutes
            const diffMinutes = (now - new Date(lastLogin)) / (1000 * 60);

            if (diffMinutes >= INACTIVITY_THRESHOLD) {
                if (user.userStatus !== false || user.last6MonthsStatus !== false) {
                    user.userStatus = false;
                    user.last6MonthsStatus = false;
                    await user.save();
                    console.log(`⚠️ User ${user.userName} inactivated due to inactivity.`);
                }
            } else {
                if (user.last6MonthsStatus !== true) {
                    user.last6MonthsStatus = true;
                    await user.save();
                    console.log(`✅ User ${user.userName} is active.`);
                }
            }
        }
    } catch (err) {
        console.error('🚨 Error checking inactive users:', err.message);
    }
}

// 🔹 Run check immediately on start
checkInactiveUsers();

// 🔹 Run check periodically
setInterval(checkInactiveUsers, CHECK_INTERVAL);

module.exports = { checkInactiveUsers };

























// // useractivityreader.js
// const { userCreation } = require('./models/userCreationModel');

// async function checkInactiveUsers() {
//     try {
//         console.log("✅ Running inactive user check...");

//         const now = new Date();
//         const users = await userCreation.find({ userActivity: 'USER' });

//         for (let user of users) {
//             const lastLogin = user.currentLoginAt || user.lastLoginAt;

//             if (!lastLogin) {
//                 console.log(`ℹ️ User ${user.userName} has no login history. Skipping...`);
//                 continue;
//             }

//             // 🔹 Difference in minutes
//             // const diffMinutes = (now - new Date(lastLogin)) / (1000 * 60); // 5 mins
//              const diffMonths = (now - new Date(lastLogin)) / (1000 * 60 * 60 * 24 * 30); // 6 months


//             if (diffMinutes >= 6) { 
//                 if (user.userStatus !== false || user.last6MonthsStatus !== false) {
//                     user.userStatus = false;
//                     user.last6MonthsStatus = false;
//                     await user.save();
//                     console.log(`⚠️ User ${user.userName} inactivated due to 2 minutes inactivity.`);
//                 }
//             } else {
//                 if (user.last6MonthsStatus !== true) {
//                     user.last6MonthsStatus = true;
//                     await user.save();
//                     console.log(`✅ User ${user.userName} is active (last login within 2 minutes).`);
//                 }
//             }
//         }
//     } catch (err) {
//         console.error('🚨 Error checking inactive users:', err.message);
//     }
// }

// // 🔹 Run check every 1 minute
// // setInterval(checkInactiveUsers, 60 * 1000); / 1 min
// setInterval(checkInactiveUsers, 24 * 60 * 60 * 1000); // 1 day

// // 🔹 Run immediately when server starts
// checkInactiveUsers();

// module.exports = { checkInactiveUsers };
