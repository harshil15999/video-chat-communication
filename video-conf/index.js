const express=require("express")
const app=express()
const server=require('http').Server(app)

//need to understand the below line 
const {v4:uuidv4}=require('uuid');

const io = require('socket.io')(server);

const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{debug:true,})


app.set('view engine','ejs');
app.use('/peerjs',peerServer);
app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})
app.get("/:room",(req,res)=>{
    res.render('room',{roomId:req.params.room})
    console.log(req.params.room);
})
    

io.on('connection',socket=>{
    socket.on("join-room",(roomId,userId)=>{
        console.log("joined");
        console.log(userId);

        socket.join(roomId)
        socket.to(roomId).broadcast.emit("user-connected",userId);
    })

})

server.listen(process.env.PORT||3030)
