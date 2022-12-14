//create
const Comment  = require("../../model/comment/Comment")
const User  = require("../../model/user/User")
const Post  = require("../../model/post/Post");
const appErr = require("../../utils/appErr");
const createCommentCtrl = async (req, res) => {
  const {message} = req.body;
  // const postID = req.params.id
  // const commentID = req.id
  // console.log(userID, commentID)
  try {
    const comment  = await Comment.create({
      user: req.session.loginUser,
      message: message
    })
    
    const post  = await Post.findOne({_id: req.session.loginUser}).populate('comments')
   
    
    const user  = await User.findOne({_id: req.session.loginUser}).populate('comments')
    console.log(user.comments)

    // push the commnet ID to the 
    post.comments.push(comment._id)
    user.comments.push(comment._id)
    console.log("HEre")
    // resave everything
    user.save()
    post.save()

    // prevent the default thingee 

    await user.save({validateBeforeSave: false})
    await post.save({validateBeforeSave: false})
    // console.log("Here")
    res.send({
      status: "success",
      user: comment
    });
    // console.log("Here")
  } catch (error) {
    res.json(error);
  }
};

//single
const commentDetailsCtrl = async (req, res) => {
  const postID  = req.body
  try {
    const post = await Post.findOne({_id: postID})
    res.json({
      status: "success",
      user: post,
    });
  } catch (error) {
    res.json(error.stack);
  }
};

//deleteb
const deleteCommentCtrl = async (req, res, next) => {
  
  try {
  const commentID = req.params.id
  const userID = req.session.loginUser
  const comment = await Comment.findOne({_id: commentID})
  if(comment.user.toString() !== req.session.loginUser){
    return next(appErr("Login first"))
  } else{
    const deletedCom = Comment.findOneAndDelete({_id: req.params.id})
    res.json({
      status: "success",
      user: deletedCom,
    });
  }
    
  } catch (error) {
    res.json(error);
  }
};

//Update
const upddateCommentCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "comment updated",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  upddateCommentCtrl,
};
