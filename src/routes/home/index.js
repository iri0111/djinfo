"use strict"; //이크마스크립트 문법준수

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.hello);

module.exports = router;






