const { Router } = require("express");

const {
  handleAddComment,
  handleGetComment,
  handleUpdateCommentById,
  handleDeleteCommentById,
} = require("../controllers/comment");

const router = Router();

router.route("/").post(handleAddComment).get(handleGetComment);

router
  .route("/:commentId")
  .patch(handleUpdateCommentById)
  .delete(handleDeleteCommentById);

module.exports = router;
