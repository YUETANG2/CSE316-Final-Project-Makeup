//const jwt = require("jsonwebtoken");
let Session = require("../models/session.js");
let User = require("../models/users.js");
const { ObjectId } = require("mongodb");

/******* General User Information Finding *******/
let is_login = async () => {
  let session_history = await Session.find({});

  //console.log(session_history[0].user);

  if (session_history[0].user === "Guest") {
    return null;
  } else {
    return session_history[0].user;
  }
};

let get_login_user = async (userID) => {
  let user = await User.findById(userID);
  return user; //return the User Object
};

exports.get_login_user_reputation = async () => {
  let userId = await is_login();
  let user = await get_login_user(userId);
  //console.log(user.reputation);
  return user.reputation.toString();
};

exports.get_login_user_reputation_2 = async (userId) => {
  let user = await get_login_user(userId);
  return user.reputation.toString();
};



exports.get_username = async (userId) => {
  console.log("UserId: " + userId);
  let user = await get_login_user(userId);
  //console.log(user.first_name);
  //console.log(user.last_name);

  return user.first_name + " " + user.last_name;
};
//???

exports.get_login_user_date_joined = async (userId) => {
  let user = await get_login_user(userId);
  //console.log(user.join_date);

  return user.join_date;
};

/*********** General Authentication For Login/Signup ********/
exports.is_login_jwt = async(token) => {
  try{
    const userId = jwt.verify(token, "hello");
    let user = await User.find({_id: new ObjectId(userId)});
    if(user.length != 0){
      return user[0]; //return user object 
    }else{
      return null; 
    }
  }catch (err){
    console.log(err); 
  }
}

exports.is_login = async () => {
  let session_history = await Session.find({});
  //console.log(session_history[0].user);

  if (session_history[0].user === "Guest") {
    return null; //return null if user is not login (user is in guest mode)
  } else {
    return session_history[0].user; //return a userID from the session object if it's login
  }
};

exports.get_login_user = async (userID) => {
  let user = await User.findById(userID);
  return user;
};

exports.get_login_user_2 = async () => {
  let userID = await is_login();
  let user = await User.findById(userID);
  return user; //return userData
};

exports.update_login_status = async (newStatus) => {
  let session_history = await Session.find({});
  try {
    session_history[0].user = newStatus;
    await session_history[0].save();
    //console.log(session_history[0]);
    return true;
  } catch (err) {
    console.err(err);
    return false;
  }
};
