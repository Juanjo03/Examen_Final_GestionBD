const express = require('express');
const router = express.Router();
const {MongoClient} = require("mongodb");
const dbName = 'transporte'
const uri = 'mongodb://localhost:27017/' + dbName

let db
let collection = 'rutas'

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, database) => {
    if (err) return console.log(err)
    db = database.db('transporte')
})

router.get('/', function (req, res, next) {
    db.collection(collection).find().toArray((err, result) => {
        if (err) return console.log(err)

        res.format({
            html: function () {
                res.render('rutas/index', {
                    "rutas": result
                });
            },

            json: function () {
                res.json({datos: result});
            }
        })
    })
});

router.get('/nuevo', function (req, res) {
    res.render('rutas/new', {title: 'Agregar ruta'});
});

router.post('/', function (req, res, next) {
    db.collection(collection).save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: result['ops'][0]});
    })
});

router.put('/:numeroGuia', function (req, res, next) {
    db.collection(collection)
        .findOneAndUpdate({numeroGuia: req.params.numeroGuia}, {
            $set: {
                origen: req.body.origen,
                destino: req.body.destino,
                viajero: req.body.viajero,
                empresa: req.body.empresa,
                vehiculo: req.body.vehiculo
            }
        }, {
            sort: {_id: -1},
            upsert: true
        }, (err, result) => {
            if (err) return console.log(err)
            res.json({datos: {mensaje: 'Ruta actualizada exitosamente.'}});
        })
});

router.delete('/:numeroGuia', function (req, res, next) {
    db.collection(collection).findOneAndDelete({nombre: req.params.nombre}, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: {mensaje: 'Ruta borrada exitosamente.'}})
    })
});

router.get('/:numeroGuia', function (req, res, next) {
    db.collection(collection).findOne({numeroGuia: req.params.numeroGuia}, (err, result) => {
        if (err) return console.log(err)
        res.json({datos: result});
    })
});

module.exports = router;
