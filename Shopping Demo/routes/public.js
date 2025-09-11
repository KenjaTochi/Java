const express = require('express');
const router = express.Router();
const path = require("path");

router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});

router.get('/*', function(req, res, next) {
    res.sendFile(path.resolve('public/index.html')); 
});

module.exports = router;
