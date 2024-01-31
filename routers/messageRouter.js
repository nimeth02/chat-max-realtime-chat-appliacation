const express = require("express");
const { verifyAuth } = require("../middleware/auth");
const {sendMessage, allMessages } = require("../controllers/messageController");

const router = express.Router();

router.route("/").get(verifyAuth, allMessages);
router.route("/").post(verifyAuth, sendMessage);


module.exports = router;