const express = require('express');
const router = express.Router();
var Product = require('../models/category.model');
var db = require('../models/db');

router.post('/',function(req,res,next){
    const prod = new Product({
        name: req.body.name,
        description: req.body.description,
        brand: req.body.brand,
        size: req.body.size,
    });

    prod.save()
    .then(doc=>{
        console.log(doc);
    })
    .catch(err=>{
        console.error(err);
    })
});

router.get('/',function(req,res,next){
    Product.find({
     
    })
    .then(doc=>{
        res.json(doc);
    })
    .catch(err=>{
        console.log(err);
    })
});

module.exports = router;