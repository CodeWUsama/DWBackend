var express = require("express");
const { isAuth } = require("../controllers/isAuth");
const {
  getWallet,
  postWallet,
  getHistory,
  deleteRecord,
  updateRecord,
} = require("../controllers/wallet");
var router = express.Router();

router.get("/", isAuth, getWallet);
router.post("/", isAuth, postWallet);
router.get("/history", isAuth, getHistory);
router.delete("/:id", isAuth, deleteRecord);
router.put("/:id", isAuth, updateRecord);

module.exports = router;
