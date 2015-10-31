var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('underscore');

app.use(bodyParser.json()); // for parsing application/json

app.get('/', function(request, response) {
    response.send('hello');
});


app.post('/questions', function(request, response) {

    if (request.body.questionList) {
        request.body.questionList.map(function(question) {
            var o = _.pick(question, ['id', 'trimmedText', 'trailingContent', 'leadingContent', 'isFullQuestion']);
            fs.appendFileSync('questions.log', JSON.stringify(o) + "\n");
            console.log(request.body.host + ': ' + question.trimmedText);
            // console.log('     > ' + request.body.location.href);
        });
    }
    response.send('done');
});

app.listen(3500);
