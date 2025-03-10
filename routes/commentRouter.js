const { Router } = require("express");
const controller = require("../controllers/controller").comment;
const router = Router();

router.get("/:postId", controller.readRecentForPost);
router.post("/:postId", controller.create);
router.put("/:commentId", controller.update);
router.delete("/:commentId", controller.deleteSingle);

module.exports = router;
