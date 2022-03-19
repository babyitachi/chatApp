const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./chatapp-bc8d5-ee98dbb7627f.json');

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

    const docRef = db.collection('users').doc(req.body.username.toString().toLowerCase());
    const doc = await docRef.get();
    if (!doc.exists) {
        await docRef.set({
            username: req.body.username.toString().toLowerCase(),
            password: req.body.password.toString().toLowerCase(),
            });
        res.send({resp:true,msg:'Success'})
        return;
    } else {
        console.log('user already exist please sign in')
        res.send({resp:false,msg:'User already exist please sign in'})
        return;
    }

});

app.post('/login',async (req,res)=> {
    console.log('login',req.body);
    const username=req.body.username.toString().toLowerCase();
    const docRef = db.collection('users').doc(username);
    const doc = await docRef.get();
    if(!doc.exists){
        console.log('user is not signed up')
            res.send({resp:false,msg:'User is not signed up. Please Signin.'})
            return;
    }else{
        if(doc.data().password==req.body.password.toString()){
            if(clientList.indexOf(username)<0){
                res.send({resp:true,msg:'Success'});
                return;
            }else{
                res.send({resp:false,msg:'User is logged in on some other device. Log out first.'});
                return;
            }
        }
    }

    console.log('incorrect password');
    res.send({resp:false,msg:'Incorrect password'});
    return;
});

initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();

io.on('connection', function(socket) {

    socket.on('join', function (username) {
        username=username.toString().toLowerCase()
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