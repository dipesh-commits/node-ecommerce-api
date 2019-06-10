const mongoose = require('mongoose');
const db = require('./db');

var ViewsSchema = db.Schema({
    product_id:{
        type:String,
        required:true,
    },

    view:[{
        clickTime:{
            type:Date,
        }
    }]
});

module.exports =db.model('ProductView',ViewsSchema);