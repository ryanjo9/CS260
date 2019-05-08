const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");

const users = require("./users.js")
const User = users.model;

const photos = require("./photos.js")
const Photo = photos.model;

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  },
  created: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String
  }
});

const Comment = mongoose.model('Comment', commentSchema);
// upload commentSchema
router.post("/", auth.verifyToken, User.verify, async (req, res) => {
  try {
    const comment = new Comment({
      user: req.user,
      photo: req.body.photo,
      text: req.body.text,
    });
    await comment.save();
    return res.send(comment);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get comments for photos
router.get("/:id", async (req, res) => {
  try {
    let comments = await Comment.find({
      photo: req.params.id
    }).sort({
      created: -1
    }).populate('user');
    return res.send(comments);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Comment,
  routes: router
}