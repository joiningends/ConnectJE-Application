const express = require("express");
const router = express.Router();
const enquiryController = require("../controller/enquiryController");

router.post("/", enquiryController.registerUserEnquiry);
router.post("/data", enquiryController.getEnquiry);



module.exports = router;