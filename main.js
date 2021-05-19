require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { listUsers, createUser, deleteUser } = require("./api.js");
const fs = require("fs");

// https
let protocol;
let options;

if (process.env.PROTOCOL == "https") {
  console.log(`Using scheme : https`);
  protocol = require("https");
  options = {
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERTIFICATE),
    ca: fs.readFileSync(process.env.CA),
  };
} else {
  console.log(`Using scheme : http`);
  protocol = require("http");
  options = {};
}

// Initialize admin sdk configuration
var serviceAccount = require("./firebase.json");
const { create } = require("domain");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.PROJECT_NAME}.firebaseio.com`,
});

// Express seup
const app = express();
app.use(express.json());
app.use(cors());
app.set("port", process.env.PORT || 3000);
app.get("/", (req, res) => res.send("User Service Up!!!"));

// API Endpoints setup
const router = express.Router();
router.get("/list", listUsers);
router.post("/create", createUser);
router.delete("/:uid/delete", deleteUser);

app.use("/api/v1/user", router);

// Init Server
const server = protocol.createServer(options, app);
server.listen(app.get("port"), function () {
  const port = server.address().port;
  console.log(`Application is running on port ${port}`);
});
