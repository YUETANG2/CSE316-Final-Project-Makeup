let User = require("../models/users.js");
const bcrypt = require('bcrypt');

exports.add_new_user = async (newUserData) => {
  try {
    let email = newUserData.email;
    let userData = await User.find({ email: email });

    //console.log("hello" + userData);

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(newUserData.password, salt);
    console.log("the HASH is " + passwordHash);

    if (userData.length === 0) {
      let newUser = {
        first_name: newUserData.fname,
        last_name: newUserData.lname,
        email: newUserData.email,
        password: passwordHash,
      };

      let user = new User(newUser);
      console.log(user);
      await user.save();

      return user;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};

exports.verify_user = async (userData) => {
  try {
    let email = userData.email;
    let pw = userData.password;

    let registeredUser = await User.find({
      $and: [{ email: email }],
    });
    
    if(registeredUser != 0){
      const isCorrect = await bcrypt.compare(pw, registeredUser[0].password);
      if(isCorrect){
        return registeredUser;
      }
    }
    //console.log(registeredUser);
    return [];
  } catch (err) {
    console.error(err);
  }
};
