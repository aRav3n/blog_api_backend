const { Router } = require("express");
const controller = require("../controllers/controller").user;
const router = Router();

router.get("/", controller.readFromEmail);
router.post("/", controller.create);
router.put("/", controller.updateInfo);
router.put("/password", controller.updatePassword);
router.delete("/", controller.deleteSingle);

module.exports = router;
