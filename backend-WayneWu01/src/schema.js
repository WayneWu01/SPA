const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String,
  auth: Object
})
var profileSchema = new mongoose.Schema({
  username: String,
  headline: String,
  email: String,
  zipcode: String,
  phone: String,
  dob: String,
  avatar: String,
  following: [ String ]
})
var commentSchema = new mongoose.Schema({
  commentId: Number,
  name: String,
  text: String,
  img: String
})
var articleSchema = new mongoose.Schema({
  id: Number,
  username: String,
  text: String,
  img: String,
  avatar: String,
  date: Date,
  comments: [ commentSchema ]
})
exports.User = mongoose.model('users', userSchema)
exports.Profile = mongoose.model('profiles', profileSchema)
exports.Article = mongoose.model('articles', articleSchema)
exports.Comment = mongoose.model('comments', commentSchema)

