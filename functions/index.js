const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require('./summer-night-icists-firebase-adminsdk-zq729-d55886aae9.json');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://summer-night-icists.firebaseio.com",
});

exports.evaluatePoint = functions.database.ref('games/{gameID}')
  .onUpdate((snapshot, context) => {
    const beforeGame = snapshot.before.val();
    const afterGame = snapshot.after.val();

    const beforeTeam = beforeGame.team.toLowerCase();
    const afterTeam = afterGame.team.toLowerCase();

    const gamePoint = beforeGame.type === 'Match' ? 2 : 1;

    if (beforeTeam !== afterTeam) {
      if (beforeTeam !== 'Uncaptured') {
        admin.database().ref(`colors/${beforeTeam}`)
          .once('value', snapshot => {
            const color = snapshot.val();
            admin.database().ref(`colors/${beforeTeam}`).set({
              point: color.point - gamePoint,
            })
          });
      }
      if (afterTeam !== 'Uncaptured') {
        admin.database().ref(`colors/${afterTeam}`)
          .once('value', snapshot => {
            const color = snapshot.val();
            admin.database().ref(`colors/${afterTeam}`).set({
              point: color.point + gamePoint,
            })
          });
      }
    }
  })