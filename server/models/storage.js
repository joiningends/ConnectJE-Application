<<<<<<< HEAD
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorageSchema = new Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const Storage = mongoose.model('Storage', StorageSchema);

module.exports = Storage;
=======
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorageSchema = new Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const Storage = mongoose.model('Storage', StorageSchema);

module.exports = Storage;
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
