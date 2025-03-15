const { Router } = require("express");
const controller = require("../controllers/controller").comment;
const verifyLoggedIn = require("../controllers/securityController").verify;
const router = Router();

router.get("/:postId", controller.readRecentForPost);
router.post("/:postId", verifyLoggedIn, controller.create);
router.put("/:commentId", verifyLoggedIn, controller.update);
router.delete("/:commentId", verifyLoggedIn, controller.deleteSingle);

module.exports = router;
