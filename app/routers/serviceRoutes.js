const express = require("express");
const router = express.Router();
const controller = require("../controllers/serviceController");

// GET all services
router.get("/", controller.getAll);

// GET service by ID
router.get("/:id", controller.getById);

// POST new service
router.post("/", controller.create);

// PUT update service by ID
router.put("/:id", controller.update);

// DELETE service by ID
router.delete("/:id", controller.delete);

// DELETE all services
router.delete("/", controller.deleteAll);

module.exports = router;
