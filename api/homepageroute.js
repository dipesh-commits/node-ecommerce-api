const express = require('express');
const router = express.Router();
var Product = require('../models/product.model');
var db = require('../models/db');
var User = require('../models/user.model');



router.get('/',function(req,res,next){
    
//     Product.find({ "rating.values": {$gt:"202"}},function(err,data){
//         if(err){
//             response = {"error":true,"message":"Error fetching the data"};
//         }else{
//             response = {"error":false,"message":data};
//         }
// });

//     Product.find().sort({create_at:1}).exec(function(err,data){
//             if(err){
//                 popular ={"error":true,"message":"Error in fetching data"};
//             }else{
//                 popular = {"error":false , "message":data};
//             }
//     });

//         res.json({:response,"popular":popular});
//     });

   

            // Product.find().sort({"price":1}).exec(function(err,data){
            //                 if(err){
            //                     popular ={"error":true,"message":"Error in fetching data"};
            //                 }else{
            //                     popular = {"error":false , "message":data};
            //                 }
            //                 items.push(popular);
            //                 re
            //         });
                  
                   

       
        
  //  var popular = Product.find({categories:"shirt"});
  //  res.json(items);
 // 
 

});

//trending routes
router.get('/trending',function(req,res,next){
    Product.aggregate([
        {
            $match:query
        },
        {
            $group:{
                _id:{
                    status:1,
                    create_date:"$create_date",
                }
            }
        },{
            $project:{
                create_date:"$_id.create_date",
            }
        },{$sort:{create_date:1}},
    ],function(err,data){
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
    Product.find({
        "status":1,
        "rating.values":{$gt:7}

},function(err,data){
    if(err){
        response= {"error":true,"top_rated":data}
    }else{
        response = {"error":false,"top_rated":data}
    }
    res.json(response);
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
            console.log(response);
        }else{
            response = {"error":false,"nearby_items":data}
        }
        res.json(response);
    })
});


//

    
    
   

module.exports = router;