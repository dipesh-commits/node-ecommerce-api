require('./models/db');
const bodyParser = require('body-parser');
const express= require('express');
const path= require('path');

//Importing all the routes

const homepage_routes= require('./api/homepageroute');      //getting the homepage items
const popular_items = require('./api/popular_itemroute');   //getting the popular items
const category = require('./api/categoriesroute');          //getting the category
const create_product= require('./api/create_product');      //adding the product
const product_detail = require('./api/product_details');    //viewing the individual product detail
const uploadimage = require('./api/uploadphoto');
const user=require('./api/user');                           //user details
const search = require('./api/filterproduct');              //searching the items



var app= express();

app.use(bodyParser.urlencoded({
    extended:true,
}));

app.use(express.static(path.join(__dirname,'public')));

//using the route middleware

app.use(bodyParser.json());
app.use('/',homepage_routes);
app.use('/popular-items',popular_items);
app.use('/category',category);
app.use('/add-product',create_product);
app.use('/product',product_detail);
app.use('/user',user);
app.use('/search',search);

app.use('/uploadimage',uploadimage);



//listening to the port

app.listen(3000,function(){
console.log('Listening to port number 4000');
});

