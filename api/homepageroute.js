const express = require('express');
const router = express.Router();
var Product = require('../models/product.model');
var db = require('../models/db');



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

    var items=[];
    Product.find({ "rating.values": {$gt:"202"}},function(err,data){
                if(err){
                    response = {"error":true,"message":"Error fetching the data"};
                }else{
                    response = {"error":false,"message":data};
                }
            items.push(response);
        });

            Product.find().sort({"price":1}).exec(function(err,data){
                            if(err){
                                popular ={"error":true,"message":"Error in fetching data"};
                            }else{
                                popular = {"error":false , "message":data};
                            }
                            items.push(popular);
                            res.json(items); 
                    });
                  
                   

       
        
  //  var popular = Product.find({categories:"shirt"});
  //  res.json(items);
 // 

});

    
    
   

module.exports = router;