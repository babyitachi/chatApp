const redis = require('redis');

const express = require('express');
const app = express();



const http = require('http').Server(app);
const io = require('socket.io')(http,{ cors: {origin : '*'}});

const cors = require('cors');
const { async } = require('rxjs/internal/scheduler/async');

var clients = {};
var clientList = [];
const port = 5000;
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts));
app.use(express.json());

app.post('/signup',async (req,res)=>{
    console.log(req.body);
    value=await redisclient.get(req.body.username.toString().toLowerCase())
    if(value!=null){
        console.log('user already exist please sign in')
        res.send(false)
        return;
    }
    redisclient.set(req.body.username.toString().toLowerCase(), req.body.password.toString(), (err, reply) => {
        if (err) throw err;
        console.log(reply);
    });
    res.send(true)
});

app.post('/login',async (req,res)=> {
    console.log('login',req.body);

    value=await redisclient.get(req.body.username.toString().toLowerCase())
    console.log('get value:',value)
    if (value==null){
        console.log('user is not signed up')
        res.send(false)
    }
    if(req.body.password.toString()==value){
        res.send(true)
        return;
    }
    console.log('incorrect password');
    res.send(false)
});

const redisclient = redis.createClient({
    url:'redis://10.17.10.17:6379'
});

redisclient.on('error', err => {
    console.log('Error ' + err);
});
redisclient.connect();


io.on('connection', function(socket) {

    socket.on('join', function (username) {
        console.log(`${username} joined`)
        clientList.push(username);
        clients[socket.id]={'username':username};
        console.log('client list join',clientList);
        socket.emit("users",clientList);
        socket.broadcast.emit("users",clientList);
    });

    socket.on('sendUpdatedClients',function(){
        socket.broadcast.emit("users",clientList);
    });

    socket.on('disconnect', function () {
       console.log('A user disconnected');
        var client = clients[socket.id]
        if(client){
            var username=client['username'];
           clientList.splice(clientList.indexOf(username),1);
           delete clients[socket.id];
        }
        console.log('client list disconnect',clientList);
        socket.broadcast.emit("users",clientList);
    });

    socket.on('logout', function () {
        console.log('A user loggedout');
         var client = clients[socket.id]
         if(client){
             var username=client['username'];
            clientList.splice(clientList.indexOf(username),1);
            delete clients[socket.id];
         }
         console.log('client list logout',clientList);
         socket.broadcast.emit("users",clientList);
     });
});
 
 http.listen(3000, function() {
    console.log('listening on *:3000');
 });

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 