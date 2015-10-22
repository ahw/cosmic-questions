'use strict';

// chrome.runtime.onInstalled.addListener((details) => {
//   console.log('previousVersion', details.previousVersion);
// });

chrome.browserAction.setBadgeText({text: '???'});

console.log('Cosmic Questions Event Page for Browser Action');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Got message', message, 'from sender', sender);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3500/questions');
    console.log(xhr.readyState);
    xhr.onreadystatechange = function(e) {
        console.log(xhr.readyState);
        if (xhr.readyState === 2) {
            console.log('Received headers');
            console.log(xhr.getAllResponseHeaders());
        }
        if (xhr.readyState === 4) {
            console.log('Request is complete. Response:', xhr.responseText);
            return sendResponse({status: xhr.status, message: xhr.statusText}, xhr.response);
        }
    }
    xhr.onload = function(e) {
        console.log('xhr has finished loading', e);
    }

    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(message));

    // let items = {};
    // if (message.questionList && message.host) {
    //     message.questionList.map((question) => {
    //         let key = Sha1.hash(message.host + question.text);
    //         let value = {
    //             text: question.text,
    //             host: message.host
    //         };

    //         items[key] = value;

    //         console.log(key + ' => ' + host + ' ' + text);
    //         chrome.storage.local.set(items, () => {
    //             if (chrome.runtime.lastError) {
    //                 // return sendResponse({status: 500, 'Storage Error'});
    //             }
    //             // sendResponse({status: 200, 'OK'});
    //         });
    //     });
    // } else {
    //     return sendResponse({status: 400, message: 'Bad Request'});
    // }
});
