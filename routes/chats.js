var mongoose = require("mongoose"); 

var chatSchema = mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    message: String,
    time: String,
})

module.exports = mongoose.model('chat',chatSchema);