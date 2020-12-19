const express = require('express');
const router = express.Router();
const {MongoClient} = require("mongodb");
const dbName = 'transporte'
const uri = 'mongodb://localhost:27017/' + dbName

const client = new MongoClient(uri);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
