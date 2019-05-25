"use strict";

var Setting, searchs = {}, searchwords = [];

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
  if (spl.length > 1) {
    return {
      locked: true,
      search: spl[0],
      param: spl.slice(1).join(' ')
    }
  } else {
    return {
      locked: false,
      search: spl[0]
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
  for (let i in searchs) searchwords.push(i);
}

function initial() {
  console.log('Welcome, newcomer!');
  Setting.set('firstrun', false);
  Setting.set('searchs', JSON.stringify(predefinedSearchs));
}

// -------------------------------------------------------------

Setting = new Setting_Class();
const predefinedSearchs = {
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
    browser.omnibox.setDefaultSuggestion({
      description: "Type your bang..."
    });
    suggest(getMatchingProperties(input, searchwords));
  } else {
    if (searchs[ret.search]) {
      browser.omnibox.setDefaultSuggestion({
        description: "Type your search terms..."
      });
      console.log(showLink(searchs[ret.search], ret.param))
      suggest([
        {
          content: showLink(searchs[ret.search], ret.param),
          description: '! ' + ret.search + ' ' + ret.param
        }
      ])

    } else {
      browser.omnibox.setDefaultSuggestion({
        description: Setting.get("useDdgFallback") === "true" ? "Try DuckDuckGo's bang?" : "Your bang is not found."
      });
    }
  }
});

browser.omnibox.onInputEntered.addListener((text, disposition) => {
  let args = text.split(' ');
  let url = "https://duckduckgo.com";
  if (!searchs[args[0]]) {
    if (Setting.get("useDdgFallback") === "true") {
      url = `https://duckduckgo.com/?q=!${args[0]}+${args.slice(1).join(" ")}`;
      browser.tabs.update({ url });
      return;
    }
  } else {
    url = showLink(searchs[args[0]], args.slice(1).join(" "));
    browser.tabs.update({ url });
    return;
  }
});