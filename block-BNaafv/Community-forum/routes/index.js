var express = require('express');
var router = express.Router();
var auth=require('../middelwares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/protected',auth.verifyToken,(req,res,next)=>{
  res.json({msg:'Protected resource'});
})

module.exports = router;