const express = require('express');
const router= express.Router();
var db = require('../models/db');
var Product = require('../models/product.model');
const Category= require('../models/category.model');
const multer = require('multer');
const upload = multer();

router.use(upload.array());



//getting the categories list
router.get('/:categories',function(req,res){
    category = req.params.categories;
    

    Product.find({"name":category},function(err,data){
        if(err){
            response = {"error":true , "message":data};
        }else{
            response = {"error":false , "message":data};
        }
        res.json(response);
    

    });
   
});


//adding the parent category
router.post('/parentcategory/add',function(req,res,next){
    console.log(req.body);
    var category = new Category({
        name : req.body.name,
        parent : '/',
        category : '/'+req.body.name,
        created_at:Date.now(),
        updated_at : Date.now(),
    });
    category.save()
    .then(function(doc){
        res.json(doc);
    })
    .catch(function(err){
        console.error(err);
    });


});


//adding the child category list
router.get('/childcategory/add',function(req,res,next){
    Category.find({},function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data);
        }
        console.log(data);
    });
});


router.post('/childcategory/add',async function(req,res,next){
     var parent_category = [];
    await Category.find({}).select('parent').find(function(err,data){
        parent_category.push(data);
    });
    console.log(parent_category);
    
    var category= new Category({
        name : req.body.childname,
        parent : req.body.parent,
        category : req.body.parent+'/'+req.body.childname,
    })
    category.save()
    .then(function(doc){
        res.json(doc);
    })
    .catch(function(err){
        console.error(err);
    })

});






//adding the categories list
// router.post('/',function(req,res){
//     const category = new Category({
//         name:req.body.name,
//         parent: req.body.parent,
//         category : req.body.parent+req.body.name,
//     });
//     console.log(req.body);

//     category.save()
//     .then(function(doc){
//         res.json(doc);
//     })
//     .catch(function(err){
//         res.json(err);
//     });
// });

module.exports = router;
