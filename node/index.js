var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var topic = 'order-data-armazena-a';
var client = new Client('cxln1.c.thelab-240901.internal:2181', "worker-" + Math.floor(Math.random() * 10000));
var payloads = [{ topic: topic }];
var consumer = new HighLevelConsumer(client, payloads);
var offset = new Offset(client);
var port = 3006;

const express = require('express');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: '../dados/order_data/out.csv',
  header: [
    {id: 'name', title: 'Name'},
    {id: 'surname', title: 'Surname'},
    {id: 'age', title: 'delivered'},
  ]
});

app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.get('/botao', function(req, res){
    //res.sendfile('botao.html');
    //console.log(req)
    let data = [
        {
          name: 'John',
          surname: 'Snow',
          age: 'delivered',
        }
      ];
      for (let index = 0; index < 10000; index++) {
          var myArray = [
              "shipped",
              "processing",
              "delivered"
            ];
            
          var randomItem = myArray[Math.floor(Math.random()*myArray.length)];
        
        var d = new Date();
        var dNow = new Date();
        var d = dNow.getFullYear() + '/' + (dNow.getMonth()+1) + '/' + dNow.getDate() + ' ' + dNow.getHours() + ':' + dNow.getMinutes()+ ':' + dNow.getSeconds();
             json ={
               name: d,
               surname: 'Snow',
               age: randomItem,
             }

          data.push(json);
      }
      //app.get('/', (req, res) =>{
      
          csvWriter
          .writeRecords(data)
          .then(()=> console.log('The CSV file was written successfully'));
      //})
      
      //app.listen(1111);
});

io = io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

consumer = consumer.on('message', function(message) {
    console.log(message.value);
    io.emit("message", message.value);
});

http.listen(port, function(){
    console.log("Running on port " + port)
});
