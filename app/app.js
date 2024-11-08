///app.js
"use strict";

// 모듈
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const boardRoutes = require('./routes/board');
const session = require('express-session');

// 라우팅
const home = require("./src/routes/home"); //home에 있는 js파일 읽기.


// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));

//세션
app.use(session({
  secret: '',  //채워야 함   
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use('/board', boardRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", home); //use : 미들웨어 메서드

module.exports = app;