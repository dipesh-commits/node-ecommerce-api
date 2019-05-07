const mongoose = require('mongoose');
const db = require('./db');

var ProductSchema = db.Schema({
     name:{
        type:String,
        required : true,
        validate : (value)=>{
            return validator.idAlpha(value);
        },
     },

    
     specs: {
       description: {
        type:String,
        required : true,
        },
       price:{
        type:Number,
        required:true,
        },
    gender:{
        type:String,

    },
    size:{
        type:String,
        required: true,
    },
    color:{
        type:String,
        required:true,
    },

    tags: {
        type:String,
        required: true,
   },
},
    brand: {
        type:String,
    
    },

    rating: {
        user_id :{
            type:String,
            
        },
        values: Number,
    },
    
    review:{
        user_id:{
            type:String,
        },
        comment:{
            type:String,
            likes:{
                type:Number,
            },

    },
    },

    categories:{
        type:String,
        lowercase: true,
    },

  
    create_date:{
        type:Date,
        default : Date.now
    },

    updated_date:{
        type:Date,
        default: Date.now,
    },

});

module.exports = db.model('Product',ProductSchema);