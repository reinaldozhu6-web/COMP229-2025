const Contact = require("../models/contact");

// Get all contacts
exports.getAll = async (req, res) => {
    try {
        const data = await Contact.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get contact by ID
exports.getById = async (req, res) => {
    try {
        const data = await Contact.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Contact not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Create new contact
exports.create = async (req, res) => {
    try {
        const data = new Contact(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update contact by ID
exports.update = async (req, res) => {
    try {
        const data = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: "Contact not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete contact by ID
exports.delete = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Contact deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete all contacts
exports.deleteAll = async (req, res) => {
    try {
        await Contact.deleteMany();
        res.json({ message: "All contacts deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
