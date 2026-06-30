const { Router } = require("express");

const {
  handleGetUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");
const { accessTo } = require("../middlewares/accessTo");

const router = Router();

router.get("/", accessTo("admin"), handleGetUsers);

router
  .route("/:userId")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
