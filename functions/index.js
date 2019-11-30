const functions = require('firebase-functions');
const serviceAccount = require('./ServiceAccountKey');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('screams')
    .get()
    .then(querySnapshot => {
      let screams = [];
      querySnapshot.forEach(doc => screams.push(doc.data()));
      return res.json(screams);
    })
    .catch(err => console.log(err));
});

exports.createScream = functions.https.onRequest((req, res) => {
  // const { body, userHandle } = req.body;
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: 'Oh no. Something went wrong!' });
      console.log(err);
    });
});
