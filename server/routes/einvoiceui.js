<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const eInvoiceuiController = require('../controller/einvoiceuiController');
const authMiddleware = require('../middlewares/authMiddleware');
// Route to create an E-Invoice
router.post('/create/:id', authMiddleware, eInvoiceuiController.generateEInvoice);


module.exports = router;
=======
const express = require('express');
const router = express.Router();
const eInvoiceuiController = require('../controller/einvoiceuiController');
const authMiddleware = require('../middlewares/authMiddleware');
// Route to create an E-Invoice
router.post('/create/:id', authMiddleware, eInvoiceuiController.generateEInvoice);


module.exports = router;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
