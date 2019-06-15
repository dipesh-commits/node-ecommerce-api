const express = require('express');
const router = express.Router();
var Product = require('../models/product.model');
var User = require('../models/user.model');
const mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');







//trending routes
router.get('/trending',function(req,res,next){
    const twoweekago = new Date(Date.now()-(14*24*60*60*1000));
    console.log(twoweekago);
    Product.aggregate([
        {
            $match:{
                "status":true
            },
        },{
            
                $match:{
                    "updated_at":{$gt:twoweekago}
                }
        },
        {
            $match:{
                views:{
                    $gt:20
                }
            }
        },  
        {
            $group:{
                "_id":{
                    "_id":"$_id",
                    "name":"$name",
                    "price":"$specs.price",
                    "discount":"$specs.discount",
                    "views":"$views",
                    

                },
                "time":{
                    $push:"twoweekago-$updated_at"
                },
                "score":{
                    $push:("$time"+"$views")/2
                }
            },
            
            // "score": {
            //     "$avg":"$updated_at"+"$views"
            // }
            
        },
          
        {
        $project:{
            "_id":1,
            "name":"$_id.name",
            "price":"$_id.price",
            "discount":"$_id.discount",
            "views":"$_id.views",
            
        
        }
    },{
        $sample:{
            size:50
        }
    }
        
    ],function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data);
        }
    })
    // Product.find({}).sort({'created_at':-1}).find(function(err,data){
    //     if(err){
    //         response = {"error":true,"trending_items":data}
    //     }else{
    //         response ={"error":false,"trending_items":data}
    //     }
    //     res.json(response);
    // })
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
        {
            $match:{
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
                    "discount":"$specs.discount",
                    "views":"views"

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
                "_id":1,
                "name":"$_id.name",
                "price":"$_id.price",
                "discount":"$_id.discount",
                "views":"$_id.views",
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
        response= {"error":true,"top_rated":data}
        
    }else{
        response = {"error":false,"top_rated":data}
        
    }
    res.json(response);
})
});

// //popular items
// router.get('/popular-items',function(req,res,next){
//     Product.find({
//         'status': 1,
//         'views':{$gt:300},
//     },function(err,data){
//         if(err){
//             response={"error":true,"popular_items":data}
//         }else{
//             response = {"error":false , "popular_items":data}
//         }
//         res.json(response);
//     });
// });

router.get('/nearby-items',async function(req,res,next){
    var shop=[];
   await User.find({
        'shopkeeper':1,
        'location':{
            $near:{
                
                $geometry:{
                    type:"Point",
                    coordinates:[-110.93303,40.38929]
                },
                $maxDistance :2000000,
                $minDistance:0
            }
        }
        
    },async function(err,data){
        if(err){
            res.json(err);
            
        }else{
            console.log(data);
            shop.push(data);
            
            var product_data=[];
            var shopid=[];
            for(var i=0;i<shop[0].length;i++)
            {
                 shopid.push(mongoose.Types.ObjectId(shop[0][i].id));
            }
    
               await Product.aggregate([
                   {
                       $match:{
                           "status":true
                       }
                   },{
                       $match:{
                           shop_id:{"$in":shopid}
                       }
                   },{
                       $group:{
                           "_id":{
                               "_id":"$_id",
                               "name":"$name",
                               "price":"$specs.price",
                               "discount":"$specs.discount",
                               "views":"$views"
                           }
                       }
                   },{
                       $project:{
                           "_id":0,
                           "id":"$_id._id",
                           "name":"$_id.name",
                           "price":"$_id.price",
                           "discount":"$_id.discount",
                           "views":"$_id.views"
                       }
                   }
               ],function(err,datas){
                    if(err){
                        res.json(err);
                    }
                    else{
                        console.log(datas.length);
                        if(datas.length!=0)
                        product_data=datas;                        
                        
                        
                    }
                });
                
            }
            
            res.json(product_data);
            
            
        
        
    });
});


//get all the remaining items
router.get('/products',function(req,res,next){

    var aggregate= Product.aggregate();
    aggregate.match({"status":true}).group({_id:'$_id',count:{'$sum':1}})
    var options = {page:1,limit:15}

    Product.aggregatePaginate(aggregate,options,function(err,results,pageCount,count){
        if(err){
            res.json(err);
            console.log(err)
        }else{
            console.log(results);
        }
    });
    
//     Product.aggregate([
//         {
//             $match:{
//                 "status":true
//             },
//         },{
//             $group:{
//                 "_id":{
//                 "_id":"$_id",
//                 "name":"$name",
//                 "price":"$specs.price",
//                 "discount":"$specs.discount",
//                 "views":"$views"
//             }
//         }
//         },
//         // {
//         //     $group:{
//         //         _id:1,
//         //         total:{
//         //             $sum:1
//         //         },
               
                
                
//         //     }
//         // },
//         {
//             $project:{
//                 "_id":0,
//                 // "total_items":"$total",
//                 "name":"$_id.name",
//                 "price":"$_id.price",
//                 "discount":"$_id.discount",
//                 "views":"$_id.views"
//             }
//         },
//         {
//             $sort:{"created_at":-1}
//         },
//         {$skip:0},
//         {$limit:10}



// ],function(err,data){
//     if(err){
//         res.json(err)
//     }else{
//         res.json(data);
//     }
// });
 });

    
    
   

module.exports = router;