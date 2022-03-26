const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./chatapp-bc8d5-ee98dbb7627f.json');

initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();

module.exports=db;