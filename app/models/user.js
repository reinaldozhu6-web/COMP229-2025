const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        created: { type: Date, default: Date.now, immutable: true },
        updated: { type: Date, default: Date.now },
    },
    { collection: "users" }
);

module.exports = mongoose.model("User", UserSchema);
