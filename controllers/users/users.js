
const bcrypt = require("bcryptjs");
const session = require("express-session");
// const storage = require("../../config/coudinary");
const { emit, findByIdAndUpdate, findById } = require("../../model/user/User");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
// const bcrypt  = require("bcryptjs")

const registerCtrl = async (req, res, next) => {

  const {fullname, email, password} = req.body;
  try {
    //checing if the user already exist
    const foundUser  = await User.findOne({email})
    if(foundUser){
      return next(appErr("User Already exist"));
      // res.json({
      //   status: "Failed",
      //   msg: "Email already exist"
      // })
    } 
// hashing the password
    const salt  = await bcrypt.genSalt(10);
    const hashedpassword  = await bcrypt.hash(password, salt)
    const person = await User.create({
      fullname,
      email, 
      password: hashedpassword
    })
    res.json({
      msg:"user registered",
      data: person
    })
    console.log(person, hashedpassword)
  } catch (error) {
    console.log(error.stack)
  }
};

//login
const loginCtrl = async (req, res) => {
  const {fullname, email, password} = req.body;
  try {
    // looking for the person
    const userFound = await User.findOne({email})
    const validepassword = await bcrypt.compare(password, userFound.password)
    if(userFound == null){
      res.send({
        status:"Failed",
        msg: "Invalid login credentials"
      })
      // console.log(userFound)
    } else if(validepassword == false){
      res.send({
        status: "Failed",
        msg:"Invalid login credentials"
      })
      // console.log("Here at password")

    } else {
      // console.log(session)
      // save the user into session
      req.session.loginUser = userFound._id
      console.log(req.session)
      res.send({
        status: "successes",
        user: userFound
      });
      // console.log("Loggin in")
      // console.log("Here at sucess");
    }
  } catch (error) {
    res.json(error);
  }
};

//details
const userDetailsCtrl = async (req, res) => {
  try {
    const userId = req.params.id;
    const person  = await User.findOne({_id: userId})
    // console.log(person.fullname)
    res.send({
      status: "sucess",
      user: person
    });
  } catch (error) {
    res.json(error);
  }
};
//profile
const profileCtrl = async (req, res) => {
  try {
    const id  = req.session.loginUser
    const person  = await User.findOne({_id: id})
    res.json({
      fullname: person.fullname,
      email: person.email
    });
  } catch (error) {
    // console.log("something went wrong")
    res.json(error.stack);
  }
};

//upload profile photo
const uploadProfilePhotoCtrl = async (req, res, next) => {
  // save the image into the database
  try {
    const userID = await req.session.loginUser
    console.log(userID)
    const userFound = await User.findOne({_id: userID})
    if(userFound == null){
      return next(appErr("You are not logged in!"))
    } else{
        await User.findByIdAndUpdate(userID, {
          profileImage: req.file.path,
        }, {
          new: true
        })
          res.json({
            status: "success",
            user: "User profile image uploaded successfully",
          });
    }
  } catch (error) {
    console.log(error.stack)
    res.json(error);
  }
};

//upload cover image

const uploadCoverImgCtrl = async (req, res, next) => {
  try {
    const userID = await req.session.loginUser
    console.log(userID)
    const userFound = await User.findOne({_id: userID})
    if(userFound == null){
      return next(appErr("You are not logged in!"))
    } else{
        await User.findByIdAndUpdate(userID, {
          coverImage: req.file.path,
        }, {
          new: true
        })
          res.json({
            status: "success",
            user: "User cover image uploaded successfully",
          });
    }
  } catch (error) {
    console.log(error.stack)
    res.json(error);
  }
};

//update password
const updatePasswordCtrl = async (req, res) => {
  try {
    const password = req.body.password
    if(password){
    const salt  = await bcrypt.genSalt(10)
    const hashedpass = await bcrypt.hash(password, salt)
    const id  = req.params.id
    // console.log(hashedpass)
    // console.log("Here")
    const someone  = await User.findOne({_id: id})
    console.log(someone)
    // console.log(user)
    await User.findByIdAndUpdate(id, {
      password: hashedpass
    }, {
      new: true,
    })
    res.send({
      status: "success",
      user: someone
    });
    } else{
      console.log("No password given")
    }
  } catch (error) {
    res.json(error);
  }
};

//update user
const updateUserCtrl = async (req, res, next) => {
  const {fullname, email} = req.body;
  // console.log(fullname)
  // checking if the email is taken, given that the user provides the email
  try {
    if(email){
      // console.log("In somewhere else")
      const isTaken = await User.findOne({email: req.email})
      //console.log(isTaken)
      if(isTaken){
        next(appErr("Email is already taken"))
        res.send({
          msg:"The email is already taken taken"
        })
      }
    } 
      //console.log("Here")
      console.log(req.params.id)
      const user  = await User.findOneAndUpdate({_id: req.params.id}, {
        email: email,
        fullname: fullname
      })
      res.send({
        status: "Success",
        new: user
    })
  } catch (error) {
    res.json(error);
  }
};

//logout
const logoutCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User logout",
    });
  } catch (error) {
    res.json(error);
  }
};

const HomeCtrl  = async (req, res) =>{
  try {
    res.render("login_register")
  } catch (error) {
    console.log(error.stackcs)
  }
}

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
  HomeCtrl
};
