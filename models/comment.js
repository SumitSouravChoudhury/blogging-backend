const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
  },
  { timestamps: true },
);

const Comment = model("comment", commentSchema);

module.exports = Comment;
