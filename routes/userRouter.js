const { Router } = require("express");
const controller = require("../controllers/controller").user;
const router = Router();

router.post("/", controller.create);

module.exports = router;
