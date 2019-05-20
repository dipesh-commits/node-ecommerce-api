const express = require('express')

const router = express.Router();
const User = require('../models/user.model'); 

router.get('/:id',function(req,res){
    shop_id = req.params.id;
    User.findOne({"_id":shop_id,"shopkeeper":1},function(err,data){
        if(err){
            response=  {"error":true,"message": data};
        }else{
            response = {"error": false, "message": data};
        
        }
        res.json(response);
    });

});

module.exports= router;