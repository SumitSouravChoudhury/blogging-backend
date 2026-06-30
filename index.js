require("./config/env");

const express = require("express");
const mongoose = require("mongoose");

const { errorHandler } = require("./middlewares/errorHandler");
const { authenticate } = require("./middlewares/authenticate");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const commentRoute = require("./routes/comment");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Mongodb connected successfully!"))
  .catch((err) => console.log("error:", err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/user", authenticate, userRoute);
app.use("/api/post", authenticate, postRoute);
app.use("/api/comment", authenticate, commentRoute);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server started at port: ${process.env.PORT}`),
);
