const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");

router.get("/hello", indexController.helloWorld);
router.get("/goodbye", indexController.goodbye);
router.get("/", indexController.home);

module.exports = router;
