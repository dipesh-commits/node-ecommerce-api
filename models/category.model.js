const mongoose = require('mongoose');
const db = require('./db');

var CategorySchema = db.Schema({
    parent_name:String,            //name: electronics
    
    created_at : Date,
    updated_at: Date,

    
});

CategorySchema.index({category:1});
CategorySchema.index({name:1});
CategorySchema.index({parent:1});

module.exports=db.model('Category',CategorySchema);
