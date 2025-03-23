const { Router } = require("express");
const controller = require("../controllers/controller").post;
const verifyLoggedIn = require("../controllers/securityController").verify;
const router = Router();

router.get("/", controller.readRecent);
router.get("/all", controller.readAll);
router.get("/:postId", controller.readSingle);
router.post("/", verifyLoggedIn, controller.create);
router.put("/:postId", verifyLoggedIn, controller.update);
router.delete("/:postId", verifyLoggedIn, controller.deleteSingle);

module.exports = router;
