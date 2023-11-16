const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "saylormemes.appspot.com",
});

var bucket = app.storage().bucket();

const file = bucket.file("videos/interstellar_saylor.mp4");

const metadata = {
  metadata: {
    title: "Interstellar recording Saylor",
  },
};

file
  .setMetadata(metadata)
  .then(() => {
    console.log("Metadata updated successfully");
  })
  .catch((error) => {
    console.error("Error updating metadata:", error);
  });
