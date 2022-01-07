var express = require("express");
const { login, signup, validateToken } = require("../controllers/users");
const { isAuth } = require("../controllers/isAuth");
var router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/validateToken", isAuth, validateToken);

module.exports = router;
