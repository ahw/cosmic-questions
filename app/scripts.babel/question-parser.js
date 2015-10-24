let _ = window._;

let QuestionParser = (function() {

    let DATA_ATTRIBUTE_NAME = 'data-cosmic-question-id';

    function getUniqueId() {
        // Actual guid
        // return Math.random().toString(31).substr(2, 16).split("").map(function(ch) { return ch.charCodeAt(0).toString(16); }).join("");
        // Whatever
        return Math.random().toString(31).substr(2, 8);
    }

    function addMutationFunctions(originalNode, questions) {
        let parentId = getUniqueId();
        originalNode.parentElement.setAttribute(DATA_ATTRIBUTE_NAME, parentId);
        questions.forEach((question, index) => {
            let mutation = () => {
                let parentElement = document.querySelector('[' + DATA_ATTRIBUTE_NAME + '="' + parentId + '"]');

                // Carefully replace innerHTML of parent element with mixed content
                parentElement.innerHTML = parentElement.innerHTML.replace(question.leadingContent + question.text + question.trailingContent, question.wrappedHtml);

                let scrollListener = (e) => {
                    let questionNode = document.getElementById(question.id);
                    if (questionNode === null) {
                        console.warn('Could not find question ' + question.id + ': ' + question.text + ' Removing listener.');
                        document.removeEventListener('scroll', debouncedListener);
                        return;
                    }

                    let top = questionNode.getBoundingClientRect().top;
                    if (top > -200 && top <= window.innerHeight * 0.75) {
                        // Testing for -200 and not zero in order to capture
                        // questions which appear at the top of the page and
                        // are thus in view even before the first scroll.
                        // This logic still won't capture questions on pages
                        // so short that a scroll isn't required, or on
                        // pages where the user just simply didn't scroll at
                        // all.

                        // console.log('POST-ing (' + index + ') ' + question.text);
                        chrome.runtime.sendMessage({questionList: [question], host: window.location.host, location: window.location}, console.log.bind(console, 'Response:'));

                        setTimeout(() => {
                            questionNode.style.background = '#FEF83C';
                            questionNode.style.color = 'black';
                        }, 1000);
                        document.removeEventListener('scroll', debouncedListener);
                    }
                }

                let debouncedListener = _.debounce(scrollListener, 300);
                document.addEventListener('scroll', debouncedListener);

                question.testVisibilty = scrollListener;
            };

            question.mutation = mutation;
        });
    }

    function createQuestionObject({text, leadingContent, trailingContent, isFullQuestion, textNodeStartIndex}) {
        let id = getUniqueId();
        return {
            id,
            text,            // question text in isolation
            leadingContent,  // stuff before the question that isn't the question itself
            trailingContent, // stuff after the question that isn't the question itself
            isFullQuestion,  // did parsing stop mid-sentence?
            textNodeStartIndex,
            wrappedHtml: `${leadingContent || ""}<span id="${id}" class="cosmic-question">${text}</span>${trailingContent || ""}`
        };
    }

    function getQuestionObjectsFromText(text) {
        let parsingStates = { START: 'START', QUESTION: 'QUESTION' };
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
        }

        return questions;
    }

    function getQuestionObjectsFromNode(node) {
        let parentTagName = node.parentElement.nodeName;
        if (!/\?/.test(node.textContent)) {
            // Should have already been checked, but just in case. Questions
            // must contain question marks.
            return null;
        } if (['SCRIPT', 'NOSCRIPT', 'STYLE'].indexOf(parentTagName) >= 0) {
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

            let questions = getQuestionObjectsFromText(node.textContent);
            addMutationFunctions(node, questions);

            // let combinedHtml = questions.map((question) => { return question.wrappedHtml; }).join("");

            // let wrappedNode = document.createElement('span');
            // wrappedNode.id = Math.random().toString(31).substr(2, 16);
            // wrappedNode.setAttribute('class', 'cosmic-question');
            // wrappedNode.innerHTML = node.textContent;

            // return [{
            //     text: questionText,
            //     wrappedNode: wrappedNode,
            //     mutation: mutation
            // }];
            return questions;
        }
    }

    let exports = {
        getQuestionObjectsFromNode
    };

    return exports;
})();
