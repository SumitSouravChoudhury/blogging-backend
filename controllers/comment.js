const Comment = require("../models/comment");
const Post = require("../models/post");

const handleAddComment = async (req, res, next) => {
  const { comment, postId } = req.body;

  if (!comment)
    return res
      .status(400)
      .json({ success: false, message: "Comment is required" });
  if (!postId)
    return res
      .status(400)
      .json({ success: false, message: "Post id is required" });

  try {
    const post = await Post.findOne({ _id: postId });

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const postComment = await Comment.create({
      comment: comment,
      user: req.user._id,
      post: postId,
    });

    post.comments.push(postComment._id);
    await post.save();

    return res.status(201).json({ success: true, comment: postComment });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleAddComment };
