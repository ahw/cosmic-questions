About
=====
I'm writing a Chrome extension to log out all the questions I see in my
browser. For some reason I thought it would be interesting/amusing.
Something along the lines and in the spirit of
[NYTMinusContext](https://twitter.com/NYTMinusContext).

On the document load event this extension iterates over all the [text
nodes](https://developer.mozilla.org/en-US/docs/Web/API/Node) in the
document using the
[TreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker)
API and searches for question strings in the `textContent` of those nodes.
Each question string is wrapped in a uniquely identifiable `<span>` tag that
has a scroll event listener attached. When a particular one of these
`<span>` elements scrolls into view the extension makes an AJAX POST request
to `localhost:3500/questions` with a bunch of JSON metadata (most
importantly, the question text and the hostname). From there, the server can
do whatever it wants &mdash; I'm just writing them all to a file for now.

Desired Features
================
- [ ] Track only unique questions on a per-domain basis. Do not want to log the
  same question over and over again whenever you visit the same page.
- [ ] Provide option to whitelist domains
- [ ] Provide option to blacklist domains
- [x] Re-run question parsing script periodically to grab new questions which
  may have appeared on the page dynamically after AJAX activity.
- [x] Parse out multiple questions within the same text blob.
- [x] Only flag a question as "read" when it is within some specified zone
  in the viewport.
- [ ] Log question metadata
    - [x] id (SHA1 hash of window.location.host + question text)
    - [ ] datetime
    - [ ] exact URL it first appeared on
    - [ ] list of URLs it appeared on?
- [ ] Provide options for which fields to record
- [ ] Dashboard page to view data in various formats
- [x] Just POST JSON data to localhost:3500 or some other endpoint specified
  in options (don't try to collect it in chrome.storage
