const mongoose = require('mongoose');

async function connectToDb() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            authSource: 'mydatabase' // This line is essential!
        });
        console.log(' Connected to DB');
    } catch (err) {
        console.error(' Failed to connect to DB:', err);
    }
}

module.exports = connectToDb;