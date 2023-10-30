// dependencies
const express = require("express");
const app = express();
const mime = require("mime-types");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongo = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken"); // auth tokens: https://jwt.io/introduction

//port
const port = 8000;

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
  users_liked: [],
  liked: Boolean
});
const auth_schema = new Schema({
  auth_key: String,
  creation_date: {
    type: Date,
    default: Date.now,
  },
  username: String,
});
// creates a model, which is basically db["users"]
const User = mongo.model("users", user_schema);

// db["Post"]
const Post = mongo.model("Post", post_schema);

const Auth = mongo.model("Auth", auth_schema);
//
function escapeHTML(unsafeText) {
  return unsafeText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
// DATABASE CRUD
async function add_new_user(username, password) {
  // async and await allow other processes to run while this is running
  // create a new document for user
  const esc_user = escapeHTML(username);
  const new_user = new User({
    name: esc_user,
    //email: email,
    password: password,
  });
  // hash pw
  new_user.password = await bcrypt.hash(password, 10);

  // save it to database
  await new_user
    .save() // can use save() or insertOne() but save() is more convenient
    .then(() => console.log("User saved: ", new_user["name"]))
    .catch((error) => console.error(error));
  console.log("Registering: ", esc_user);
}

// async function add_new_post(username, title, description) {
//   // async and await allow other processes to run while this is running
//   // create a new document for post
//   const esc_title = escapeHTML(title);
//   const esc_desc = escapeHTML(description);
//   const new_post = new Post({
//     user: username,
//     title: esc_title,
//     description: esc_desc,
//   });
//   // save it to database
//   await new_post
//     .save() // can use save() or insertOne() but save() is more convenient
//     .then(() => console.log("Post Made: ", new_post["user"]))
//     .catch((error) => console.error(error));
// }

async function add_new_post(username, title, description) {
  // async and await allow other processes to run while this is running
  // create a new document for post
  const esc_title = escapeHTML(title);
  const esc_desc = escapeHTML(description);
  const esc_user = escapeHTML(username)
  const new_post = new Post({
    user: esc_user,
    title: esc_title,
    description: esc_desc,
    users_liked: [],
    liked: false
  });
  // save it to database
  await new_post
    .save() // can use save() or insertOne() but save() is more convenient
    .then(() => console.log("Post Made: ", new_post["user"]))
    .catch((error) => console.error(error));
}

async function verify_user(username, password) {
  const esc_user = escapeHTML(username);
  try {
    const fetched_data = await User.findOne({ name: esc_user });
    if (fetched_data) {
      const is_match = await bcrypt.compare(password, fetched_data.password); // returns a promise, await is needed for bool val
      if (is_match) {
        // this block of code checks if passwords match, if yes, send an auth token to client
        const metadata = {
          // metadata about token
          type: "user",
          name: esc_user,
        };
        const secret_key = "secret_key_to_sign_for_jwt";
        const auth_token = jwt.sign(metadata, secret_key, { expiresIn: "1h" });
        const auth_entry = new Auth({
          username: esc_user,
          auth_key: auth_token,
        });
        await auth_entry.save(); // save info into database
        return auth_token;
      } else {
        return "Invalid password!";
      }
    } else {
      return "User not found!";
    }
  } catch (error) {
    // catch whatever error for debuggings
    console.error(error);
    return "An error occurred while verifying the user.";
  }
}

async function token_checker(token) {
  const doc = Auth.findOne({ auth_key: token });
  console.log("Doc: " + doc);
  if (doc) {
    return doc["username"];
  } else {
    return "";
  }
}
async function getAllPosts(){
  const posts = await Post.find({})
  const jString = JSON.stringify(posts)
  return posts
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

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
//gets
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", req.path);
  res.sendFile(filePath);
});

app.get("/user_check", (req, res) => {
  const username = req.cookies["username"];
  // console.log("logged user is:" +username)
  res.send({"username":username});
});

// app.get("/user_check", (req, res) => {
//   const token_cookie = req.cookies("token_cookie");
//   res.send(token_checker(token_cookie));
// });

// app.get("/user_check", (req, res) => {
//   const token_cookie = req.cookies["token_cookie"];
//   res.send(token_checker(token_cookie));
// });

app.get("/update-feed", (req,res) => {
  posts = getAllPosts()
  posts.then(function(result) {
    res.json(result)
  })
});
// posts
app.post("/register", async (req, res) => {
  const name = req.body.username_reg;
  const password = req.body.password_reg;
  if (!name || !password) {
    return res.status(400).send("All fields are required!");
  }
  try {
    const user_document = await User.findOne({ name: name }); // await the database fetch
    if (user_document) {
      return res.status(400).send("Username already exists!"); // if user exists, throw this err
    }
    await add_new_user(name, password); // idk if await should be there
    res.send("User registered successfully!");
  } catch (error) {
    console.error("Error occurred:", error); // log error for debugging
    res.status(500).send("A server error has occurred: " + String(error));
  }
});

app.post("/login", async (req, res) => {
  const user_login = escapeHTML(req.body.username_login);
  const pass_login = req.body.password_login;
  const user_verification = await verify_user(user_login, pass_login);
  console.log(user_verification);
  if (
    user_verification !== "User not found!" &&
    user_verification !== "Invalid password!"
  ) {
    res
      .cookie("token_cookie", user_verification, {
        maxAge: 3600000, // one hr in ms
        httpOnly: true,
        sameSite: "strict", // no cross-site cookie viewing
      })
      .cookie("username", user_login, {
        // dont set httponly, so it is readable by the client
        maxAge: 3600000, // one hour in milliseconds
        sameSite: "strict",
      })
      .send("Login successful!\n" + "Logged in: " + user_login);
  } else {
    res.status(401).send(user_verification);
  }
});

// running the app
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.path);
    res.sendFile(filePath);
})

app.post('/make-post', bodyParser.json(), (req, res) => { 
    console.log(req.body['title'])
    title = req.body['title']
    description = req.body['description']
    token_cookie = req.cookies["username"];
    if (token_cookie) {
      add_new_post(token_cookie, title, description)
    }
    res.send("New POST Made")
 })  
 

// ...

app.post('/like', bodyParser.json(), async (req, res) => { 
  const postId = req.body.likeId;
  const username = req.cookies["username"];

  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (!post.users_liked.includes(username)) {
      post.users_liked.push(username);
      post.liked = true;
      await post.save();
      return res.send("Post liked");
    }
    return res.send("Post already liked");
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).send("A server error has occurred");
  }
});

app.post('/unlike', bodyParser.json(), async (req, res) => { 
  const postId = req.body.likeId;
  const username = req.cookies["username"];

  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const index = post.users_liked.indexOf(username);
    if (index > -1) {
      post.users_liked.splice(index, 1);
      post.liked = false;
      await post.save();
      return res.send("Post unliked");
    }
    return res.send("Post not liked by the user");
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).send("A server error has occurred");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
