<<<<<<< HEAD
const mongoose = require('mongoose');

const eidispatchDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
      },
      name:{
        type: String,
      },
        company_name: {
            type: String,
            required: true,
           
        },
        address1: {
            type: String,
            required: true
        },
        /* address2: {
            type: String,
            minlength: 3,
            maxlength: 100
        }, */
        location: {
            type: String,
            required: true,
            
        },
        pincode: {
            type: Number,
            required: true,
           
        },
        state_code: {
            type: String,
            required: true,
           
        }
    
});

module.exports = mongoose.model('EidispatchDetails', eidispatchDetailsSchema);
=======
const mongoose = require('mongoose');

const eidispatchDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
      },
      name:{
        type: String,
      },
        company_name: {
            type: String,
            required: true,
           
        },
        address1: {
            type: String,
            required: true
        },
        /* address2: {
            type: String,
            minlength: 3,
            maxlength: 100
        }, */
        location: {
            type: String,
            required: true,
            
        },
        pincode: {
            type: Number,
            required: true,
           
        },
        state_code: {
            type: String,
            required: true,
           
        }
    
});

module.exports = mongoose.model('EidispatchDetails', eidispatchDetailsSchema);
>>>>>>> e79cd56099d4dc6ba2696ac0db143b60bfdd0776
