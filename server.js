var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json

app.get('/', function(request, response) {
    response.send('hello');
});


app.post('/questions', function(request, response) {

    if (request.body.questionList) {
        request.body.questionList.map(function(question) {
            console.log(request.body.host + ': ' + question.text);
            // console.log('     > ' + request.body.location.href);
        });
    }
    response.send('perfect');
});

app.listen(3500);
