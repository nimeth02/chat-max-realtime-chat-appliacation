const express = require("express");
const {registerUser,  authUser,  allUsers,} = require("../controllers/userController.js");
const { verifyAuth } = require("../middleware/auth.js")

const router = express.Router();

router.route("/").post(registerUser).get(verifyAuth,allUsers);
router.post("/login", authUser);

module.exports = router;