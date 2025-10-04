const Service = require("../models/service");

exports.getAll = async (req, res) => {
    try {
        const data = await Service.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await Service.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Service not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = new Service(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: "Service not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: "Service deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Service.deleteMany();
        res.json({ message: "All services deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
