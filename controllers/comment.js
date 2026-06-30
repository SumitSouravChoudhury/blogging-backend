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

const handleGetComment = async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  try {
    const [comments, total] = await Promise.all([
      Comment.find({ user: req.user._id })
        .populate("user", "-password")
        .populate({
          path: "post",
          select: "-comments",
        }),
      Comment.countDocuments({ user: req.user._id }),
    ]);

    return res.status(200).json({
      success: true,
      comments: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasPrev: page > 1,
        totalPages: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCommentById = async (req, res, next) => {
  const { comment } = req.body;
  const { commentId } = req.params;

  if (!comment)
    return res
      .status(400)
      .json({ success: false, message: "Comment is required" });

  try {
    const postComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        comment: comment,
      },
      { new: true, runValidators: true },
    );

    if (!postComment)
      return res
        .status(404)
        .json({ success: false, message: "Comment id not found" });

    return res
      .status(200)
      .json({ success: true, message: "Commented updated successfully" });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCommentById = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const postComment = await Comment.findByIdAndDelete(commentId);

    if (!postComment)
      return res
        .status(404)
        .json({ success: false, message: "Comment id not found" });

    return res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleAddComment,
  handleGetComment,
  handleUpdateCommentById,
  handleDeleteCommentById,
};
