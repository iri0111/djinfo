//home.ctrl.js -> board.js
"use strict";

const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const db = require('db');

//mysql과 연결확인
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err.stack);
    return;
  }
  console.log('MySQL 연결 성공');
});

//로그인 시 글쓰기 권한 허용(로그인 여부 확인 미들웨어)
const isLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(403).send('로그인 후 작성이 가능합니다.');
  }
  next();
};

//글쓰기 페이지 렌더링
router.get('/write', isLoggedIn, (req, res) => {
  res.render('write'); //write.ejs 렌더링
});

//게시글 저장(post 요청)
router.post('/submit', (req, res) => {
  const { title, contents } = req.body;

  //입력값 확인
  if (!title || !contents) {
    return res.status(400).send('제목과 내용을 모두 입력하세요.');
  }
  //MySQL 쿼리 작성
  const query = 'INSERT INTO posts (title, detail) VALUES (?, ?)';
  db.query(query, [title, contents], (err, result) => {
    if (err) {
      console.error('게시글 저장 오류:', err);
      return res.status(500).send('서버 오류로 인해 게시글을 작성하는 데 실패했습니다.');
    }
    //게시글 저장 성공 시 alert
    res.send('게시글이 작성되었습니다.');
  });
});

module.exports = router;