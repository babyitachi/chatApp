const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http,{ cors: {origin : '*'}});

const cors = require('cors')

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

app.post('/signup',(req,res)=>{
    console.log(req.body);
    res.send(true)
});

app.post('/login',(req,res)=>{
    console.log(req.body);
    res.send(true)
});

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