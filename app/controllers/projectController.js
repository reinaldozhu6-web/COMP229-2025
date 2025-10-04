const Project = require("../models/project");

exports.getAll = async (req, res) => {
    try {
        const data = await Project.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await Project.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Project not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = new Project(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: "Project not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Project.deleteMany();
        res.json({ message: "All projects deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
