const express = require('express');
const router= express.Router()

var db= require('../models/db');
var Product= require('../models/product.model');
var Category = require('../models/category.model');
var User = require('../models/user.model');

//getting the product details //updating the rating of the product
 router.post('/update-rating',function(req,res,next){
    var userid= Auth.user_id;
    
})



router.get('/:id',function(req,res){
    product_id= req.params.id;
    
    
    Product.findOne({"_id":product_id,"status":1}).populate('categories').populate('shop_id').populate('review.user_id').exec(function(err,data){
        // var category = data.categories;
        
        // var categories = new Category();
        // var category_data= [];
        // await Category.find({"_id":category},function(err,data){
            
        //     category_data.push(data);
        //     });
        
        // var shop =data.shop_id;
        // var shops = new User();
        // var shop_data = [];
        // await User.find({"_id":shop,"shopkeeper":1},function(err,data){
        //     shop_data.push(data);
        // });      
        if(err){
            response= {"error":true,"message":data}
        }else{
            // response={"error":false,"message":data,"category_list":category_data,"shop_details":shop_data}
            response={"error":false,"message":data}
        }
        res.json(response);
        
        
      
    });
        
        });

 //updating the rating of the product
 router.post('/update-rating/:id',async function(req,res,next){
    var userid="5ce29c9ca2eb5026b70aca12";    
    console.log(req.body);
    var productid= req.params.id;
    console.log(productid);
    var product=[];
    await Product.findOne({"_id":productid,"status":1},function(err,data){
        product.push(data);
        var shopid= product[0].shop_id;
        rating_userid=[]
        
        rating_userid.push(product[0].rating);
        
        
       
    
        
        if(err){
            console.log("error");
        }else{

                // for (i=0;i<rating_userid[0].length;++i){


                Product.updateOne({"_id":productid,"shop_id":shopid},
                {
                   
                    // $unset:{
                    //     userid:""
                    // },
                   

                    $push:{
                        rating:{
                            userid:userid,
                            values:"14"
                        }
                    }
                   
                   
                },{strict:false},
                function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        
                        res.json(data);
                    }
                });
            


            // for(let i=0;i<rating_userid[0].length;++i){
            //     var existing_userid=rating_userid[0][i].userid;


            //     if(existing_userid===userid){
            //         Product.findOneAndUpdate({"rating.userid":existing_userid,"shop_id":shopid},
                            
            //                 {
            //                     $set:{
            //                         rating:{
            //                             userid:userid,
            //                             values:"20",
            //                         }
                                    
            //                     }
            //                 },
            //                 function(err,data){
            //                     if(err){
            //                         console.log(err);
            //                     }else{
            //                         res.json(data);
            //                     }

            //                 });
            //                 break;
                            

            //                      }
            //                     else{
                                    
            //                 Product.findOneAndUpdate({"_id":productid,"shop_id":shopid},
                            
            //                 {
            //                     $push:{
                                    
            //                             rating:
            //                             {
            //                                 userid:userid,
            //                                 values:"9"
            //                             }
            //                             }
                                
            //                 },{upsert:true},function(err,data){
            //                     if(err){
            //                         console.log(err);
            //                     }else{
            //                         res.json(data);
            //                     }

            //                 });
                            
            //                     }
            //                     }

                            

          

            
          
            
        }

    
        
    });
});

       
        
    
        
        
   

    

    // await Product.findOneAndUpdate({"shop_id":shopid,"rating.values":rating_values},
    // {
    //     $set:{
    //         rating:{
    //             userid:'5cebf0bdd4a8bb31c3b49de1',
    //             values: req.body.values
    //         }
    //     }
    // },
    // {upsert:true}
 

 
    
    



module.exports= router;