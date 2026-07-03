const { Router } = require("express");

const {
  handleGetUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");
const { accessTo } = require("../middlewares/accessTo");
const { upload } = require("../utils/multer");

const router = Router();

router.get("/", accessTo("admin"), handleGetUsers);

router
  .route("/:userId")
  .get(handleGetUserById)
  .patch(upload.single("photo"), handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
