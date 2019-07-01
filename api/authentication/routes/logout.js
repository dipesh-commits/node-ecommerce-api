const express = require('express');
const router  = express.Router();

//for logging out
router.get("/", function(req, res){
   req.logout();
   res.status(200).json({success:'successfully logged out.'});
});

module.exports = router;
