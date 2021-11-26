const express = require("express");
const router = express.Router();
const user = require("./user-routes");
const conversation = require("./conversation-routes");
const message = require("./message-routes");
const authenticate = require("./authenticate-routes");
const verify = require("./verify-routes");

// Route all endpoints
router.use("/user", verify, user);
router.use("/authenticate", authenticate);
router.use("/conversation", verify, conversation);
router.use("/message", verify, message);

module.exports = router;
