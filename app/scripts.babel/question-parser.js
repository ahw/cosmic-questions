window.CosmicQuestions.QuestionParser = (function() {
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
            let wrappedNode = document.createElement('span');
            let questionText = node.textContent;
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

                let debouncedListener = window.CosmicQuestions._.debounce(scrollListener, 300);
                document.addEventListener('scroll', debouncedListener);
            };
            return [{
                text: questionText,
                wrappedNode: wrappedNode,
                mutation: mutation
            }];
        }
    }

    let exports = {
        getQuestionText: getQuestionText
    };

    return exports;
})();
