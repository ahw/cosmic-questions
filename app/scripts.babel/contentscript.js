'use strict';

// TODO: Use Browserify and make this not a global
let QuestionParser = window.QuestionParser;
let _ = window._;

function acceptNodeFn(node) {
    return /\?/.test(node.textContent)
}


function run({interval = 1000, backOffFactor = 1.8} = {}) {
    run.invocationCount = ++run.invocationCount || 1;

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
        question.setupVisibilityListener(300); // 300 is the default if no arg passed
        question.testVisibilty();
    });

    let newInterval = interval * backOffFactor;
    setTimeout(run.bind(null, {interval: newInterval}), newInterval);
}

window.addEventListener('load', () => {
    setTimeout(run, 1000);
})
