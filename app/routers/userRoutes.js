const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

// GET all users
router.get("/", controller.getAll);

// GET user by ID
router.get("/:id", controller.getById);

// POST new user
router.post("/", controller.create);

// PUT update user by ID
router.put("/:id", controller.update);

// DELETE user by ID
router.delete("/:id", controller.delete);

// DELETE all users
router.delete("/", controller.deleteAll);

module.exports = router;
