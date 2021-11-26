"use strict";
const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authentication-controller");

router.route("/login").post(authenticationController.login);
router.route("/register").post(authenticationController.register);
router.route("/token/validate").post(authenticationController.validateToken);

module.exports = router;
