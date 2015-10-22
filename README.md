Desired Features
================
- [ ] Track only unique questions on a per-domain basis. Do not want to log the
  same question over and over again whenever you visit the same page.
- [ ] Provide option to whitelist domains
- [ ] Provide option to blacklist domains
- [ ] Re-run question parsing script periodically to grab new questions which
  may have appeared on the page dynamically after AJAX activity.
- [ ] Parse out multiple questions within the same text blob.
- [ ] Only flag a question as "read" when it is within some specified zone
  in the viewport.
- [ ] Log question metadata
    - [ ] id (combination of question text + domain)
    - [ ] datetime
    - [ ] exact URL it first appeared on
    - [ ] list of URLs it appeared on?
- [ ] Provide options for which fields to record
- [ ] Dashboard page to view data in various formats
- [ ] Just POST JSON data to localhost:3500 or some other endpoint specified
  in options (don't try to collect it in chrome.storage
