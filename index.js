// dependencies
const express = require("express");
const app = express();
const port = 8000;
const mime = require("mime-types");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongo = require("mongoose");
const bcrypt = require("bcrypt");

// connect to mongo
// useNewUrlParser: uses newer parser instead of legacy one
// useUnifiedTopology: use new topology engine
mongo.connect("mongodb://mongo:27017/312Not-Local", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const user_collection = mongo.Collection("Users");

// creates schema object
const Schema = mongo.Schema;
// creates a blueprint for collection of users
const user_schema = new Schema({
  name: String,
  creation_date: {
    type: Date,
    default: Date.now,
  },
  email: String,
  password: String,
});

// DATABASE CRUD
async function add_new_user(username, password, email) {
  // async and await allow other processes to run while this is running
  // creates a model, which is basically db["User"]
  const User = mongoose.model("Users", user_schema);

  // create a new document for user
  const new_user = new User({
    name: username,
    email: email,
    password: password,
  });

  // hash pw
  new_user.password = await bcrypt.hash(password, 10);

  // save it to database
  await new_user
    .save() // can use save() or insertOne() but save() is more convenient
    .then(() => console.log("User saved: ", new_user["name"]))
    .catch((error) => console.error(error));
}

async function verify_user(username, password) {
  const fetched_data = user_collection.findOne({ name: username });
  if (fetched_data) {
    // if not none check if hashes of passwords match
  } else {
    res.send();
  }
}

// middlewares
const setHeaders = function (req, res, next) {
  const filePath = path.join(__dirname, "public", req.path);
  const mimeType = mime.lookup(filePath);
  if (mimeType) {
    res.type(mimeType);
  }
  res.set("X-Content-Type-Options", "nosniff");
  next();
};
app.use(setHeaders);
app.use(cookieParser());
app.use("/public", express.static("public"));

// http requests
app.get("/visit-counter", (req, res) => {
  if (req.headers.cookie == undefined) {
    res.cookie("Visits", 1, { maxAge: 360000 });
  } else {
    splitCook = req.headers.cookie.split("=");
    cookValueStr = splitCook[1];
    cookValueInt = Number.parseInt(cookValueStr) + 1;
    res.cookie("Visits", cookValueInt, { maxAge: 360000 });
  }
  res.sendFile(path.join(__dirname, "public", "visit-counter.html"));
});

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", req.path);
  res.sendFile(filePath);
});

// posts
app.post("/register", (req, res) => {
  // check if username exists
  console.log("Registering!");
});
// running the app
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.path);
    res.sendFile(filePath);
})

app.post('/make-post', (req, res) => {  
    // Do some DB stuff in here
    res.send("POST Request Called")
 })  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
