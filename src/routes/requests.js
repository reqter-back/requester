var express = require('express');
var router = express.Router();
var controller = require('../controllers/requestController');
var auth = require('../controllers/auth');

router.get("/allnew", auth.verifyToken, controller.getNewapplications);
router.get("/opened", auth.verifyToken, controller.getOpenedApplications);
router.put("/open/:id", auth.verifyToken, controller.openApplication);
router.put("/reject/:id", auth.verifyToken, controller.rejectApplication);
router.post("/submit", auth.verifyToken, controller.submit);
router.get("/", auth.verifyToken, controller.myRequests);
router.get("/:id/offers", auth.verifyToken, controller.getRequestsOffers);
module.exports = router;