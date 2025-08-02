const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerce-jewlery.firebaseio.com"
});

const db = admin.firestore();

module.exports = { db };
