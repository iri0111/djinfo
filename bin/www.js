// www.js
// 서버 띄우기
"use strict";

const app = require("../app");

const PORT = 3000;

app.listen(PORT, () => {
 console.log("서버가동.");
});