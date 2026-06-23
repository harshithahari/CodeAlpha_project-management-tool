const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
