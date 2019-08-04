var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth');
router.post("/token", controller.loadHeaders, controller.gettoken);
module.exports = router;