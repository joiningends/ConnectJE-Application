<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const eiBuyerDetailsController = require('../controller/eibuyerdetailsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, eiBuyerDetailsController.createEiBuyerDetail);


router.get('/by/:id', authMiddleware, eiBuyerDetailsController.getAllEiBuyerDetails);


router.get('/:id', authMiddleware, eiBuyerDetailsController.getEiBuyerDetailById);


router.put('/:id',authMiddleware, eiBuyerDetailsController.updateEiBuyerDetailById);


router.delete('/:id', authMiddleware, eiBuyerDetailsController.deleteEiBuyerDetailById);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const eiBuyerDetailsController = require('../controller/eibuyerdetailsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, eiBuyerDetailsController.createEiBuyerDetail);


router.get('/by/:id', authMiddleware, eiBuyerDetailsController.getAllEiBuyerDetails);


router.get('/:id', authMiddleware, eiBuyerDetailsController.getEiBuyerDetailById);


router.put('/:id',authMiddleware, eiBuyerDetailsController.updateEiBuyerDetailById);


router.delete('/:id', authMiddleware, eiBuyerDetailsController.deleteEiBuyerDetailById);

module.exports = router;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
