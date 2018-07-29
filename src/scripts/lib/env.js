import './bugsnag'

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(info) {
    var headers = info.requestHeaders,
      isTogglButton = false,
      uaIndex = -1;

    headers.forEach(function(header, i) {
      if (header.name.toLowerCase() === 'user-agent') {
        uaIndex = i;
      }
      if (header.name === 'IsTogglButton') {
        isTogglButton = true;
      }
    });

    if (isTogglButton && uaIndex !== -1) {
      headers[uaIndex].value =
        'TogglButton/' + chrome.runtime.getManifest().version;
    }
    return { requestHeaders: headers };
  },
  {
    urls: ['https://www.toggl.com/*', 'https://toggl.com/*'],
    types: ['xmlhttprequest']
  },
  ['blocking', 'requestHeaders']
);
