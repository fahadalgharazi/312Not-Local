// dependencies
const express = require("express");
const app = express();
const port = 8000;
const mime = require("mime-types");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongo = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');

// connect to mongo
// useNewUrlParser: uses newer parser instead of legacy one
// useUnifiedTopology: use new topology engine
mongo.connect("mongodb://mongo:27017/312Not-Local", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

// Schema for posts
const post_schema = new Schema({
  user: String,
  creation_date: {
    type: Date,
    default: Date.now,
  },
  title: String,
  description: String,
});

// creates a model, which is basically db["User"]
const User = mongo.model("User", user_schema);

// db["Post"]
const Post = mongo.model("Post", post_schema);

// DATABASE CRUD
async function add_new_user(username, password, email) {
  // async and await allow other processes to run while this is running
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

// Database function for adding a post
async function add_new_post(username, title, description) {
  // async and await allow other processes to run while this is running
  // create a new document for user
  const new_post = new Post({
    user: username,
    title: title,
    description: description,
  });

  // save it to database
  await new_post
    .save() // can use save() or insertOne() but save() is more convenient
    .then(() => console.log("Post saved: ", new_post["user"]))
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
app.use(express.json())
app.use(bodyParser.json());

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
  //const user_doc = user_collection.findOne()
  console.log("Registering!");
});
// running the app
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.path);
    res.sendFile(filePath);
})

app.post('/make-post', bodyParser.json(), (req, res) => { 
    console.log(req.body['title'])
    title = "my first post"
    description = "hi guys"
    // Do some DB stuff in here
    //add_new_post("Billy23", title, description)
    res.send("New POST Made")
 })  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
