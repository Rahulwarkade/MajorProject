var express = require('express');
var router = express.Router();
var userModel = require('./users.js');
var chatModel  = require('./chats.js')
var passport = require('passport');
var localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
async function clearSockets() {
  var allUser = await userModel.find({})
  await Promise.all(
    allUser.map(async user => {
      user.currentSocket = ''
      await user.save()
    })
  )
}
clearSockets()

router.get('/profile', isLoggedIn,async (req,res)=>{
  var foundUser = await userModel.findOne({username : req.session.passport.user});
  res.render('profile',{user : foundUser});
})
router.post('/register',async (req,res)=>{
  var newUser = new userModel({
    username : req.body.username,
    pic : req.body.pic
  })
  await userModel.register(newUser,req.body.password);

  passport.authenticate('local')(req,res,()=>{
      res.redirect('/profile');
    })
  }) 
router.post('/login',passport.authenticate('local',{
  successRedirect :  '/profile',
  failureRedirect : '/'
}),(req,res)=>{});


router.get('/logout',(req,res,next)=>{
  req.logout((err)=>
  {
    if(err) res.send(err);
    else res.redirect('/');
  })
})


function isLoggedIn(req,res,next)
{
  if(req.isAuthenticated())
  {
    return next();
  }
  else
  {
    res.redirect('/');
  }
}

router.get('/find/username/:username',(req,res)=>
{
  var regex = new RegExp("^"+req.params.username);
  userModel.find({username : regex})
  .then((allusers)=>
  {
    res.json(allusers);
  })
})

router.post('/getChat',async (req,res)=>{
  var toUser = await userModel.findOne({username : req.body.oppositUsername});
  var fromUser = await userModel.findOne({username : req.session.passport.user});

  var userChats = await chatModel.find(
    {
      $or : [
        {
          fromUser : fromUser._id,
        },
        {
          fromUser : toUser._id
        }
      ],
      $or : [
        {
          toUser : fromUser._id
        },
        {
          toUser : toUser._id
        }
      ]
    }
  ).populate("fromUser").populate("toUser");
  res.status(200).json(userChats);
})
module.exports = router;
