var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middelwares/auth');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//register user
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });

  } catch (error) {
    next(error);

  }


})







//login handler
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email/Password required" });
  }
  try {
    var user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Email not registered" });
    }
    var result = await user.verifyPassword(password);
    //
    if (!result) {
      return res.status(400).json({ error: "Invalid Password" });
    }
    //console.log(result,user);
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });


  } catch (error) {
    next(error);

  }
})

//get current-user
router.get('/current-user', auth.verifyToken, async function (req, res, next) {

  try {
    const user = await User.findById(req.user.userId);
    res.json({
      user: user.userJSON(req.headers.authorization)
    })
  


  } catch (error) {
    next(error);

  }
})


//get profile info
router.get('/profile/:username',async function(req,res,next){
  const username=req.params.username;
  //console.log(username);
  try{
    const user=await User.find({username:username});
    //console.log(user);
    if(user){
      res.json({
        user:user[0].profileJSON()
      })
    }else{
      return res.status(400).json({ error: "User not available" });

    }

  }catch(error){
    next(error);

  }

})

//update the profile PUT request
router.put('/profile/:username',auth.verifyToken,async function(req,res,next){
  const username=req.params.username;

  try {
    const user=await User.find({username:username});
    console.log('user',user);
    if(user){
      const updatedUser=await User.findByIdAndUpdate(user[0]._id,req.body);
      console.log('updatedUser',updatedUser);
      if(updatedUser){
        res.json({
          user:updatedUser.profileJSON()
        })

      }else{
        return res.status(400).json({ error: "User is not updated" });

      }
     
    }else{
      return res.status(400).json({ error: "User not available" });
    }

    
  } catch (error) {
    next(error)
    
  }

})

//create question post request on /questions

module.exports = router;