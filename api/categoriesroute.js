const express = require('express');
const router= express.Router();
var db = require('../models/db');
var Product = require('../models/product.model');


//getting the categories list
router.get('/:categories',function(req,res){
    category = req.params.categories;
    

    Product.find({"categories":category},function(err,data){
        if(err){
            response = {"error":true , "message":data};
        }else{
            response = {"error":false , "message":data};
        }
        res.json(response);
        console.log(response);

    });
   
});

module.exports = router;
