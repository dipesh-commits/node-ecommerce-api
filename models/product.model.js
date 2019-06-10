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
        
    discount:{
        type:Number,
        
    },
    
    
    gender:{
        type:String,

    },

    size:[SizeSchema],

    tags: [{
        type:String,
        required: true
   }
        ]});


//Rating Schema

var RatingSchema = db.Schema({
    id:false,
    userid: mongoose.Schema.Types.ObjectId,
    values :{
        type:Number,
    },
});


//Review Schema

var ReviewSchema = db.Schema({

    id:false,
    user_id:{
        type:String,
        ref:"User"
    },

    comment_details:{
        comment:{
        type:String,
        },
     
    },

    created_at: {
        type:Date,
    }
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
        image1: {
            type:String,
            required : true,
        },
        image2:String,
        image3:String,
    },

    shop_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    product_details:{
        type: String,
        required:true,
    },

  
    

    rating: [RatingSchema],
    
    review: [ReviewSchema],

    categories:[{ 
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }],

    status:{
        type:Boolean,
    },

  
    created_at:{
        type:Date,
        
    },

    updated_at:{
        type:Date,
        
    },

});


ProductSchema.index({name:"text",gender:"text"},{
    weights:{
        name:2,
        description:5,
    },
});


module.exports = db.model('Product',ProductSchema);             //Exporting the model
// module.exports = db.model('Category',CategoriesSchema);              