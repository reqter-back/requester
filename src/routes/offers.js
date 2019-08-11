var express = require("express");
var router = express.Router();
var controller = require("../controllers/quoteController");
var auth = require("../controllers/auth");

router.put("/accept/:id", auth.verifyToken, controller.customerAccpet);
module.exports = router;
