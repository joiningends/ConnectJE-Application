<<<<<<< HEAD
const express = require('express');
const facebookController = require('../controller/facebookuserController');
const router = express.Router();


router.post('/facebook-login', facebookController.facebooklogin);

router.post('/sendmessage', facebookController.sendWhatsAppMessageusingcloudap);


module.exports = router;
=======
const express = require('express');
const facebookController = require('../controller/facebookuserController');
const router = express.Router();


router.post('/facebook-login', facebookController.facebooklogin);

router.post('/sendmessage', facebookController.sendWhatsAppMessageusingcloudap);


module.exports = router;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
