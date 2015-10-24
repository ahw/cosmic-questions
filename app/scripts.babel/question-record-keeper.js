let QuestionRecordKeeper = (function() {

    let uniqueQuestions = {};

    /**
     * Return true if it was added, false if it was not.
     *
     */
    function addQuestion(question) {
        // let hash = Sha1.hash(window.location.host + question.text);
        let key = window.location.host + question.text;
        if (uniqueQuestions[key]) {
            return false;
        } else {
            uniqueQuestions[key] = question;
            return true;
        }
    }

    let exports = {
        addQuestion
    };

    return exports;
})();
