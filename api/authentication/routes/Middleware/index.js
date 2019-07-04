const User = require('../../models/index');
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
          res.status(204);

            return next();

        }
       res.status(203).json({message:"not authorized"});
    },
  }
