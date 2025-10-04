const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { collection: "services" }
);

module.exports = mongoose.model("Service", ServiceSchema);
