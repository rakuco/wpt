// META: script=/resources/test-only-api.js
// META: script=/common/get-host-info.sub.js

'use strict';

function send_message_to_iframe(iframe, message) {
  return new Promise((resolve, reject) => {
    window.addEventListener('message', (e) => {
      // The usage of test_driver.set_test_context() in
      // the iframe causes unrelated messages to be sent as
      // well. We just need to ignore them here.
      if (!e.data.command) {
        return;
      }

      if (e.data.command !== message.command) {
        reject(`Expected reply with command '${message.command}', got '${
            e.data.command}' instead`);
        return;
      }
      if (e.data.error) {
        reject(e.data.error);
        return;
      }
      resolve(e.data.result);
    });
    iframe.contentWindow.postMessage(message, '*');
  });
}

promise_test(async t => {
    let frame = document.createElement('iframe');
    frame.allow = "compute-pressure";
    frame.src = get_host_info().HTTPS_REMOTE_ORIGIN + "/compute-pressure/foo.https.html";
    const eventWatcher = new EventWatcher(t, frame, 'load');
    document.body.appendChild(frame);
    t.add_cleanup(() => { frame.parentNode.removeChild(frame) });
    await eventWatcher.wait_for('load');

    assert_not_equals(frame.src, location.href);

    frame.contentWindow.focus();
    await send_message_to_iframe(frame, {command: 'start'});
}, 'foo');
