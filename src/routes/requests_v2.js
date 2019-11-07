var express = require("express");
var router = express.Router();
var controller = require("../controllers/requestController_v2");
var auth = require("../controllers/auth");

router.get("/allnew", auth.verifyToken, controller.getNewapplications);
router.get("/opened", auth.verifyToken, controller.getOpenedApplications);
router.put("/open/:id", auth.verifyToken, controller.openApplication);
router.put("/cancel/:id", auth.verifyToken, controller.cancelApplication);
router.put("/reject/:id", auth.verifyToken, controller.rejectApplication);
router.post("/submit", auth.verifyToken, controller.submit);
router.get("/myrequests", auth.verifyToken, controller.myRequests);
router.get("/offers/all", auth.verifyToken, controller.getRequestsOffers);
module.exports = router;