///app.js
"use strict";

// 모듈
const express = require("express");
const app = express();

// 라우팅
const home = require("./src/routes/home"); //home에 있는 js파일 읽기.

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));

app.use("/", home); //use : 미들웨어 메서드

module.exports = app;