<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const EISellerDetailsController = require('../controller/eisellerdetailsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/by/:id', authMiddleware, EISellerDetailsController.getAllSellerDetails);


router.get('/:id', authMiddleware, EISellerDetailsController.getSellerDetailsById);


router.post('/', authMiddleware, EISellerDetailsController.createSellerDetails);


router.put('/:id', authMiddleware, EISellerDetailsController.updateSellerDetailsById);


router.delete('/:id', authMiddleware, EISellerDetailsController.deleteSellerDetailsById);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const EISellerDetailsController = require('../controller/eisellerdetailsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/by/:id', authMiddleware, EISellerDetailsController.getAllSellerDetails);


router.get('/:id', authMiddleware, EISellerDetailsController.getSellerDetailsById);


router.post('/', authMiddleware, EISellerDetailsController.createSellerDetails);


router.put('/:id', authMiddleware, EISellerDetailsController.updateSellerDetailsById);


router.delete('/:id', authMiddleware, EISellerDetailsController.deleteSellerDetailsById);

module.exports = router;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
