const express = require("express");
const {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  upddateCommentCtrl,
} = require("../../controllers/comments/comments");
const protected = require("../../middlewares/LogginInMiddleware")
const commentRoutes = express.Router();

//POST/api/v1/comments
commentRoutes.post("/:id", protected, createCommentCtrl);

//GET/api/v1/comments/:id
//DELETE/api/v1/comments/:id
commentRoutes.delete("/:id", deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRoutes.put("/:id", upddateCommentCtrl);

module.exports = commentRoutes;
