<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const ewaybillController = require('../controller/ewaybillController');

router.post('/create/:id', ewaybillController.createEwaybill);
router.get('/report/:clientid', ewaybillController.generateEwayBillReport);
router.get('/report/date/:clientid', ewaybillController.generateEwayBillReportdate);
=======
const express = require('express');
const router = express.Router();
const ewaybillController = require('../controller/ewaybillController');

router.post('/create/:id', ewaybillController.createEwaybill);
router.get('/report/:clientid', ewaybillController.generateEwayBillReport);
router.get('/report/date/:clientid', ewaybillController.generateEwayBillReportdate);
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
module.exports = router;