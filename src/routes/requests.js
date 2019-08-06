var express = require('express');
var router = express.Router();
var controller = require('../controllers/requestController');
var auth = require('../controllers/auth');

router.get("/allnew", auth.loadHeaders, auth.verifyToken, controller.getNewapplications);
router.get("/opened", auth.loadHeaders, auth.verifyToken, controller.getOpenedApplications);
router.put("/open/:id", auth.loadHeaders, auth.verifyToken, controller.openApplication);
router.put("/reject/:id", auth.loadHeaders, auth.verifyToken, controller.rejectApplication);
router.post("/submit", auth.loadHeaders, auth.verifyToken, controller.submit);
router.get("/", auth.loadHeaders, auth.verifyToken, controller.myRequests);
router.get("/:id/offers", auth.loadHeaders, auth.verifyToken, controller.getRequestsOffers);
module.exports = router;