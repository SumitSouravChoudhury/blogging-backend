const { Router } = require("express");

const {
  handleAddPost,
  handleGetPost,
  handleUpdatePostById,
  handleDeletePostById,
} = require("../controllers/post");

const router = Router();

router.route("/").post(handleAddPost).get(handleGetPost);

router
  .route("/:postId")
  .patch(handleUpdatePostById)
  .delete(handleDeletePostById);

module.exports = router;
