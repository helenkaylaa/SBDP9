// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./sbdp8-b0a14-firebase-adminsdk-9o9iu-95f8ae6112.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-database-name>.firebaseio.com", // Replace with your Realtime Database URL
});

// Realtime Database Reference
const db = admin.database();

// Create Express App
const app = express();
app.use(bodyParser.json());

// CRUD Routes

// Create (or Update) a document
app.post("/create", async (req, res) => {
  try {
    const { path, data } = req.body; // `path` defines where in the hierarchy to store data
    await db.ref(path).set(data);
    res.status(201).send({ message: "Data created successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Read data
app.get("/read/*", async (req, res) => {
  try {
    const path  = req.params[0];
    const snapshot = await db.ref(path).once("value");
    if (!snapshot.exists()) {
      return res.status(404).send({ message: "Data not found" });
    }
    res.status(200).send(snapshot.val());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update data (partial update)
app.put("/update", async (req, res) => {
  try {
    const { path, data } = req.body; // `path` defines where in the hierarchy to update data
    await db.ref(path).update(data);
    res.status(200).send({ message: "Data updated successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete data
app.delete("/delete/*", async (req, res) => {
  try {
    const path = req.params[0];
    await db.ref(path).remove();
    res.status(200).send({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
