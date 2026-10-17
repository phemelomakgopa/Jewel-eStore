const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// The service-account key is a secret and is never committed. Point to it with
// FIREBASE_SERVICE_ACCOUNT (a file path) or put serviceAccountKey.json in the
// project root. Download it from Firebase console → Project settings →
// Service accounts → Generate new private key.
const keyPath = path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT || path.join(__dirname, '../serviceAccountKey.json')
);

let db = null;

if (fs.existsSync(keyPath))
{
  admin.initializeApp({
    credential: admin.credential.cert(require(keyPath)),
    databaseURL: 'https://ecommerce-jewlery.firebaseio.com',
  });
  db = admin.firestore();
}
else
{
  console.warn(
    `\n⚠  Firestore is not configured: no service-account key at ${keyPath}\n` +
    '   The API will start, but /api/products and /api/orders return 503 until you add one.\n' +
    '   (The storefront in client/ does not need this server — run it with: cd client && npm start)\n'
  );
}

module.exports = { db };
