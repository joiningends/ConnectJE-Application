<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const emailConfigController = require('../controller/emailconfigController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:clientId', authMiddleware, emailConfigController.createEmailConfig);


router.get('/:clientId', authMiddleware, emailConfigController.getEmailConfigByClientId);


router.get('/getbyid/:id', authMiddleware, emailConfigController.getEmailConfigById);


router.put('/:id', emailConfigController.updateEmailConfig);


router.delete('/:id', emailConfigController.deleteEmailConfig);
router.post('/send/email/testing', emailConfigController.sendEmail);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const emailConfigController = require('../controller/emailconfigController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:clientId', authMiddleware, emailConfigController.createEmailConfig);


router.get('/:clientId', authMiddleware, emailConfigController.getEmailConfigByClientId);


router.get('/getbyid/:id', authMiddleware, emailConfigController.getEmailConfigById);


router.put('/:id', emailConfigController.updateEmailConfig);


router.delete('/:id', emailConfigController.deleteEmailConfig);
router.post('/send/email/testing', emailConfigController.sendEmail);

module.exports = router;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
