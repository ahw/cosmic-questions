'use strict';

// TODO: Use Browserify and make this not a global
let QuestionParser = window.CosmicQuestions.QuestionParser;
console.log('hello');

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
}

#sidebar-toggle-${APP_ID} {
    height: 100%;
    width: 5px;
    background: black;
    position: absolute;
    left:0;
    top:0;
    bottom:0;
}

#sidebar-toggle-${APP_ID}:hover {
    height: 100%;
    width: 5px;
    background: yellow;
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
    let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode: acceptNodeFn})
    let node = walker.nextNode()
    let questions = []
    let mutations = []
    while (node) {
        var results = QuestionParser.getQuestionText(node);
        if (results) {
            // node.parentElement.style.borderBottom = '3px solid gold';
            results.map((result) => {
                questions.push(result.text);
                mutations.push(result.mutation);
            });
        }
        node = walker.nextNode()
    }

    mutations.map((mutation) => { mutation.call(); });

    let div = document.createElement('div')
    div.id = APP_ID
    // div.style.width = '50%'

    let html = `
    <div id="sidebar-toggle-${APP_ID}"></div>
    <a id="close-link-${APP_ID}" style="float:right" href="#">Close</a>
    <div id="question-list-${APP_ID}">
        <ul>
            ${questions.map((str) => { return "<li>" + str + "</li>" }).join("")}
        </ul>
    </div>
    `

    div.innerHTML = html

    document.head.appendChild(style)
    document.body.appendChild(div)
    document.getElementById(`close-link-${APP_ID}`).onclick = (e) => {
        div.remove()
    }
    document.getElementById(`sidebar-toggle-${APP_ID}`).onclick = (e) => {
        div.style.width = 0;
    }
}

setTimeout(run, 1000)
