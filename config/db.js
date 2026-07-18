const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Fallback default safe local IP loopback standard string
        const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/complaint_management_db";
        
        console.log(`[Database Setup Diagnostics]: Initializing Engine on targets...`);
        const conn = await mongoose.connect(dbUri);
        console.log(`📢 MongoDB Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Engine Connection Error: ${error.message}`);
        // Exit process if connection fails to avoid port hanging
        process.exit(1);
    }
};

module.exports = connectDB;
