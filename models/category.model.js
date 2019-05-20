const mongoose = require('mongoose');
const db = require('./db');

var CategorySchema = db.Schema({
    name:String,
    parent : String,
    category:String,
    
});

CategorySchema.index({category:1});
CategorySchema.index({name:1});
CategorySchema.index({parent:1});

module.exports=db.model('Category',CategorySchema);