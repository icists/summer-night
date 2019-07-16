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

function teamToColor(team) {
  if (team === -1) return 'uncaptured';
  if (team % 4 === 0) return 'yellow';
  if (team % 4 === 1) return 'red';
  if (team % 4 === 2) return 'purple';
  if (team % 4 === 3) return 'blue';
}

exports.updatePoint = functions.database.ref('games/{gameID}/team')
  .onUpdate((snapshot, context) => {
    const beforeTeam = snapshot.before.val();
    const afterTeam = snapshot.after.val();

    snapshot.before.ref.parent.once('value', game => {
      const gamePoint = game.type === 'Match' ? 2 : 1;
      if (teamToColor(beforeTeam) !== teamToColor(afterTeam)) {
        if (beforeTeam !== -1) {
          admin.database().ref(`colors/${teamToColor(beforeTeam)}/point`)
            .transaction(currentPoint => currentPoint - gamePoint);
        }
        if (afterTeam !== -1) {
          admin.database().ref(`colors/${teamToColor(afterTeam)}/point`)
            .transaction(currentPoint => currentPoint + gamePoint)
        }
      }
    });
  });

exports.updateGameTeamForRecord = functions.database.ref('games/{gameID}/history')
  .onCreate((snapshot, context) => {
    const newLog = snapshot.val();
    admin.database().ref(`games/${context.params.gameID}`).child('history')
      .orderByChild('record').limitToFirst(1).on(snapshot => {
        const bestLog = snapshot.val();
        if (newLog.record < bestLog.record) {
          admin.database().ref(`games/${context.params.gameID}`).update({
            team: newLog.team
          });
        }
      });
  })

exports.sanitizeTeam = functions.database.ref('games/{gameID}/team')
  .onUpdate((snapshot, context) => {
    const updatedTeam = snapshot.after.val();
    if (typeof (updatedTeam) === 'string') {
      const team = parseInt(updatedTeam, 10);
      admin.database().ref(`games/${context.params.gameID}`).update({
        team: team,
      });
    }
  })