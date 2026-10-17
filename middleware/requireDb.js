const { db } = require('../config/firebaseConfig');

// Answer clearly instead of crashing when the service-account key is missing.
const requireDb = (req, res, next) => {
    if (!db)
    {
        return res.status(503).json({
            error: 'Firestore is not configured on this server. Add serviceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT.',
        });
    }
    next();
};

module.exports = requireDb;
