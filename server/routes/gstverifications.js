<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const gstController = require('../controller/gstverificationController');
const authMiddleware = require('../middlewares/authMiddleware');
// Route for verifying GST number
router.get('/verify/:clientid/:gstnumber', gstController.verifyGstNumber);
router.get('/download-csv/:clientId', gstController.csvgstverification);
module.exports = router;
=======
const express = require('express');
const router = express.Router();
const gstController = require('../controller/gstverificationController');
const authMiddleware = require('../middlewares/authMiddleware');
// Route for verifying GST number
router.get('/verify/:clientid/:gstnumber', gstController.verifyGstNumber);
router.get('/download-csv/:clientId', gstController.csvgstverification);
module.exports = router;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
