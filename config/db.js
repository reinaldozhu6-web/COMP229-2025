const mongoose = require("mongoose");

module.exports = function () {

    const uri =
        process.env.MONGODB_URI ||
        "mongodb+srv://admin_db_user:keK4QJs8yXcuYnXm@cluster003.biow1it.mongodb.net/Portfolio?retryWrites=true&w=majority&appName=Cluster003";

    mongoose
        .connect(uri)
        .then(() => console.log("✅ Connected to MongoDB"))
        .catch((err) => console.error("❌ MongoDB connection error:", err));
};
