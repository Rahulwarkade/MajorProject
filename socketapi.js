const io = require( "socket.io" )();
const userModel = require('./routes/users');
const chatModel = require('./routes/chats');
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    
    socket.on("newUserConnected",async username=>{
        var user = await userModel.findOne({username : username});
        user.currentSocket = socket.id;
        await user.save();
    })

    // socket.on("disconnect",async ()=>{
    //     var disconnectedUser = await userModel.findOne({_id : socket.id});
    //     // disconnectedUser.currentSocket = "";
    //     // await disconnectedUser.save();
    //     console.log(disconnectedUser);
    // })
    socket.on("newmsg",async currentMessage=>{
        var fromUser = await userModel.findOne({username : currentMessage.fromUser});
        currentMessage.fromUserPic = fromUser.pic;
        var toUser = await userModel.findOne({username : currentMessage.toUser});

        var idx = toUser.chats.indexOf(fromUser._id);

        if(idx==-1)
        {
            currentMessage.newchat = true,
            fromUser.chats.push(toUser._id);
            toUser.chats.push(fromUser._id);
            await fromUser.save();
            await toUser.save();
        }

        var dt = new Date();
        var hour = dt.getHours();
        var ampm = (hour>12) ? "PM" : "AM";
        var min = dt.getMinutes();
        var tim = hour + ":" + min + ampm;
        currentMessage.time = tim;
        var newChat = await chatModel.create(
            {
                fromUser : fromUser._id,
                toUser : toUser._id,
                message : currentMessage.data,
                time : tim,
            }
        )

        if(toUser.currentSocket)
        {
            socket.to(toUser.currentSocket).emit("chat",currentMessage);
        }
        else
        {
            console.log("User is offline.");
        }
        
    })
});
// end of socket.io logic
module.exports = socketapi;  