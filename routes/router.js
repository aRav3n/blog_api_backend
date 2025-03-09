const { Router } = require("express");
const router = Router();

// const commentRouter = require("./commentRouter");
// const errorRouter = require("./errorRouter");
// const postRouter = require("./postRouter");
const userRouter = require("./userRouter");

// router.use("/comment", commentRouter);
// router.use("/post", postRouter);
router.use("/user", userRouter);
// router.use("*", errorRouter);

module.exports = router;
