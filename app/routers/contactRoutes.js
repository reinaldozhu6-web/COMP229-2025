const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");

// GET all contacts
router.get("/", controller.getAll);

// GET contact by ID
router.get("/:id", controller.getById);

// POST new contact
router.post("/", controller.create);

// PUT update contact by ID
router.put("/:id", controller.update);

// DELETE contact by ID
router.delete("/:id", controller.delete);

// DELETE all contacts
router.delete("/", controller.deleteAll);

module.exports = router;
