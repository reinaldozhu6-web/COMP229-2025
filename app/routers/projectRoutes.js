const express = require("express");
const router = express.Router();
const controller = require("../controllers/projectController");

// GET all projects
router.get("/", controller.getAll);

// GET project by ID
router.get("/:id", controller.getById);

// POST new project
router.post("/", controller.create);

// PUT update project by ID
router.put("/:id", controller.update);

// DELETE project by ID
router.delete("/:id", controller.delete);

// DELETE all projects
router.delete("/", controller.deleteAll);

module.exports = router;
