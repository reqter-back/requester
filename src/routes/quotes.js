var express = require("express");
var router = express.Router();
var controller = require("../controllers/quoteController");
var auth = require("../controllers/auth");

router.put("/accept/:id", auth.verifyToken, controller.customerAccpet);
router.put("/reject/:id", auth.verifyToken, controller.customerReject);
router.put("/close/:id", auth.verifyToken, controller.close);
router.post("/issueOffer", auth.verifyToken, controller.issueOffer);
router.get("/alloffers", auth.verifyToken, controller.myoffers);
router.get("/acceptedoffers", auth.verifyToken, controller.acceptedoffers);
router.get("/wonoffers", auth.verifyToken, controller.wonoffers);
router.get("/lostoffers", auth.verifyToken, controller.lostoffers);
module.exports = router;
