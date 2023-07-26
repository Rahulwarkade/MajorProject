var mongoose = require("mongoose"); 
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/whatsappDB');

var userSchema = mongoose.Schema({
  username : String,
  password : String,
  pic : String,
  friends : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  }],
  chats : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  }],
  currentSocket : String,
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema);