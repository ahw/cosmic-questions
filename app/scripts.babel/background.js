'use strict';

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '???'});

console.log('Cosmic Questions Event Page for Browser Action');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Got message', message, 'from sender', sender);
    sendResponse({status: 200, message: 'OK'});
});
