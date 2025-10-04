const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
    },
    { collection: "contacts" }
);

module.exports = mongoose.model("Contact", ContactSchema);
