'use strict'

function acceptNodeFn(node) {
    return /\?/.test(node.textContent)
}

function run() {
    let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode: acceptNodeFn})
    let node = walker.nextNode()
    let questions = []
    while (node) {
        let text = node.textContent
        let name = node.parentElement.nodeName
        if (['SCRIPT', 'STYLE'].indexOf(name) === -1) {
            node.parentElement.style.borderBottom = '3px solid gold'
            // node.parentElement.style.color = 'white'
            questions.push(text)
        }
        node = walker.nextNode()
    }

    let div = document.createElement('div')
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

    document.body.appendChild(div)
    document.getElementById('cq-close').onclick = (e) => {
        div.remove()
    }
}

setTimeout(run, 1000)
