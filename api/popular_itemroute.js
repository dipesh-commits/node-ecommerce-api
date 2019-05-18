const express = require('express');
const router = express.Router();

var Product = require('../models/product.model');
var db = require('../models/db');


//quering the popular items
router.get('/',function(req,res){
    Product.find({"brand": "nike"},function(err,data){
        if(err){
            response = {"error":err,"message":data};
        }else{
            response = {"error":err,"message":data};
        }
        res.json(response);
    });
    
});

module.exports= router;