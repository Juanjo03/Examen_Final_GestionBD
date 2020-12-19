const express = require('express');
const router = express.Router();
const {MongoClient} = require("mongodb");
const dbName = 'transporte'
const uri = 'mongodb://localhost:27017/' + dbName

let db
let collection = 'empresas'

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, database) => {
    if (err) return console.log(err)
    db = database.db('transporte')
})

router.get('/', function (req, res, next) {
    db.collection(collection).find().toArray((err, result) => {
        if (err) return console.log(err)

        res.format({
            html: function () {
                res.render('empresas/index', {
                    "empresas": result
                });
            },

            json: function () {
                res.json({datos: result});
            }
        })
    })
});

router.get('/nuevo', function (req, res) {
    res.render('empresas/new', {title: 'Agregar empresa'});
});

router.put('/:codigo', function (req, res, next) {
    db.collection(collection)
        .findOneAndUpdate({codigo: req.params.codigo}, {
            $set: {
                nombre: req.body.nombre,
                nit: req.body.nit,
                encargado: req.body.encargado,
                domicilio: req.body.domicilio
            }
        }, {
            sort: {_id: -1},
            upsert: true
        }, (err, result) => {
            if (err) return console.log(err)
            res.json({datos: {mensaje: 'Empresa actualizada exitosamente.'}});
        })
});

router.delete('/:codigo', function (req, res, next) {
    db.collection(collection).findOneAndDelete({codigo: req.params.codigo}, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: {mensaje: 'Empresa borrada exitosamente.'}})
    })
});

router.get('/:codigo', function (req, res, next) {
    db.collection(collection).findOne({codigo: req.params.codigo}, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: result});
    })
});

module.exports = router;
