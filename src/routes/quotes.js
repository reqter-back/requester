var express = require('express');
var router = express.Router();
var controller = require('../controllers/quoteController');
var auth = require('../controllers/auth');

router.post("/issueOffer", auth.verifyToken, controller.getnewapplications);
router.get("/myoffers", auth.verifyToken, controller.getnewapplications);
router.get("/acceptedoffers", auth.verifyToken, controller.getAcceptedOffers);
router.get("/wonoffers", auth.verifyToken, controller.getWonOffers);
router.get("/lostoffers", auth.verifyToken, controller.getLostOffers);
module.exports = router;