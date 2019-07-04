require('./models/db');
const bodyParser = require('body-parser');
const express= require('express');
const path= require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');

//Importing all the routes

const homepage_routes= require('./api/homepageroute');      //getting the homepage items
const popular_items = require('./api/popular_itemroute');   //getting the popular items
const category = require('./api/categoriesroute');          //getting the category
const create_product= require('./api/create_product');      //adding the product
const product_detail = require('./api/product_details');    //viewing the individual product detail
const uploadimage = require('./api/uploadphoto');
// const user=require('./api/user');                           //user details
const search = require('./api/filterproduct');              //searching the items

//authentication routes
const adminlogin = require('./api/authentication/routes/admin/login');    //admin login route
const adminsignup = require('./api/authentication/routes/admin/signup');    //admin signup
const superadminlogin = require('./api/authentication/routes/superadmin/login');
const userlogin = require('./api/authentication/routes/User/user');
const user_google_fb_login = require('./api/authentication/routes/User/googlefblogin')
const shopuser = require('./api/user_profie/shopkeeper/shopuser');
const logout = require('./api/authentication/routes/logout');

var app= express();

app.use(session({ cookie: { maxAge: 3600000,
    secure: true,},
secret: 'woot',
resave: true,
saveUninitialized: true}));

app.use(bodyParser.urlencoded({
    extended:true,
}));

app.use(express.static(path.join(__dirname,'public')));

//using the route middleware

app.use(bodyParser.json());
app.use(cors());


app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use('/admin',adminlogin);
app.use('/admin',adminsignup);
app.use('/superadmin',superadminlogin);
app.use('/users',userlogin);
app.use('/user1',user_google_fb_login);
app.use('/shopuser',shopuser);
app.use('/logout',logout);





app.use('/',homepage_routes);
app.use('/popular-items',popular_items);
app.use('/category',category);
app.use('/add-product',create_product);
app.use('/product',product_detail);
// app.use('/user',user);
app.use('/search',search);

app.use('/uploadimage',uploadimage);



//listening to the port

const port = process.env.PORT || 3000;
app.listen(port ,()=>
console.log('Listening to the port'+port)
);

// app.listen(3000,function(){
// console.log('Listening to port number 4000');
// });
