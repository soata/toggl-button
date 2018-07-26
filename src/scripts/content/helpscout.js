'use strict';

togglbutton.render('.convo-toolbar:not(.toggl)', { observe: true }, function() {
  var link,
    description =
      '#' +
      $('#tkHeader strong').textContent +
      ' ' +
      $('#subjectLine').textContent;

  link = togglbutton.createTimerLink({
    className: 'helpscout',
    description: description
  });

  link.setAttribute('style', 'margin-top: 10px');

  $('.convo-toolbar').appendChild(link);
});
