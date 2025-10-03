const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: String,
        email: { type: String, required: true, unique: true },
        firstName: String,
        lastName: String,
        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true   // 创建后不能再修改
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { collection: "users" } // 指定集合名
);

module.exports = mongoose.model("User", UserSchema);
