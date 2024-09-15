import mongoose from 'mongoose';

const commentSchema = mognoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  commentDate: { type: Date, default: Date.now },
  commentContent: { type: String, required: true },
  commentAttachement: { type: String }
  });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
