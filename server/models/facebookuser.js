<<<<<<< HEAD
const mongoose = require('mongoose');

const facebookuserSchema = new mongoose.Schema({
  facebookId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  profilePicture: String
});

const Facebookuser = mongoose.model('Facebookuser', facebookuserSchema);

module.exports = Facebookuser;
=======
const mongoose = require('mongoose');

const facebookuserSchema = new mongoose.Schema({
  facebookId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  profilePicture: String
});

const Facebookuser = mongoose.model('Facebookuser', facebookuserSchema);

module.exports = Facebookuser;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
