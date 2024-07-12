var mongoose = require("mongoose"); 
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb+srv://rahulwarkade954:<password>@cluster0.u32a3jc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

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
