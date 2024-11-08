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

//게시글 수정 페이지 렌더링
router.get('/edit/:id', isLoggedIn, (req, res) => {
  const postId = req.params.id;

  //MySQL에서 해당 게시글 찾기(쿼리)
  const query = 'SELECT * FROM board WHERE id = ?';
  db.query(query, [boardid], (err, result) => {
    if (err) {
      console.err('게시글 조회 오류:', err);
      return res.status(500).send('게시글을 불러오는 데 실패했습니다.');
    }
    if (result.length === 0) {
      return res.status(404).send('해당 게시글을 찾을 수 없습니다.');
    }

    //수정할 게시글 폼에 전달
    res.render('edit', { post: result[0] });
  });
});

//게시글 수정하기(post 요청)
router.post('/update/:id', isLoggedIn, (req, res) => {
  const postId = req.params.id;
  const { title, contents } = req.body;

  //입력값 확인 : 작성하기와 동일코드->묶어서 가리키는 방식으로 수정하면 좋을 듯.
  if (!title || !contents) {
    return res.status(400).send('제목과 내용을 모두 입력하세요.');
  }

  //MySQL 쿼리 작성
  const query = 'UPDATE board SET title = ?, contents = ? WHERE id = ?';
  db.query(query, [title, contents, id], (err, result) => {
    if (err) {
      console.error('게시글 수정 오류:', err);
      return res.status(500).send('게시글을 수정하는 데 실패했습니다.');
    }
    //게시글 수정 성공 시 목록 페이지로 redirect
    res.redirect('/board/myPosts');
  });
});


//게시글 삭제
router.get('/delete/:id', isLoggedIn, (req, res) => {
  const postId = req.params.id;

  //MySQL 쿼리 작성
  const query = 'DELETE FROM board WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('게시글 삭제 오류:', err);
      return res.status(500).send('게시글을 삭제하는 데 실패했습니다.');
    }
    //게시글 삭제 성공 시 게시글 목록 페이지로 redirect
    res.redirect('/board/myPosts');
  });
});

//사용자의 게시글 목록 렌더링
router.get('myPosts', isLoggedIn, (req, res) => {
  const userId = req.session.user; //세션에서 사용자 정보 확인
  //사용자의 게시글 목록 불러오기(쿼리)
  const query = 'SELECT * FROM board WHERE user_id = ?';
  db.query(query, [userid], (err, results) => {
    if (err) {
      console.error('게시글 목록 조회 오류:', err);
      return res.status(500).send('게시글 목록을 불러오는 데 실패했습니다.');
    }

    //게시글 목록 myPosts 페이지로 전달
    res.render('myPosts', { posts: results });
  });
});

module.exports = router;