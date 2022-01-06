var express = require("express");
const { login, signup } = require("../controllers/users");
var router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

module.exports = router;