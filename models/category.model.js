const mongoose = require('mongoose');
const db = require('./db');

var ChildSubcategorySchema= db.Schema({
    
    type:String,
});

var ChildCategorySchema =db.Schema({
    type:Object,
    child_subcategory_name:[
        ChildSubcategorySchema
    ]
});

var CategorySchema = db.Schema({
    parent_category_name:{
        type:Object,
        child_category_name:[
            ChildCategorySchema
        ]
        },           
    
    created_at : Date,
    updated_at: Date,

    
});

CategorySchema.index({category:1});
CategorySchema.index({name:1});
CategorySchema.index({parent:1});



module.exports=db.model('Category',CategorySchema);
