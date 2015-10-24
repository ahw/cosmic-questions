'use strict';

// TODO: Use Browserify and make this not a global
let QuestionParser = window.QuestionParser;
let _ = window._;

function acceptNodeFn(node) {
    return /\?/.test(node.textContent)
}


function run() {
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
        console.log(index + '. ' + question.id + ': ' + question.text);
        question.mutation();
        question.testVisibilty();
    });

}

window.addEventListener('load', () => {
    setTimeout(run, 1000);
})
