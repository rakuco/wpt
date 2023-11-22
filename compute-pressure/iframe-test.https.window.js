// META: script=/resources/test-only-api.js
// META: script=/common/get-host-info.sub.js

'use strict';

promise_test(t => {
    let frame = document.createElement('iframe');
    frame.allow = "compute-pressure";
    frame.src = get_host_info().HTTPS_REMOTE_ORIGIN + "/compute-pressure/foo.https.html";
    document.body.appendChild(frame);

    assert_not_equals(frame.src, location.href);

    return new Promise(r => { t.step_timeout(r, 1000) });
}, 'foo');
