const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/EmployeeDB',{useNewUrlParser: true},(err)=>{
    if(!err) {console.log('MongoDb Connection Succedded')}
    else { console.log('Error in DB Connection:'+err)}
});

module.exports = mongoose;