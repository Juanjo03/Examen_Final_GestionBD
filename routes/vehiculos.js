const express = require('express');
const router = express.Router();
const {MongoClient} = require("mongodb");
const dbName = 'transporte'
const uri = 'mongodb://localhost:27017/' + dbName

let db
let collection = 'vehiculos'

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, database) => {
    if (err) return console.log(err)
    db = database.db('transporte')
})

router.get('/', function (req, res, next) {
    db.collection(collection).find().toArray((err, result) => {
        if (err) return console.log(err)

        res.format({
            html: function () {
                res.render('vehiculos/index', {
                    "vehiculos": result
                });
            },

            json: function () {
                res.json({datos: result});
            }
        })
    })
});

router.get('/nuevo', function (req, res) {
    res.render('vehiculos/new', {title: 'Agregar vehículo'});
});

router.post('/', function (req, res, next) {
    db.collection(collection).save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: result['ops'][0]});
    })
});

router.put('/:placa', function (req, res, next) {
    db.collection(collection)
        .findOneAndUpdate({placa: req.params.placa}, {
            $set: {
                marca: req.body.marca,
                modelo: req.body.modelo,
                tipo: req.body.tipo,
                capacidad: req.body.capacidad
            }
        }, {
            sort: {_id: -1},
            upsert: true
        }, (err, result) => {
            if (err) return console.log(err)
            res.json({datos: {mensaje: 'Vehículo actualizado exitosamente.'}});
        })
});

router.delete('/:placa', function (req, res, next) {
    db.collection(collection).findOneAndDelete({placa: req.params.placa}, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: {mensaje: 'Vehículo borrado exitosamente.'}})
    })
});

router.get('/:placa', function (req, res, next) {
    db.collection(collection).findOne({placa: req.params.placa}, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: result});
    })
});

module.exports = router;
