'use strict'

// TODO: Use Browserify and make this not a global
let QuestionParser = window.CosmicQuestions.QuestionParser;

let APP_ID = 'cosmic-questions-' + Math.random().toString(31).substr(2,8);
let style = document.createElement('style');
style.innerHTML = `
    #${APP_ID} {
        font-family:Georgia,serif;
        font-size:12px;
        line-height:1.75;
    }

    #${APP_ID} ul {
        padding-left:20px;
    }

    #${APP_ID} li {
        padding:initial;
    }
`;

function acceptNodeFn(node) {
    return /\?/.test(node.textContent)
}

function run() {
    let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode: acceptNodeFn})
    let node = walker.nextNode()
    let questions = []
    while (node) {
        var questionText = QuestionParser.getQuestionText(node);
        if (questionText) {
            node.parentElement.style.borderBottom = '3px solid gold';
            questions.push(questionText);
        }
        node = walker.nextNode()
    }

    let div = document.createElement('div')
    div.id = APP_ID
    div.style.position = 'fixed'
    div.style.left = '50%'
    div.style.bottom = '20px'
    div.style.maxHeight = '300px'
    div.style.overflow = 'scroll'
    div.style.background = 'white'
    div.style.padding = '10px'
    div.style.boxShadow = '2px 2px 21px -4px black'
    div.style.transform = 'translateX(-50%)'
    div.style.border = '1px solid black'
    // div.style.width = '50%'

    let html = `
    <a id="cq-close" style="float:right" href="#">Close</a>
    <ul>
        ${questions.map((str) => { return "<li>" + str + "</li>" }).join("")}
    </ul>
    `

    div.innerHTML = html

    document.head.appendChild(style)
    document.body.appendChild(div)
    document.getElementById('cq-close').onclick = (e) => {
        div.remove()
    }
}

setTimeout(run, 1000)
