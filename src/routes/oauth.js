var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/userController');
router.post("/token", ctrl.login);
router.post("/code", ctrl.requestcode);
module.exports = router;