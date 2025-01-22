<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const eyePrescription = require('../controller/eyePrescriptionController');
const authMiddleware = require('../middlewares/authMiddleware');
// POST route to create a new eye prescription
router.post('/', authMiddleware, eyePrescription.createPrescription);
router.get('/:eventId', authMiddleware,eyePrescription.getPrescriptionsByEventId);
router.get('/downlod/:user', authMiddleware,eyePrescription.downloadPrescriptionPDF);
module.exports = router;
=======
const express = require('express');
const router = express.Router();
const eyePrescription = require('../controller/eyePrescriptionController');
const authMiddleware = require('../middlewares/authMiddleware');
// POST route to create a new eye prescription
router.post('/', authMiddleware, eyePrescription.createPrescription);
router.get('/:eventId', authMiddleware,eyePrescription.getPrescriptionsByEventId);
router.get('/downlod/:user', authMiddleware,eyePrescription.downloadPrescriptionPDF);
module.exports = router;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
