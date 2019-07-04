const express = require('express')

const router = express.Router();
const User = require('../models/user.model'); 
const Shop = require('../models/shop.model.js');
const Product = require('../models/product.model');
const passportJWT = passport.authenticate('jwt', { session: false });



//viewing other's profile
router.get('/:id',passportJWT,function(req,res){
    shop_id = req.params.id;
    User.findOne({"_id":shop_id,"shopkeeper":1},async function(err,data){

        var product_details = [];
        await Product.findMany({"shop_id":shop_id},function(err,data){
            console.log(data);
        })

        if(err){
            response=  {"error":true,"message": data};
        }else{
            response = {"error": false, "message": data};
        
        }
        res.json(response);
    });

});



//editing own profile
router.post('/editprofile',function(req,res){
    User.findOne({"_id":req.body.id},function(err,user){
        if(!user){
            console.error(err);
        }else{
            const shop = new Shop({
            user_id: "5ce28fdff64e1c1f92e0bcc5",
        
            pan_no: req.body.pan_no,
            contact_number : req.body.contact_no,
            });
            shop.save()
    .then(function(doc){
        console.log(doc);
    })
    .catch(function(err){
        console.error(err);
    })
        }
    })
    
});

module.exports= router;