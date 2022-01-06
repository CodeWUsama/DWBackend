var express = require('express');
const { isAuth } = require('../controllers/isAuth');
const { getWallet, postWallet } = require('../controllers/wallet');
var router = express.Router();

router.get('/', isAuth, getWallet);
router.post("/", isAuth, postWallet);

module.exports = router;
