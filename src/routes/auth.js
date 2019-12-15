var express = require("express");
var router = express.Router();
var controller = require("../controllers/auth");
router.delete("/logout", controller.loadHeaders, controller.logout);
router.post("/token", controller.loadHeaders, controller.gettoken);
router.post("/checkserver", controller.loadHeaders, controller.checkServer);
module.exports = router;
