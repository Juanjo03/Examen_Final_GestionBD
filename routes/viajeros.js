const express = require('express');
const router = express.Router();
const {MongoClient} = require("mongodb");
const dbName = 'transporte'
const uri = 'mongodb://localhost:27017/' + dbName

let db
let collection = 'viajeros'

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, database) => {
    if (err) return console.log(err)
    db = database.db('transporte')
})

router.get('/', function (req, res, next) {
    db.collection(collection).find().toArray((err, result) => {
        if (err) return console.log(err)

        res.format({
            html: function () {
                res.render('viajeros/index', {
                    "viajeros": result
                });
            },

            json: function () {
                res.json({datos: result});
            }
        })
    })
});

router.get('/nuevo', function (req, res) {
    res.render('viajeros/new', {title: 'Agregar viajero'});
});

router.post('/', function (req, res, next) {
    db.collection(collection).save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: result['ops'][0]});
    })
});

router.put('/:identificacion', function (req, res, next) {
    db.collection(collection)
        .findOneAndUpdate({identificacion: req.params.identificacion}, {
            $set: {
                nombres: req.body.nombres,
                apellidos: req.body.apellidos,
                fechaNacimiento: req.body.fechaNacimiento
            }
        }, {
            sort: {_id: -1},
            upsert: true
        }, (err, result) => {
            if (err) return console.log(err)
            res.json({datos: {mensaje: 'Vehículo actualizado exitosamente.'}});
        })
});

router.delete('/:identificacion', function (req, res, next) {
    db.collection(collection).findOneAndDelete({identificacion: req.params.identificacion}, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: {mensaje: 'Vehículo borrado exitosamente.'}})
    })
});

router.get('/:identificacion', function (req, res, next) {
    db.collection(collection).findOne({identificacion: req.params.identificacion}, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: result});
    })
});

module.exports = router;
