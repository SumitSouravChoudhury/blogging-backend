const { Router } = require("express");

const { handleAddComment } = require("../controllers/comment");

const router = Router();

router.post("/", handleAddComment);

module.exports = router;
