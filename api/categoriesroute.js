const express = require('express');
const router= express.Router();
var db = require('../models/db');
var Product = require('../models/product.model');
const Category= require('../models/category.model');


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


//adding the categories list
router.post('/',function(req,res){
    const category = new Category({
        name:req.body.name,
        parent: req.body.parent,
        category : req.body.parent+req.body.name,
    });
    console.log(req.body);

    category.save()
    .then(function(doc){
        res.json(doc);
    })
    .catch(function(err){
        res.json(err);
    });
});

module.exports = router;
