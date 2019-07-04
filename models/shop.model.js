const mongoose = require('mongoose');
const db = require('./db');

var ShopSchema = db.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },

    shop_logo:{
        type:String,

    },

    shop_picture:{
        type:String,
    },

    followers:[{
        type:mongoose.Schema.Types.ObjectId,
    }],

    pan_no:{
        type:String,
    },

    contact_no:{
        type:Number,
    }

});

module.exports = db.model("shop",ShopSchema);