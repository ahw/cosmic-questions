let _ = window._;

let QuestionParser = (function() {

    function createQuestionObject(options) {
        return {
            text: options.text,
            isFullQuestion: options.isFullQuestion,
            textNodeStartIndex: options.textNodeStartIndex,
            wrappedHtml: `${options.leadingContent || ""}<span class="cosmic-question">${options.text}</span>${options.trailingContent || ""}`
        };
    }

    let parsingStates = {
        START: 'START',
        QUESTION: 'QUESTION'
    };

    function parseQuestionText(text) {
        let state = parsingStates.START;
        let index = text.length-1;
        let questions = [];
        let lastNonWhiteSpaceCharIndex = null;
        let questionMarkIndex = null;
        let questionLength = 0;
        let trailingContent = "";
        let leadingContent = null;
        let bail = false; // For debugging

        while (index >= 0) {
            if (bail) break;

            switch (state) {
                case parsingStates.START:
                    lastNonWhiteSpaceCharIndex = null;
                    questionMarkIndex = null;

                    if (text.charAt(index) === '?') {
                        questionMarkIndex = index;
                        state = parsingStates.QUESTION;
                    } else {
                        trailingContent = text.charAt(index) + trailingContent;
                    }
                    break;
                case parsingStates.QUESTION:
                    if (/\w/.test(text.charAt(index))) {
                        lastNonWhiteSpaceCharIndex = index;
                    }
                    questionLength = questionMarkIndex - lastNonWhiteSpaceCharIndex + 1;

                    if (/[\.\?!]/.test(text.charAt(index))) {
                        let question = createQuestionObject({
                            text: text.substr(lastNonWhiteSpaceCharIndex, questionLength),
                            isFullQuestion: true,
                            textNodeStartIndex: lastNonWhiteSpaceCharIndex,
                            trailingContent: trailingContent,
                            leadingContent: text.substr(index+1, lastNonWhiteSpaceCharIndex - index - 1)
                        });
                        trailingContent = leadingContent = "";
                        questions.unshift(question);
                        ++index; // Put this char back on the state machine
                        state = parsingStates.START;
                    } else if (index === 0 && /[A-Z]/.test(text.charAt(index))) {
                        let question = createQuestionObject({
                            text: text.substr(lastNonWhiteSpaceCharIndex, questionLength),
                            isFullQuestion: true,
                            textNodeStartIndex: lastNonWhiteSpaceCharIndex,
                            trailingContent: trailingContent,
                            leadingContent: ""
                        });
                        questions.unshift(question);
                    } else if (index === 0) {
                        let question = createQuestionObject({
                            text: text.substr(lastNonWhiteSpaceCharIndex, questionLength),
                            isFullQuestion: false,
                            textNodeStartIndex: lastNonWhiteSpaceCharIndex,
                            trailingContent: trailingContent,
                            leadingContent: ""
                        });
                        questions.unshift(question);
                    }
                    break;
            }
            --index;
            // debugger;
        }

        return questions;
    }

    function getQuestionText(node) {
        let parentTagName = node.parentElement.nodeName;
        if (!/\?/.test(node.textContent)) {
            // Should have already been checked, but just in case. Questions
            // must contain question marks.
            return null;
        } if (['SCRIPT', 'STYLE'].indexOf(parentTagName) >= 0) {
            // Ignore
            return null;
        } else if (/^http\S+$/.test(node.textContent)) {
            // Ignore
            return null;
        } else {
            // Start parsing
            // let questionText = node.textContent;
            // let rightMostIndex = node.textContent.length;
            // while (node.textContent.lastIndexOf('?') > 0, rightMostIndex) {
            //     let questionMarkIndex = node.textContent.lastIndexOf('?', rightMostIndex);
            //     let nextQuestionMarkIndex = node.textContent.lastIndexOf('?', rightMostIndex-1);
            // }
            let questions = parseQuestionText(node.textContent);

            let wrappedNode = document.createElement('span');
            wrappedNode.id = Math.random(31).toString().substr(2, 16);
            wrappedNode.setAttribute('class', 'cosmic-question');
            wrappedNode.innerHTML = node.textContent;
            let mutation = () => {
                node.parentElement.replaceChild(wrappedNode, node);
                let scrollListener = (e) => {
                    let top = wrappedNode.getBoundingClientRect().top;
                    console.log('testing visibility...');
                    if (top > 0 && top <= window.innerHeight * 0.75) {
                        // wrappedNode.style.border = '1px solid black';
                        wrappedNode.style.background = '#FEF83C';
                        document.removeEventListener('scroll', debouncedListener);
                        console.log('removing debounced listener');
                    }
                }

                let debouncedListener = _.debounce(scrollListener, 300);
                document.addEventListener('scroll', debouncedListener);
            };
            // return [{
            //     text: questionText,
            //     wrappedNode: wrappedNode,
            //     mutation: mutation
            // }];
            return questions;
        }
    }

    let exports = {
        getQuestionText: getQuestionText
    };

    return exports;
})();
