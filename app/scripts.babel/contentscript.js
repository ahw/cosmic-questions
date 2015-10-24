'use strict';

// TODO: Use Browserify and make this not a global
let QuestionParser = window.QuestionParser;
let _ = window._;
let BACKOFF_FACTOR = 1.8;

function acceptNodeFn(node) {
    return /\?/.test(node.textContent)
}


function run(interval) {
    if (typeof interval === 'undefined') {
        interval = 1000;
    }

    let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode: acceptNodeFn})
    let node = walker.nextNode()
    let allQuestions = [];
    let mutations = [];
    let numBefore = allQuestions.length;
    while (node) {
        let newQuestions = QuestionParser.getQuestionObjectsFromNode(node);
        if (newQuestions) {
            allQuestions = allQuestions.concat(newQuestions);
        }
        node = walker.nextNode()
    }
    let numAfter = allQuestions.length;
    console.log('[cosmic-questions] Found ' + (numAfter - numBefore) + ' new questions after ' + interval + 'ms');

    allQuestions.map((question, index) => {
        question.mutation();
        question.testVisibilty();
    });

    setTimeout(run.bind(null, interval * BACKOFF_FACTOR), interval * BACKOFF_FACTOR);
}

window.addEventListener('load', () => {
    setTimeout(run, 1000);
})
