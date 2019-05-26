const mongoose = require('mongoose');
const db = require('../models/db');
const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');


//searching the results
router.get('/',function(req,res,next){
    var text= req.query.items;
    if(req.query.items){
        const regex = new RegExp(escapeRegex(req.query.items), 'gi');
    Product.find({name:regex},function(err,data){
            if(err){
                res.json(err);
            }else{
                if(data.length<1){
                    var no_items = "No items found with that name";
                    res.send(no_items);
                }else{
                res.json(data);
                }
            }
        
        });
    }else{
        console.log("Search query not found");
    }

        

});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;