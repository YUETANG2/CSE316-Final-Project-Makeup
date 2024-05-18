// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require("express");
//const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = 8000;
const userRouter = require("./routes/Auth.js");
const qstnRouter = require("./routes/Questions");
const userProfileRouter = require("./routes/UserProfile.js");
const answersRouter = require("./routes/Answers.js");
const tagRouter = require("./routes/Tags.js");
const commentRouter = require("./routes/Comments.js");

const day = 1000 * 60 * 60 * 24;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());

app.use(
  session({
    name: "Authentication",
    secret: "I dont now know what this is",
    cookie: { maxAge: day, sameSite: "none", secure: false },
    resave: false, //checked
    saveUninitialized: false, //checked
  })
);

app.use("/user", userRouter);
app.use("/question", qstnRouter);
app.use("/profile", userProfileRouter);
app.use("/tag", tagRouter);
app.use("/answersPage", answersRouter);
app.use("/comment", commentRouter);

let MainPage = require("./functions/mainPage.js");
let AskQstnPage = require("./functions/questions.js");
let PostAnsPage = require("./functions/postAnsPage.js");
let AnsPage = require("./functions/answersPage.js");
let TagsPage = require("./functions/tagsPage.js");

let mongoose = require("mongoose");
let mongoDB = "mongodb://127.0.0.1/fake_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", function () {
  console.log("Connected to database");
});

app.get("/getTagById", function (req, res) {
  let id = req.query.id;
  console.log("This is the id: " + id);
  MainPage.get_tag_by_id(id, res);
});

app.get("/getAnswersPageData", function (req, res) {
  let qid = req.query.id;
  AnsPage.get_answers_page_data(qid, res);
});

app.get("/getAnswersPageQstn", function (req, res) {
  console.log("inside get ans qstn");
  let qid = req.query.id;
  AnsPage.get_answers_page_qstn(qid, res);
});

app.put("/incrementViews", function (req, res) {
  let qid = req.query.id;
  //qid.views++;
  AnsPage.increment_views(qid, res);
});

app.post("/addNewAnswer", async function (req, res) {
  console.log("two");
  let newAnswerData = req.body;
  let user = await SessionCheck.get_login_user_2();
  PostAnsPage.add_new_ans(newAnswerData, user, res);
});

app.get("/getAllTags", function (req, res) {
  TagsPage.get_all_tags(res);
});

app.get("/getTagQstnCount", function (req, res) {
  TagsPage.get_tag_num_of_qstns(tag, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("SIGINT", async () => {
  try {
    await mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
  } catch (err) {
    console.error(err);
  }
});
