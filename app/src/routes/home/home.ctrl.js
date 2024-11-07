//home.ctrl.js
"use strict";
const hello = (req, res) => {
 res.render("home/index");
};

module.exports = {
 hello
}