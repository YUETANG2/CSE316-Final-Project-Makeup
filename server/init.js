
// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass the email and password of your Admin instance as first and second arguments
// Full command: node init.js admin@sb.edu 123

//[Script description]: Populate the following data:
/**
 * User1:
 *    first_name: Mandy
 *    last_name: Tang
 *    email: mt@sb.edu
 *    password: 123
 *    reputation: 80
 *
 * User2:
 *    first_name: Sabrina
 *    last_name: Lee
 *    email:sl@sb.edu
 *    password: 123
 *    reputation: 100
 *
 * User3:
 *    first_name: Kevin
 *    last_name: Wu
 *    email: kw@sb.edu
 *    password: 123
 *    reputation: 60
 *
 * t1:
 *   name: 'router',
 *   create_by: User1,
 *   other_users: []
 *
 * t2:
 *   name: 'node',
 *   create_by: User2,
 *   other_users: [User1, User3]
 *
 * t3:
 *   name: 'javascript'
 *   created_by: User2,
 *   other_users: []
 *
 * t4:
 *   name: 'react',
 *   created_by: User3,
 *   other_users: []
 *
 * t5:
 *   name: 'mongoDB',
 *   created_by: User3,
 *   other_users: []
 *
 *
 * Q1:
 *    title: 'What is a router?',
 *    summary: 'hello1',
 *    text: 'world1',
 *    tags: [t1, t2],
 *    answers: [a1],
 *    comments: [c1],
 *    ask_by: User1,
 *    views: 10,
 *    upvote: 2,
 *    downvote: 0
 *
 * Q2: By Sabrina Lee,
 *   title: 'How to initialize node?',
 *   summary: 'hello2',
 *   text: 'world2',
 *   tags: [t2, t3],
 *   answers: [a2],
 *   ask_by: User2,
 *   views: 12,
 *   upvote: 5,
 *   downvote: 1
 * 
 *  
 * Q3:
 *   title: 'CSE316 Final Project Specification',
 *   summary: 'hello3',
 *   text: 'world3',
 *   tags: [t2, t4, t5],
 *   answers: [a3],
 *   comments: [c3],
 *   ask_by: User3,
 *   view: 20,
 *   upvote: 1,
 *   downvote: 1
 * 
 * 
 * a1:
 *   text: 'good bye1',
 *   answer_by: User2
 *   comments: []
 *   upvote: 2,
 *   downvote: 1
 *
 * a2:
 *   text: 'good bye2',
 *   answer_by: User3
 *   comments: [c2]
 *   upvote: 4,
 *   downvote: 3
 *
 *
 * a3:
 *   text: 'good bye3',
 *   answer_by: User1,
 *   comments: []
 *   upvote: 0,
 *   downvote: 0
 *
 * c1:
 *  comment_by: User2,
 *  text: 'Hi again1',
 *  upvote: 1,
 *
 * c2:
 *  comment_by: User3,
 *  text: 'Hi again2',
 *  upvote: 2,
 *
 * c3:
 *  comment_by: User1,
 *  text: 'Hi again3',
 *  upvote: 3,
 *
 */

const userArgs = process.argv.slice(2);
if (userArgs[0] !== "admin@sb.edu") {
  console.log(
    "ERROR: You need to specify a valid email as the first argument"
  );
  return;
}

if (userArgs[1] !== "123") {
    console.log(
      "ERROR: You need to specify a valid password as the first argument"
    );
    return;
  }

let mongoose = require("mongoose");
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


let Tag = require("./models/tags");
let Answer = require("./models/answers");
let Question = require("./models/questions");
let User = require("./models/users");
let Comment = require("./models/comments");
let Session = require("./models/session");
let admin_email = userArgs[0];
let admin_pw = userArgs[1];
const bcrypt = require('bcrypt');

async function userCreate(first_name, last_name, email, password, reputation, bcrypt) {

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);

  userdatails = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: passwordHash,
    reputation: reputation,
  };

  let user = new User(userdatails);
  return await(user.save());
}

async function amdinCreate(first_name, last_name, email, password, reputation, bcrypt) {

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);

  userdetails = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: passwordHash,
    reputation: reputation,
    user_status: "ADMIN",
  };

  let user = new User(userdetails);
  return await (user.save());
}

function tagCreate(name, create_by, other_users) {
  tagdetails = {
    name: name,
    create_by: create_by,
    other_users: other_users,
  };

  let tag = new Tag(tagdetails);
  return tag.save();
}

function commentCreate(comment_by, text, upvote){
    commentdetail = {
        comment_by: comment_by, 
        text: text,
        upvote: upvote
    }

    let comment = new Comment(commentdetail);
    return comment.save(); 
}

function answerCreate(text, ans_by, comments, upvote, downvote) {
    answerdetail = {
      text: text,
      ans_by: ans_by,
      comments: comments,
      upvote: upvote,
      downvote: downvote,
    };
  
    let answer = new Answer(answerdetail);
    return answer.save();
  }

function qstnCreate(
  title,
  summary,
  text,
  tags,
  answers,
  comments,
  asked_by,
  views,
  upvote,
  downvote
) {
  qstndetail = {
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    answers: answers,
    comments: comments,
    asked_by: asked_by,
    views: views,
    upvote: upvote,
    downvote: downvote,
  };

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function sessionCreate() {
    let session = new Session();
    return session.save(); 
}

const populate = async () => {
  let u1 = await userCreate("Mandy", "Tang", "mt@sb.edu", "123", 80, bcrypt);
  let u2 = await userCreate("Sabrina", "Lee", "sl@sb.edu", "123", 100, bcrypt);
  let u3 = await userCreate("Kevin", "Wu", "kw@sb.edu", "123", 60, bcrypt);
  let Admin = await amdinCreate("Stony", "Brook", admin_email, admin_pw, 200, bcrypt);

  let t1 = await tagCreate("router", u1, []);
  let t2 = await tagCreate("node", u2, [u1, u3]);
  let t3 = await tagCreate("javascript", u2, []);
  let t4 = await tagCreate("react", u3, []);
  let t5 = await tagCreate("mongoDB", u3, []);

  let c1 = await commentCreate(u2, 'Hi again1', 1); 
  let c2 = await commentCreate(u3, 'Hi again2', 2); 
  let c3 = await commentCreate(u1, 'Hi again3', 3); 
  
  let a1 = await answerCreate('good bye1', u2, [], 2, 1); 
  let a2 = await answerCreate('good bye2', u3, [c2], 4, 3); 
  let a3 = await answerCreate('good bye3', u1, [], 0, 0); 

  let q1 = await qstnCreate('What is a router?', 'hello1', 'world1', [t1, t2], [a1], [c1], u1, 10, 2, 0);
  let q2 = await qstnCreate('How to initialize node?','hello2', 'world2', [t2, t3], [a2], [], u2, 12, 5, 1);
  let q3 = await qstnCreate('CSE316 Final Project Specification', 'hello3', 'world3', [t2, t4, t5], [a3], [c3], u3, 20, 1, 1);

  let session = await sessionCreate(); 
  
  if (db) db.close();
  console.log("done");
};

populate().catch((err) => {
  console.log("ERROR: " + err);
  if (db) db.close();
});

console.log("processing ...");
