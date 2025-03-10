const { Router } = require("express");
const controller = require("../controllers/controller").comment;
const router = Router();


router.post("/", controller.create);


module.exports = router;
