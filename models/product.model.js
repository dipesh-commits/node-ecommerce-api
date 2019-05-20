const mongoose = require('mongoose');
const db = require('./db');





//making the specs schema

var SizeSchema = db.Schema({
    size_value: {
        type:String,
        required:true,
    },
    color_details : [{
        color_value:{
            type:String,
            required:true,
            },
        
        quantity:{
            type:Number,
            required:true,
        },
    }],
});

var SpecsSchema = db.Schema({
    // product_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    // },

    

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

    size:[SizeSchema],

    tags: {
        type:String,
        required: true,
   },
},{_id:false});


//Rating Schema

var RatingSchema = db.Schema({
    id:false,
    values :{
        type:Number,
    },
});


//Review Schema

var ReviewSchema = db.Schema({

    id:false,
    user_id:{
        type:String,
    },

    comment_details:{
        comment:{
        type:String,
        },
        likes:{
            type:Number,
        },
    },
});


//Product Schema


var ProductSchema = db.Schema({
     name:{
        type:String,
        required : true,
        
     },

    
     brand: {
        type:String,
    
    },

     specs: SpecsSchema , 


    productImages:{
        image1: String,
        image2:String,
        image3:String,
    },
    

    rating: RatingSchema,
    
    review: [ReviewSchema],

    categories: mongoose.Schema.Types.ObjectId,

    status:{
        type:Boolean,
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

module.exports = db.model('Product',ProductSchema);             //Exporting the model
// module.exports = db.model('Category',CategoriesSchema);              