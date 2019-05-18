const express = require('express');
const router= express.Router()

var db= require('../models/db');
var Product= require('../models/product.model');

router.get('/:id',function(req,res){
    product_id= req.params.id;
    Product.findById({"_id":product_id},function(err,data){
        if(err){
            response= {"error":true,"message":data}
        }else{
            response={"error":false,"message":data}
        }
        res.json(response);
        
    });
});

module.exports= router;