var express = require('express');
var router = express.Router();
var controller = require('../controllers/requestController');
var auth = require('../controllers/auth');

router.post("/allnew", auth.verifyToken, controller.getnewapplications);
router.get("/opened", auth.verifyToken, controller.getopenedApplications);
router.get("/open/:id", auth.verifyToken, controller.openApplication);
router.get("/submit", auth.verifyToken, controller.submit);
router.get("/myapplications", auth.verifyToken, controller.getMyApplications);
router.get("/:id/offers", auth.verifyToken, controller.getOffers);
module.exports = router;