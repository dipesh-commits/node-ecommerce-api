const express = require('express');
const router = express.Router();
var Product = require('../models/product.model');
var db = require('../models/db');
var User = require('../models/user.model');





//trending routes
router.get('/trending',function(req,res,next){
    Product.find({}).sort({'created_at':-1}).find(function(err,data){
        if(err){
            response = {"error":true,"trending_items":data}
        }else{
            response ={"error":false,"trending_items":data}
        }
        res.json(response);
    })
})


//top-rated routes
router.get('/top-rated',function(req,res,next){
    var sixmonthsago = new Date(Date.now()-(180*24*60*60*1000));
    console.log(sixmonthsago);
    var now = new Date();
    Product.aggregate([
        {
            $match:
            {
                "status":true
            },
        },
        {$match:{
            created_at:{
                $gte:sixmonthsago
            }
        }
            
        
         }, {
            "$unwind":"$rating"
        },
        {
            "$group":{
                "_id":{
                    "_id":"$_id",
                    "name": "$name",
                    "price":"$specs.price",
                    "discount":"$specs.discount"

                },
                "rating":{
                    "$push":"$rating"
                },
                "rating_avg":{
                    "$avg":"$rating.values"
                }
            }
        },
        {
            "$project":{
                "_id":0,
                "name":"$_id.name",
                "price":"$_id.price",
                "discount":"$_id.discount",
                "rating_avg":1,
                "rating":1
            }
        },{
            $sort:{
                "rating_avg":-1
            }
        }
        
        
],function(err,data){
    if(err){
        // response= {"error":true,"top_rated":data}
        res.json(err);
    }else{
        response = {"error":false,"top_rated":data}
        res.json(data)
    }
    // res.json(response);
})
});

//popular items
router.get('/popular-items',function(req,res,next){
    Product.find({
        'status': 1,
        'views':{$gt:300},
    },function(err,data){
        if(err){
            response={"error":true,"popular_items":data}
        }else{
            response = {"error":false , "popular_items":data}
        }
        res.json(response);
    });
});

router.get('/nearby-items',function(req,res,next){
    User.find({
        'shopkeeper':1,
        'location':{
            $near:{
                $maxDistance :1000,
                $geometry:{
                    type:"Point",
                    coordinates:[-110.93303,40.38929]
                }
            }
        }
        
    },function(err,data){
        if(err){
            response ={"error":true,"nearby_items":data}
            
        }else{
            response = {"error":false,"nearby_items":data}
        }
        res.json(response);
    })
});


//get all the remaining items
router.get('/products',function(req,res,next){
    
    Product.find({"status":1},function(err,data){
        if(err){
            response={"error":true,"message":data}
        }else{
            response={"error":false,"message":data}
            
        }
        res.json(response);
    })
})

    
    
   

module.exports = router;