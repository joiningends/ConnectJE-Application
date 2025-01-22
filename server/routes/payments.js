<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/orders/:id/cusomerid',  PaymentController.createOrder);
router.post('/verify/:id/cusomerid', PaymentController.verifyPayment);
router.post('/tranfer/orders/:id/cusomerid', PaymentController.createOrderWithTransfer);
router.post('/transfer/verify/:id/cusomerid', PaymentController.verifyPaymentTransfer);


=======
const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/orders/:id/cusomerid',  PaymentController.createOrder);
router.post('/verify/:id/cusomerid', PaymentController.verifyPayment);
router.post('/tranfer/orders/:id/cusomerid', PaymentController.createOrderWithTransfer);
router.post('/transfer/verify/:id/cusomerid', PaymentController.verifyPaymentTransfer);


>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
module.exports = router;