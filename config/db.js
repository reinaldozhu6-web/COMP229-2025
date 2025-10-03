const mongoose = require("mongoose");

module.exports = function () {
    mongoose.connect(
        "mongodb+srv://admin_db_user:keK4QJs8yXcuYnXm@cluster003.biow1it.mongodb.net/comp229db",
        {
            // 新驱动已经不需要 useNewUrlParser/useUnifiedTopology
        }
    ).catch(err => {
        console.error("❌ Initial connection error:", err);
    });

    let db = mongoose.connection;

    db.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
    });

    db.once("open", () => {
        console.log("✅ Connected to MongoDB");
    });

    return db;
};
