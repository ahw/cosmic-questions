'use strict';

// chrome.runtime.onInstalled.addListener((details) => {
//   console.log('previousVersion', details.previousVersion);
// });


let totalSent = 0;
console.log('Cosmic Questions Event Page for Browser Action');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Got message', message, 'from sender', sender);
    sendResponse('immediate response');

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3500/questions');
    // console.log(xhr.readyState);
    xhr.onreadystatechange = function(e) {
        // console.log(xhr.readyState);
        if (xhr.readyState === 2) {
            // console.log('Received headers');
            // console.log(xhr.getAllResponseHeaders());
        }
        if (xhr.readyState === 4) {
            // totalSent = totalSent + message.questionList.length;
            // if (totalSent) {
            // chrome.browserAction.setBadgeText({text: "" + totalSent});
            // }

            // console.log('Request is complete. Response:', xhr.responseText);
            return sendResponse({status: xhr.status, message: xhr.statusText}, xhr.response);
        }
    }
    xhr.onload = function(e) {
        // console.log('xhr has finished loading', e);
    }

    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(message));
});
