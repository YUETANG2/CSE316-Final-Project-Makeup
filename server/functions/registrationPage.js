let User = require("../models/users.js");

exports.add_new_user = async (newUserData) => {
  try {
    let email = newUserData.email;
    let userData = await User.find({ email: email });

    //console.log("hello" + userData);

    if (userData.length === 0) {
      let newUser = {
        first_name: newUserData.fname,
        last_name: newUserData.lname,
        email: newUserData.email,
        password: newUserData.password,
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
      $and: [{ email: email }, { password: pw }],
    });

    //console.log(registeredUser);
    return registeredUser;
  } catch (err) {
    console.error(err);
  }
};
