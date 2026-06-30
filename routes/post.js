const { Router } = require("express");

const {
  handleAddPost,
  handleGetPost,
  handleUpdatePostById,
} = require("../controllers/post");

const router = Router();

router.route("/").post(handleAddPost).get(handleGetPost);

router.route("/:postId").patch(handleUpdatePostById);

module.exports = router;
