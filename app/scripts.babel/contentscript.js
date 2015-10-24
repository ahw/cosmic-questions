'use strict';

// TODO: Use Browserify and make this not a global
let QuestionParser = window.QuestionParser;
let _ = window._;

let APP_ID = 'cosmic-questions-' + Math.random().toString(31).substr(2,8);
let style = document.createElement('style');

style.innerHTML = `
#${APP_ID} {
    font-family:Monospace;
    font-size:12px;
    line-height:1.75;
    position: fixed;
    width:300px;
    right: 0;
    top:0;
    bottom: 0;
    height: ${window.innerHeight};
    background: white;
    padding: 10px;
    border-left: 1px solid black;
    overflow:scroll;
    box-sizing:border-box;
}

#question-list-${APP_ID} {
    overflow:scroll;
    height: 100%;
    transition:500ms;
}

#sidebar-toggle-${APP_ID} {
    height: 100%;
    width: 10px;
    background: black;;
    position: absolute;
    left:0;
    top:0;
    bottom:0;
    border-right:1px solid black;
}

#sidebar-toggle-${APP_ID}:hover {
    background: #FEF83C;
    cursor:pointer;
}

#sidebar-toggle-${APP_ID}:after {
    content: "\u25b6";
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    left:-10px;
    transition:500ms;
    color:transparent;
}

#sidebar-toggle-${APP_ID}:hover:after {
    color:black;
    left:10px;
}

#${APP_ID} ul {
    padding-left:20px;
    list-style-type:circle;
}

#${APP_ID} li {
    padding:initial;
    font-family:inherit;
    font-size:inherit;
    margin-top:12px;
    color:black;
    line-height:1.75;;
}

#${APP_ID} li:first-of-type {
    margin-top:0;
}
`;

function acceptNodeFn(node) {
    return /\?/.test(node.textContent)
}


function run() {
    // console.log('Running Cosmic Questions');
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

    // chrome.runtime.sendMessage({questionList: allQuestions, host: window.location.host}, console.log.bind(console, 'Response:'));

    // let div = document.createElement('div')
    // div.id = APP_ID
    // div.style.width = '50%'
    // let html = `
    // <div id="sidebar-toggle-${APP_ID}"></div>
    // <a id="close-link-${APP_ID}" style="float:right" href="#">Close</a>
    // <div id="question-list-${APP_ID}">
    //     <ul>
    //         ${allQuestions.map((str) => { return "<li>" + str + "</li>" }).join("")}
    //     </ul>
    // </div>
    // `
    // div.innerHTML = html
    // document.head.appendChild(style)
    // document.body.appendChild(div)
    // document.getElementById(`close-link-${APP_ID}`).onclick = (e) => {
    //     div.remove()
    // }
    // document.getElementById(`sidebar-toggle-${APP_ID}`).onclick = (e) => {
    //     div.style.width = 0;
    // }
}

// let t0 = Date.now();
// console.log('now is ' + t0);
window.addEventListener('load', () => {
    // console.log('load took ' + (Date.now() - t0) + 'ms');
    // console.log('running in 1000ms');
    setTimeout(run, 1000);
})
