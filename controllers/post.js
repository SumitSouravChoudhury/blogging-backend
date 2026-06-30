const Post = require("../models/post");

const handleAddPost = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Post title is required" });
  if (!description)
    return res
      .status(400)
      .json({ success: false, message: "Post description is required" });

  try {
    const post = await Post.create({
      title,
      description,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: post,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetPost = async (req, res, next) => {
  const { search } = req.query;

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit)) || 10);
  const skip = (page - 1) * limit;

  const filter = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  try {
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("user", "-password")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "-password",
          },
        })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      posts: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasPrev: page > 1,
        hasNext: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdatePostById = async (req, res, next) => {
  const { postId } = req.params;
  const { title, description } = req.body;

  if (!title && !description)
    return res.status(400).json({
      success: false,
      message: "Atleast one field (title, description) is required",
    });

  try {
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;

    const post = await Post.findByIdAndUpdate(postId, updates, {
      new: true,
      runValidators: true,
    });

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post id not found" });

    return res
      .status(200)
      .json({ success: true, message: "Post updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleAddPost, handleGetPost, handleUpdatePostById };
