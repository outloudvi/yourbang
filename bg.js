"use strict";

var Setting, searchs, searchwords, predefinedSearchs;

class Setting_Class {
  get(key) {
    return window.localStorage.getItem(key);
  }

  set(key, value) {
    return window.localStorage.setItem(key, value);
  }
}

function showLink(url, param) {
  return url.replace('%s', param);
}

function splitInput(input) {
  let spl = input.split(' ');
  if (spl.length === 1) {
    return {
      locked: false,
      search: spl[0]
    }
  } else {
    return {
      locked: true,
      search: spl[0],
      param: spl.slice(1).join(' ')
    }
  }
}

function getMatchingProperties(input, searchwords) {
  var result = [];
  for (let search of searchwords) {
    if (search.indexOf(input) >= 0) {
      let suggestion = {
        content: showLink(searchs[search], 'test'),
        description: '!' + search
      }
      result.push(suggestion);
    }
  }
  return result;
}

function updateSearch() {
  searchs = JSON.parse(Setting.get('searchs'));
  searchwords = [];
  for (let i in searchs) searchwords.push(i);
}

function saveSearchs(items){
  Setting.set('searchs', JSON.stringify(items));
}

function initial() {
  console.log('Welcome, newcomer!');
  Setting.set('firstrun', false);
  saveSearchs(predefinedSearchs);
}

// -------------------------------------------------------------

Setting = new Setting_Class();
predefinedSearchs = {
  "bili": "https://bilibili.com/video/%s",
  "baidu": "https://baidu.com/s?wd=%s",
  "zhwp": "https://zh.wikipedia.org/wiki/%s"
};

if (Setting.get('firstrun') === null) {
  initial();
}

updateSearch();

browser.omnibox.onInputStarted.addListener(() => {
  browser.omnibox.setDefaultSuggestion({
    description: "Type your bang..."
  });
});

browser.omnibox.onInputChanged.addListener((input, suggest) => {
  let ret = splitInput(input);
  if (ret.locked === false) {
    suggest(getMatchingProperties(input, searchwords));
  } else {
    if (searchs[ret.search]) {
      browser.omnibox.setDefaultSuggestion({
        description: "Type your search..."
      });
      suggest([
        {
          content: showLink(searchs[ret.search], ret.param),
          description: '!' + ret.search + ' ' + ret.param
        }
      ])
    } else {
      browser.omnibox.setDefaultSuggestion({
        description: "Your bang is not found."
      });
    }
  }
});

browser.omnibox.onInputEntered.addListener((url, disposition) => {
  switch (disposition) {
    case "currentTab":
      browser.tabs.update({ url });
      break;
    case "newForegroundTab":
      browser.tabs.create({ url });
      break;
    case "newBackgroundTab":
      browser.tabs.create({ url, active: false });
      break;
  }
});
