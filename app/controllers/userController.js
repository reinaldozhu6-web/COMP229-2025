const User = require("../models/user");

exports.getAll = async (req, res) => {
    try {
        const data = await User.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "User not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = new User(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: "User not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await User.deleteMany();
        res.json({ message: "All users deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
