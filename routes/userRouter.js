const { Router } = require("express");
const controller = require("../controllers/controller").user;
const verifyLoggedIn = require("../controllers/securityController").verify;
const router = Router();

router.get("/", (req, res) => {
  return res.status(200).json({messages: ["server is awake"]})
});
router.post("/login", controller.readFromEmail);
router.post("/signup", controller.create);
router.put("/", verifyLoggedIn, controller.updateInfo);
router.put("/password", verifyLoggedIn, controller.updatePassword);
router.delete("/", verifyLoggedIn, controller.deleteSingle);

module.exports = router;
