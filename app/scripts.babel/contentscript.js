'use strict';

// TODO: Use Browserify and make this not a global
let QuestionParser = window.QuestionParser;
let _ = window._;
let questionIds = {};

function acceptNodeFn(node) {
    return /\?/.test(node.textContent)
}

function isNewQuestion(question) {
    // let hash = Sha1.hash(window.location.host + question.text);
    let key = window.location.host + question.text;
    if (questionIds[key]) {
        return false;
    } else {
        console.log('Ignoring duplicate question:', key);
        questionIds[key] = question;
        return true;
    }
}


function run(interval) {
    if (typeof interval === 'undefined') {
        interval = 1000;
    }

    let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode: acceptNodeFn})
    let node = walker.nextNode()
    let allQuestions = [];
    let mutations = [];
    while (node) {
        let questions = QuestionParser.getQuestionObjectsFromNode(node);
        if (questions) {
            allQuestions = allQuestions.concat(questions);
        }
        node = walker.nextNode()
    }

    allQuestions.map((question, index) => {
        if (isNewQuestion(question)) {
            console.log(index + '. ' + question.id + ': ' + question.text);
            question.mutation();
            question.testVisibilty();
        }
    });

    console.log('Cosmic questions found ' + allQuestions.length + ' questions.');
    setTimeout(run.bind(null, interval*1.8), interval * 1.8);
}

window.addEventListener('load', () => {
    setTimeout(run, 1000);
})
