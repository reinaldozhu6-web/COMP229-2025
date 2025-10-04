const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        completion: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        collection: "projects"
    }
);

// Prevent OverwriteModelError
module.exports = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
