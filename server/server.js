// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
// const serviceAccount = require('./chatapp-bc8d5-ee98dbb7627f.json');
// const amqp = require('amqplib');

// const InQUEUE = 'messageInbox';
// const OutQUEUE = 'messageOutbox';


// var rabbitmqchannel, rabbitmqconnection;
// async function connectRabbit() {
//     try {
//         const amqpServerURL = 'amqp://localhost';
//         rabbitmqconnection = await amqp.connect(amqpServerURL);
//         rabbitmqchannel = await rabbitmqconnection.createChannel();
//         // console.log(rabbitmqchannel)
//         // console.log(rabbitmqconnection)
//         await rabbitmqchannel.assertQueue(InQUEUE);
//         await rabbitmqchannel.assertQueue(OutQUEUE);
//     } catch (err) {
//         console.log('caught error: ', err)
//     }
// }

const celeryClient = require('./celery.js');
const firebasedb = require('./firebase-setup.js');

const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http, { cors: { origin: '*' } });

const cors = require('cors');

var clients = {};
var clientList = [];
const apiport = 5000;
const socketport = 3000;
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

app.post('/signup', async (req, res) => {
    try {
        console.log(req.body);

        const docRef = firebasedb.collection('users').doc(req.body.username.toString().toLowerCase());
        const doc = await docRef.get();
        if (!doc.exists) {
            await docRef.set({
                username: req.body.username.toString().toLowerCase(),
                password: req.body.password.toString().toLowerCase(),
            });
            res.send({ resp: true, msg: 'Success' })
            return;
        } else {
            console.log('user already exist please sign in')
            res.send({ resp: false, msg: 'User already exist please sign in' })
            return;
        }
    } catch (e) {
        console.log('error in signup', e);
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log('login', req.body);
        const username = req.body.username.toString().toLowerCase();
        const docRef = firebasedb.collection('users').doc(username);
        const doc = await docRef.get();
        if (!doc.exists) {
            console.log('user is not signed up')
            res.send({ resp: false, msg: 'User is not signed up. Please Signin.' })
            return;
        } else {
            if (doc.data().password == req.body.password.toString()) {
                if (clientList.indexOf(username) < 0) {
                    res.send({ resp: true, msg: 'Success' });
                    return;
                } else {
                    res.send({ resp: false, msg: 'User is logged in on some other device. Log out first.' });
                    return;
                }
            }
        }

        console.log('incorrect password');
        res.send({ resp: false, msg: 'Incorrect password' });
        return;
    } catch (e) {
        console.log('error in login', e);
    }
});

app.post('/pastusers', async (req, res) => {
    try {
        console.log('get your past users', req.body)
        const username = req.body.username.toString().toLowerCase();
        const docRef = await firebasedb.collection(username).get();
        const hist = docRef.docs;
        var histData = [];
        if (hist.length > 0) {
            hist.forEach(x => { histData.push(x.id) });
            res.send(histData);
        } else {
            console.log('No chat exists')
            res.send([])
            return;
        }
    } catch (e) {
        console.log('error in pastusers', e);
    }
});

app.post('/getchat', async (req, res) => {
    try {
        console.log(req.body);

        const docRef = await firebasedb.collection(req.body.id).get();
        const docs = docRef.docs;
        var colData = []
        if (docs.length > 0) {
            docs.forEach(x => { colData.push({ time: x.id, data: x.data() }) });
            res.send(colData);
        } else {
            console.log('No chat exists')
            res.send({ resp: false, msg: 'No chat exists' })
            return;
        }
    } catch (e) {
        console.log('error in getchat', e);
    }
});

// const add = celeryClient.createTask("tasks.add");
// const sub = celeryClient.createTask("tasks.sendmessage");
// sub.applyAsync([1, 2]);
// const result = add.applyAsync([1, 2]);
// result.get().then(data => {
//     console.log(data);
//     client.disconnect();
// });

// initializeApp({
//     credential: cert(serviceAccount)
// });
// const db = getFirestore();

io.on('connection', function (socket) {

    socket.on('join', async function (username) {
        try {
            username = username.toString().toLowerCase();
            if (!clientList.includes(username)) {
                console.log(`${username} joined`);
                clientList.push(username);
                clients[socket.id] = { 'username': username };
                console.log('client list join', clientList);
                // await connectRabbit();

                const joined = celeryClient.createTask("tasks.userJoined");
                const results = joined.applyAsync([username])
                results.get().then(data => {
                    console.log(data);
                });
            }

            socket.emit("users", clientList);
            socket.broadcast.emit("users", clientList);

            // rabbitmqchannel.consume(OutQUEUE, (data) => {
            //     var client = clients[socket.id];
            //     if (client) {
            //         console.log('listen queue', data.content.toString());
            //         var username = client['username'];
            //         var d = JSON.parse(data.content.toString());
            //         console.log('touser ', d['touser']);
            //         if (d['touser'] == username) {
            //             console.log('usermatched');
            //             socket.emit('recievedText', d);
            //         }
            //     }
            // }, { noAck: true });

        } catch (e) {
            console.log('error in join', e);
        }
    });

    socket.on('sendUpdatedClients', function () {
        try {
            socket.broadcast.emit("users", clientList);
        } catch (e) {
            console.log('error in join', e);
        }
    });

    socket.on('getText', function (data) {
        try {
            console.log('got msg', data);
            var d = JSON.parse(data.content.toString());
            var client = clients[socket.id];
            var username = client['username'];
            if (d['touser'] == username) {
                console.log('usermatched');
                socket.emit('recievedText', d);
            }
        } catch (e) {
            console.log('error in join', e);
        }
    });

    socket.on('sendText', async function (data) {
        try {
            console.log('from sendtext', data);
            console.log(data['chatid']);

            const userlist = celeryClient.createTask("tasks.addUserList");
            const ulresults = userlist.applyAsync([data])
            ulresults.get().then(data => {
                console.log(data);
            });

            const sendmsg = celeryClient.createTask("tasks.sendMessage");
            const results = sendmsg.applyAsync([data])
            results.get().then(data => {
                console.log(data);
            });
            const updateViewCount = celeryClient.createTask("tasks.updateCount");
            const countResults = updateViewCount.applyAsync([data])
            countResults.get().then(data => {
                console.log(data);
            });
            // const p = firebasedb.collection(data['fromuser']).doc(data['touser']);
            // const pi = await p.get();
            // if (!pi.exists) {
            //     await p.set({ chat: true })
            // }
            // const q = firebasedb.collection(data['touser']).doc(data['fromuser']);
            // const qi = await q.get();
            // if (!qi.exists) {
            //     await q.set({ chat: true })
            // }

            // const docRef = firebasedb.collection(data['chatid'].toString()).doc(data['timestamp'].toString());
            // await docRef.set({
            //     fromuser: data['fromuser'],
            //     toUser: data['touser'],
            //     text: data['text'],
            //     state: data['state']
            // }).then(() => {
            socket.broadcast.emit('recievedText', data);
            console.log('broadcasted msg');
            // await rabbitmqchannel.sendToQueue(OutQUEUE, Buffer.from(JSON.stringify(data)))
            // });
        } catch (e) {
            console.log('error in join', e);
        }
    });


    socket.on('disconnect', function () {
        try {
            console.log('A user disconnected');
            var client = clients[socket.id]
            if (client) {
                var username = client['username'];
                clientList.splice(clientList.indexOf(username), 1);
                delete clients[socket.id];
                // rabbitmqchannel.close();
                // rabbitmqconnection.close();
            }
            console.log('client list disconnect', clientList);
            socket.broadcast.emit("users", clientList);
        } catch (e) {
            console.log('error in join', e);
        }
    });

    socket.on('logout', function () {
        try {
            console.log('A user loggedout');
            var client = clients[socket.id]
            if (client) {
                var username = client['username'];
                clientList.splice(clientList.indexOf(username), 1);
                delete clients[socket.id];
                // rabbitmqchannel.close();
                // rabbitmqconnection.close();
            }
            console.log('client list logout', clientList);
            socket.broadcast.emit("users", clientList);
        } catch (e) {
            console.log('error in join', e);
        }
    });
});

http.listen(socketport, () => {
    console.log(`socket listening on port ${socketport}`);
});

app.listen(apiport, () => {
    console.log(`Api listening on port ${apiport}`);
}); 