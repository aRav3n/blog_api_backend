const { Router } = require("express");
const router = Router();

const commentRouter = require("./commentRouter");
const postRouter = require("./postRouter");
const userRouter = require("./userRouter");

router.use("/comment", commentRouter);
router.use("/post", postRouter);
router.use("/user", userRouter);

router.use("*", (req, res) => {
  return res.status(404).json({errors: ["that resource was not found"]})
})

module.exports = router;
