const celery = require('celery-node');
const { FieldValue } = require('firebase-admin/firestore');
const firebasedb = require('./firebase-setup.js');

const worker = celery.createWorker(
    "amqp://localhost",
    "amqp://"
);

worker.register("tasks.userJoined", async (username) => {
    try {
        if (username) {
            username = username.toString().toLowerCase();
            const docRef = await firebasedb.collection(username).get();
            const hist = docRef.docs;
            histData = [];
            if (hist.length > 0) {
                hist.forEach(x => { histData.push(x.id) });
                return histData;
            } else {
                console.log('No chat exists');
                return [];
            }
        }
        return [];
    } catch (e) {
        console.log('error occured in userJoined', e);
        return [];
    }
});

worker.register("tasks.addUserList", async (msgData) => {
    try {
        if (msgData) {
            const p = firebasedb.collection(msgData['fromuser']).doc(msgData['touser']);
            const pi = await p.get();
            if (!pi.exists) {
                await p.set({ chat: true })
            }
            const q = firebasedb.collection(msgData['touser']).doc(msgData['fromuser']);
            const qi = await q.get();
            if (!qi.exists) {
                await q.set({ chat: true })
            }
            return true;
        }
        return false;
    } catch (e) {
        console.log('error occured in addUserList', e);
        return false;
    }
});

worker.register("tasks.sendMessage", async (msgData) => {
    try {
        if (msgData) {
            const docRef = firebasedb.collection(msgData['chatid'].toString()).doc(msgData['timestamp'].toString());
            await docRef.set({
                fromuser: msgData['fromuser'],
                toUser: msgData['touser'],
                text: msgData['text'],
                state: msgData['state']
            }).then(() => {
                // console.log();
            });
            return true;
        }
        return false;
    } catch (e) {
        console.log('error occured in sendmessage', e)
        return false;
    }
});

worker.register("tasks.updateCount", async (msgData) => {
    try {
        if (msgData) {
            const docRef = firebasedb.collection(msgData['touser'].toString()).doc(msgData['fromuser'].toString());
            await docRef.update({
                unreadcount: FieldValue.increment(1)
            }).then(() => {
                // console.log();
            });
            return true;
        }
        return false;
    } catch (e) {
        console.log('error occured in sendmessage', e)
        return false;
    }
});


// worker.start();
module.exports = worker;
