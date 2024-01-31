const express = require("express");
const { verifyAuth } = require("../middleware/auth");
const { accessChat, fetchChats ,createGroupChat,renameGroup,removeFromGroup,addToGroup} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(verifyAuth, accessChat);
router.route("/").get(verifyAuth, fetchChats);
router.route("/group").post(verifyAuth, createGroupChat);
router.route("/rename").put(verifyAuth, renameGroup);
router.route("/removeuser").put(verifyAuth, removeFromGroup);
router.route("/adduser").put(verifyAuth, addToGroup);

module.exports = router;