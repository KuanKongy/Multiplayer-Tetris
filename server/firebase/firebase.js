const admin = require("firebase-admin");

// let serviceAccount = require("./serviceAccountKey.json");
const serviceAccountJSON = Buffer.from(process.env.FIREBASE_KEY_B64, "base64").toString("utf-8");
const serviceAccount = JSON.parse(serviceAccountJSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const highscoreRef = db.collection("highScores");

const getHighscoreList = async () => {
  const snapshot = await highscoreRef.get();
  return snapshot.docs.map(doc => doc.data());
};

const updateHighscoreList = async highscoreList => {
  const documentList = await highscoreRef.listDocuments();
  documentList.forEach(doc => doc.delete());

  highscoreList.forEach(highscore => {
    highscoreRef
    .add({
      name: highscore.name,
      score: highscore.score
    })
  })
};

module.exports = {
  updateHighscoreList,
  getHighscoreList
} 