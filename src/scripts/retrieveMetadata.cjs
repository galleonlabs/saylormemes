const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "saylormemes.appspot.com",
});

const bucket = admin.storage().bucket();

const file = bucket.file("videos/chair_saylor.mp4");

file
  .getMetadata()
  .then((data) => {
    const metadata = data[0];
    console.log("Metadata: ", metadata);
  })
  .catch((error) => {
    console.error("Error fetching metadata:", error);
  });
