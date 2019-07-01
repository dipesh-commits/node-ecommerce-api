const mongoose = require('mongoose');
const db = require('../models/db');
const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');


//searching the results
// router.get('/',function(req,res,next){
//     var text= req.query.items;
//     if(req.query.items){
//         const regex = new RegExp(escapeRegex(req.query.items), 'gi');
//     Product.find({
//         "$or":[
//             {
//                "name":{'$regex':regex,'$options' : 'i'}
//             },
//             {
//                 "description":{'$regex':regex,'$options':'i'}
//             },
//             // {
//             //     "gender":{'$regex':regex,'$options':'i'}},{categories:{'$regex':regex,'$options':'i'}}
//            ]
//     },function(err,data){
//             if(err){
//                 res.json(err);
//             }else{
//                 if(data.length<1){
//                     var no_items = "No items found with that name";
//                     res.send(no_items);
//                 }else{
//                 res.json(data);
//                 }
//             }

//         });
//     }else{
//         console.log("Search query not found");
//     }



// });


//filtering the product

router.get('/filter',function(req,res,next){
    var query={};
    const {size,color,brand,tags} = req.query;
    // if(req.query.size){
    //     query.size = req.query.size
    // }else if(req.query.color){
    //     query.color = req.query.color
    // }else if(req.query.brand){
    //     query.brand = req.query.brand
    // }else{
    //     query.tags = req.query.tags
    // }

   
Product.find({
    $or: [{
        "specs.tags": {
            $in: [tags]
        }
    },
    {
        brand: brand
    },
    {
        "specs.size": {
            $elemMatch: {
                $or: [{
                        color_details: {
                            $elemMatch: {
                                color_value: color
                            }
                        }
                    },
                    {
                        size_value: size
                    }
                ]

            }
        }
    }
]
}).then(product => {
console.log(product.length)
res.json(product)
}).catch(err => {
res.json(err)

});
});
// router.get('/filter', function(req, res, next) {
//     var query = {};
//     const { size, color, brand, tags } = req.query
//         // console.log(req.query)
//         // if (req.query.size) {
//         //     query.size = req.query.size
//         // } else if (req.query.color) {
//         //     query.color = req.query.color
//         // } else if (req.query.brand) {
//         //     query.brand = req.query.brand
//         // } else {
//         //     query.tags = req.query.tags
//         // }

//     Product.find({
//             $or: [{
//                     "specs.tags": {
//                         $in: query.tags
//                     }
//                 },
//                 {
//                     brand: brand
//                 },
//                 {
//                     "specs.size": {
//                         $elemMatch: {
//                             $or: [{
//                                     color_details: {
//                                         $elemMatch: {
//                                             color_value: color
//                                         }
//                                     }
//                                 },
//                                 {
//                                     size_value: size
//                                 }
//                             ]

//                         }
//                     }
//                 }
//             ]
//         }).then(product => {
//             console.log(product.length)
//             res.json(product)
//         }).catch(err => {
//             res.json(err)
//         })
//         // Product.find({ $or: [{ brand: query.brand }, {tags: query.tags }] }, function(err, data) {
//         //     console.log(data)

//     //     if (err) {
//     //         console.log(err);
//     //     } else
//     //         res.json(data);
//     //     console.log(data.length);

//     // })
// });



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;