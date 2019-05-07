require('./models/db');
const bodyParser = require('body-parser');
const express= require('express');

const homepage_routes= require('./api/homepageroute');



var app= express();

app.use(bodyParser.urlencoded({
    extended:true,
}));

app.use(bodyParser.json());
app.use('/',homepage_routes);

app.listen(3000,function(){
console.log('Listening to port number 3000');
});

