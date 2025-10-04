const mongoose = require("mongoose");

module.exports = function () {
    mongoose
        .connect(
            "mongodb+srv://admin_db_user:keK4QJs8yXcuYnXm@cluster003.biow1it.mongodb.net/Portfolio"
        )
        .then(() => console.log("✅ Connected to MongoDB"))
        .catch((err) => console.error("❌ MongoDB connection error:", err));
};
