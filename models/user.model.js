const mongoose = require('mongoose');
const db = require('./db');

var UserSchema= db.Schema({
    firstname : {
        type: String,
        required: true,
    },
    lastname: {
        type:String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        unique : true,
    },

    password:{
        type: String,
        required: true,
    },


    following:[{
        type: mongoose.Schema.ObjectId,                 //following to other shops
    }],

    location:{
        type:{
            type:String,
        },
        coordinates:[]

    },


    // location: {
    //     type: [Number],
    //     index : '2d',
    // },

    shopkeeper: {
        type:Boolean,
        required:true,
    },

    shopname:{
        type:String,
        required:true,
    },

    images:{
        shop_logo:{
            type:String,
           },

        shop_picture:{
        type:String,
    },
    },

    


    followers:[{
        type:mongoose.Schema.Types.ObjectId,            //following by other shops
    }],

    pan_no:{
        type:String,
    },

    contact_no:{
        type:Number,
    },


    created_at: {
        type: Date,
        default: Date.now,
    },

    updated_at : {
        type:Date,
        default: Date.now,
    },
});

UserSchema.index({location:"2dsphere"});

module.exports = db.model('User',UserSchema);