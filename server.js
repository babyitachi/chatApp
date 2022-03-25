const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./chatapp-bc8d5-ee98dbb7627f.json');
const amqp=require('amqplib');

const InQUEUE='messageInbox';
const OutQUEUE='messageOutbox';


var rabbitmqchannel,rabbitmqconnection;
async function connectRabbit(){
    try{
        const amqpServerURL='amqp://localhost';
        rabbitmqconnection = await amqp.connect(amqpServerURL);
        rabbitmqchannel = await rabbitmqconnection.createChannel();
        // console.log(rabbitmqchannel)
        // console.log(rabbitmqconnection)
        await rabbitmqchannel.assertQueue(InQUEUE);
        await rabbitmqchannel.assertQueue(OutQUEUE);
    }catch(err){
        console.log('caught error: ',err)
    }
}
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

app.post('/pastusers', async (req, res) => {
    console.log('get your past users',req.body)
    const username = req.body.username.toString().toLowerCase();
    const docRef = await db.collection(username).get();
    const hist = docRef.docs;
    var histData=[];
    if (hist.length>0) {
        hist.forEach(x=>{histData.push(x.id)});
        res.send(histData);
    } else {
        console.log('No chat exists')
        res.send([])
        return;
    }
});

app.post('/getchat', async (req,res)=>{
    console.log(req.body);

    const docRef = await db.collection(req.body.id).get();
    const docs = docRef.docs;
    var colData=[]
    if (docs.length>0) {
        docs.forEach(x=>{colData.push({time:x.id,data:x.data()})});
        res.send(colData);
    } else {
        console.log('No chat exists')
        res.send({resp:false,msg:'No chat exists'})
        return;
    }
});

initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();

io.on('connection', function(socket) {

    socket.on('join', async function (username) {
        username=username.toString().toLowerCase();
        console.log(`${username} joined`);
        clientList.push(username);
        clients[socket.id]={'username':username};
        console.log('client list join',clientList);
        socket.emit("users",clientList);
        socket.broadcast.emit("users",clientList);
        await connectRabbit();
        
        rabbitmqchannel.consume(OutQUEUE,(data)=>{
            var client = clients[socket.id];
            if(client){
                console.log('listen queue',data.content.toString());
                var username=client['username'];
                var d=JSON.parse(data.content.toString());
                console.log('touser ',d['touser']);
                if(d['touser']==username){
                    console.log('usermatched');
                    socket.emit('recievedText',d);
                }
            }
        },{noAck:true});
    });

    socket.on('sendUpdatedClients',function(){
        socket.broadcast.emit("users",clientList);
    });

    socket.on('sendText',async function(data){
        console.log('from sendtext',data);
        console.log(data['chatid']);
        const p = db.collection(data['fromuser']).doc(data['touser']);
        const pi=await p.get();
        if(!pi.exists){
            await p.set({chat:true})
        }
        const q = db.collection(data['touser']).doc(data['fromuser']);
        const qi = await q.get();
        if(!qi.exists){
            await q.set({chat:true})
        }

        const docRef = db.collection(data['chatid'].toString()).doc(data['timestamp'].toString());
        await docRef.set({
            fromuser:  data['fromuser'],
            toUser:  data['touser'],
            text: data['text'],
            state: data['state']
            }).then(
                await rabbitmqchannel.sendToQueue(OutQUEUE,Buffer.from(JSON.stringify(data)))
            );
    });


    socket.on('disconnect', function () {
       console.log('A user disconnected');
        var client = clients[socket.id]
        if(client){
            var username=client['username'];
           clientList.splice(clientList.indexOf(username),1);
           delete clients[socket.id];
           rabbitmqchannel.close();
           rabbitmqconnection.close();
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
            rabbitmqchannel.close();
            rabbitmqconnection.close();
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