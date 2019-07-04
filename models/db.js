const mongoose = require('mongoose');




//connecting to the database with mongoose
mongoose.connect('mongodb://localhost:27017/EcommerceDB', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDb Connection Succedded') } else { console.log('Error in DB Connection:' + err) }
});
mongoose.set('debug', true)
module.exports = mongoose;