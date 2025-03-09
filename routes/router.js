const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.get);

router.use("*", controller.errorGet);

module.exports = router;
