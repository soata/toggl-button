/*jslint indent: 2 plusplus: true*/
/*global $: false, togglbutton: false*/

'use strict';

function getProjectNameFromLabel (elem) {
  var projectLabel = '', projectLabelEle = $('.project_item__name', elem.parentNode.parentNode);
  if (projectLabelEle) {
    projectLabel = projectLabelEle.textContent.trim();
  }
  return projectLabel;
}

var levelPattern = /(?:^|\s)indent_([0-9]*?)(?:\s|$)/;
function getParentEle (sidebarCurrentEle) {
  var curLevel, parentClass, parentCandidate;
  curLevel = sidebarCurrentEle.className.match(levelPattern)[1];
  parentClass = 'indent_' + (curLevel - 1);

  parentCandidate = sidebarCurrentEle;
  while (parentCandidate.previousElementSibling) {
    parentCandidate = parentCandidate.previousElementSibling;
    if (parentCandidate.classList.contains(parentClass)) {
      break;
    }
  }
  return parentCandidate;
}

function isTopLevelProject (sidebarCurrentEle) {
  return sidebarCurrentEle.classList.contains('indent_1');
}

function getProjectNameHierarchy (sidebarCurrentEle) {
  var parentProjectEle, projectName;
  projectName = $('.name', sidebarCurrentEle).firstChild.textContent.trim();
  if (isTopLevelProject(sidebarCurrentEle)) {
    return [projectName];
  }
  parentProjectEle = getParentEle(sidebarCurrentEle);
  return [projectName].concat(getProjectNameHierarchy(parentProjectEle));
}

function projectWasJustCreated (projectId) {
  return projectId.startsWith('_');
}

function getSidebarCurrentEle (elem) {
  var editorInstance, projectId, sidebarRoot, sidebarColorEle, sidebarCurrentEle;
  editorInstance = elem.closest('.project_editor_instance');
  if (editorInstance) {
    projectId = editorInstance.getAttribute('data-project-id');
    sidebarRoot = $('#project_list');
    if (projectWasJustCreated(projectId)) {
      sidebarCurrentEle = $('.current', sidebarRoot);
    } else {
      sidebarColorEle = $('#project_color_' + projectId, sidebarRoot);
      if (sidebarColorEle) {
        sidebarCurrentEle = sidebarColorEle.closest('.menu_clickable');
      }
    }
  }
  return sidebarCurrentEle;
}

function getProjectNames (elem) {
  var projectNames, viewingInbox, sidebarCurrentEle;
  viewingInbox = $('#filter_inbox.current, #filter_team_inbox.current');
  if (viewingInbox) {
    projectNames = ['Inbox'];
  } else {
    sidebarCurrentEle = getSidebarCurrentEle(elem);
    if (sidebarCurrentEle) {
      projectNames = getProjectNameHierarchy(sidebarCurrentEle);
    } else {
      projectNames = [getProjectNameFromLabel(elem)];
    }
  }
  return projectNames;
}

togglbutton.render('.task_item .content:not(.toggl)', { observe: true }, function (elem) {
  var link, descFunc, container = $('.text', elem);

  descFunc = function () {
    var clone = container.cloneNode(true),
      i = 0,
      child = null;

    while (clone.children.length > i) {
      child = clone.children[i];
      if (child.tagName === "B"
        || child.tagName === "I"
        || child.tagName === "STRONG"
        || child.tagName === "EM") {
        i++;
      } else if (child.tagName === "A") {
        if (child.classList.contains("ex_link")
          || child.getAttribute("href").indexOf("mailto:") === 0) {
          i++;
        } else {
          child.remove();
        }
      } else {
        child.remove();
      }
    }

    return clone.textContent.trim();
  };

  //add Todoist-Tags as Tags
  var tagsFunc = function (elem) {
    var tagElems = elem.querySelectorAll('.labels_holder .label:not(.label_sep)');
    var i = 0;
    var tags = [];

    while (tagElems.length > i) {
      var tag = tagElems[i];
      tags.push(tag.innerText)
      i++;
    }

    return tags;
  };

  //add ParentIndent Description
  var getParentDesc = function (elem) {
    var li = elem.parentNode.parentNode.parentNode.parentNode;
    var desc = ""
    if (li.classList.contains('indent_2')) {
      var prev = li.previousElementSibling;
      while (prev) {
        if (prev.classList.contains('indent_1')) {
          desc = prev.innerText;
          break;
        }
        prev = prev.previousElementSibling;
      }
    }
    return desc
  }

  link = togglbutton.createTimerLink({
    className: 'todoist',
    description: getParentDesc(elem) + descFunc(),
    projectName: getProjectNames(elem),
    tags: tagsFunc(elem)
  });

  container.insertBefore(link, container.lastChild);
});
