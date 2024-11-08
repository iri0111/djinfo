"use strict"; //이크마스크립트 문법

const express = require("express");
const router = express.Router();

const ctrl = require("./board");

router.get("/", ctrl.hello);
module.exports = router;






