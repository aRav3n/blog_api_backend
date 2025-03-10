const { Router } = require("express");
const controller = require("../controllers/controller").post;
const router = Router();

router.get("/", controller.readRecent);
router.get("/:postId", controller.readSingle);
router.post("/", controller.create);
router.put("/:postId", controller.update);
router.delete("/:postId", controller.deleteSingle);

module.exports = router;
