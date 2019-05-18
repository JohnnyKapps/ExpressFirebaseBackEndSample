var firebaseConfig = require('./config-sample')

var express = require('express');
var bodyParser = require('body-parser');
var firebase = require('firebase');

var app = express();
app.use(bodyParser.json()); // Padroniza o body como json

firebase.initializeApp(firebaseConfig);

app.get('/jobs', function(req, res){
    var jobsReference = firebase.database().ref("/Jobs/");
	jobsReference.on("value",
		function (snapshot) {
			res.status(200).send(snapshot.val());
			jobsReference.off("value");
		},
		function (error) {
			res.status(500).send(error.code);
		});
});

app.get('/jobs/:id', function(req, res){
    var idJob = req.params.id;
    var ref = firebase.database().ref("/Jobs/" + idJob);

    ref.on("value",
        function(snapshot){
            res.status(200).send(snapshot.val());
            ref.off();
        }, 
        function(error){
            res.status(500).send(error);
        }
    )
});

app.post('/jobs', function(req, res){
    var novoJob = req.body;

    var caminho = '/Jobs/';
    var referencia = firebase.database().ref(caminho);

    referencia.push(novoJob, function(error) {
            if (error) {
                res.send("Job nao pode ser salvo." + error);
            }
            else {
                res.send("Job salvo com sucesso.");
            }
        });
});



app.listen(3001, function(){
    console.log('Servidor iniciado na porta 3001...');
});