const mongoose = require('mongoose');
const db = require('./db');

var CategorySchema = db.Schema({
    parent_category_name:{
        type:String,
        child_category_name:[{
            type:String,
            child_subcategory_name:[{
                type:String
            }]
        }]
    },           //name: electronics
    
    created_at : Date,
    updated_at: Date,

    
});

CategorySchema.index({category:1});
CategorySchema.index({name:1});
CategorySchema.index({parent:1});

module.exports=db.model('Category',CategorySchema);
