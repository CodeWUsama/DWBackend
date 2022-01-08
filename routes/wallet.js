var express = require("express");
const { isAuth } = require("../controllers/isAuth");
const { getWallet, postWallet, getHistory } = require("../controllers/wallet");
var router = express.Router();

router.get("/", isAuth, getWallet);
router.post("/", isAuth, postWallet);
router.get("/history", isAuth, getHistory);

module.exports = router;
