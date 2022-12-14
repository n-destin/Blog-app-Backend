const { MongoNotConnectedError, ConnectionClosedEvent } = require("mongodb");
const { findByIdAndUpdate } = require("../../model/post/Post");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
//create

const createPostCtrl = async (req, res, next) => {
  // get the user inputs
  const {title, description, category} = req.body;
  try {
    // get the user
    if( title == null || description == null || category == null || req.file  == null){
      return  next(appErr("all fields are required"))
    }
    const userID = await req.session.loginUser
    const person = await User.findById(userID).populate('posts') 
    if(person != null){
      const posted = await Post.create({
        title: title,
        description: description,
        category: category,
        image: req.file.path,
        user: person._id
      })
      person.posts.push(posted._id)
        res.json({
          status: "success",
          user: person,
        });

        // resave the person
        person.save()
    } else{
      res.send({
        msg: "Failed",
        exp: "None found"
      })
    }
    
  } catch (error) {
    res.json(error.stack);
  }
};

//all
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const postings  = await Post.find()
    console.log(postings)
    res.json({
      status: "Success",
      user: postings
    });
  } catch (error) {
    res.json(error);
  }
};

//details
const fetchPostCtrl = async (req, res, next) => {
  // get the id from the params
  try {
    if(req.params.id !=  null){
      const id = req.params.id
      console.log(id)
      const posting = await Post.findOne({_id: id})
      if(posting){
        console.log("Post found")
        res.send({
          msg: "Success",
          post: posting
        })
      } else{
        res.send({
          msg: "Failed",
          post: "No post found"
        })
      }
    } else{
      console.log("Here")
      return next(appErr("There is no such post"))
    }
  } catch (error) {
    console.log(error)
    res.json(error);
  }
};

//deleting a certain post
const deletePostCtrl = async (req, res, next) => {
  try {
    // id for the user deleting a post
    // console.log("Starting heres")
    const postID  = req.params.id
    // console.log(postID)
    const posting = await Post.findOne({_id: postID})
    // console.log(posting)
    if(posting != null){
      console.log("The post is not null")
        if(posting.user != req.session.loginUser){
          console.log("THe post does not belong to the user")
          return next(appErr("You are not allowed to delete this post"))
        } else{
          console.log("Jere")
            // const user  = User.findOne({_id: req.session.loginUser})
           await Post.findByIdAndDelete(req.params.id )
            // console.log(something)
            res.send({
              msg: "Success deleting a post",
              deleted: posting 
            })
        } 
    } else{
      console.log("The posst is null")
      res.send({
        msg:"Failure"
      })
    }
  } catch (error) {
    res.json(error);
  }
};

//updates
const updatepostCtrl = async (req, res, next) => {
  const{title, description, category} = req.body
  try {
    // const userID = req.session.loginUser
    const postID = req.params.id
    const posting = await Post.findOne({_id: postID})
    // console.log(posting)
    // console.log(posting.user, req.session.loginUser)
    // console.log(posting.user)
    if(posting.user.toString() !== req.session.loginUser.toString()){
      console.log("Got here");
      return next(appErr("Login first"))
    } else{
      // console.log("Approach")
      const updated  = await Post.findOneAndUpdate({_id: req.params.id}, {
        title: title,
        description: description,
        category: category,
        image: req.file.path
      },
      {
        new: true
      })

      // console.log("Approach")
      res.send({
        msg: "Sucess updating post",
        updatedpost: updated
      })
    }
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatepostCtrl,
};
