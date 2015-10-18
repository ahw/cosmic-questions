window.QuestionParser = (function() {
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
            return node.textContent;
        }
    }

    let exports = {
        getQuestionText: getQuestionText
    };

    console.log('this is question-parser', exports);
    return exports;
})();
