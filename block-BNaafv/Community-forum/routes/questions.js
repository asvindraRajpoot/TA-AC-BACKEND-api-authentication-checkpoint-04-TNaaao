var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middelwares/auth');
var question=require('../models/question');


//post request on /questions //create a question
router.post('/',auth.verifyToken,async function(req,res,next){
    console.log('it is created question');
})















module.exports = router;