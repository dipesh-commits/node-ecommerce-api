const Product = require('../models/category.model');

exports.index = function(req,res){
    Product.get(function(err,datas){
        if(err){
            res.json({status:"Error",message:err,});
        }
        res.json({
            status:"success",
            message: "Datas retrieved successfully",
            data:datas,
        });
    });

};

//Handle create item actions
exports.new = function(req,res){
    var product= new Product();
    product.name = req.body.name ? req.body.name : product.name;
    product.description = req.body.description;
    product.brand = req.body.brand;
    product.size = req.body.size;
    product.color= req.body.color;
    product.keywords= req.body.keywords;

    //save the product and check the errors
    product.save(function(err){
        if(err){
            res.json(err);
        }
        res.json({
            message :'new product created',
            data:datas,
        });
    });
};

//Handle the view product info
exports.view = function(req,res){
    Product.findById(req.params.product_id,function(err,product){
        if(err){
            res.json(err);
        }
        res.json({
            message : 'Products details loading..',
            data: datas,
        });
    });
};

//Handle update product info
exports.update = function(req,res){
    Product.findById(req.params.product_id,function(err,product){
        if(err)
            res.json(err);

        product.name= req.body.name? req.body.name:product.name;
        product.description = req.body.description;
        product.brand = req.body.brand;
        product.size = req.body.size;
        product.color= req.body.color;
        product.keywords= req.body.keywords;
    
        //save the product and check for the errors
        product.save(function(err){
            if(err)
                res.json(err);
            res.json({
                message : 'product info updated',
                data: datas
            });
        });
    });
};

//Handle delete contact 
exports.delete = function(req,res){
    Product.delete({
        _id: req.params.product_id
    },function(err,product){
        if(err)
        res.send(err);

        res.json({
            status : "success",
            message : 'Contace deleted',
        });
    
    });
};