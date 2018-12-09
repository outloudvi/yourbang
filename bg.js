browser.omnibox.onInputStarted.addListener( () => {
  browser.omnibox.setDefaultSuggestion({
    description: "Type your bang..."
  });
});

function showLink(url, param){
  return url.replace('%s',param);
}

function splitInput(input) {
  let spl = input.split(' ');
  if (spl.length === 1){
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

var predefinedSearchs = {
  "bili" : "https://bilibili.com/video/%s",
  "baidu": "https://baidu.com/s?q=%s",
  "zhwp": "https://zh.wikipedia.org/wiki/%s"
};

var searchs = browser.storage.local.get("searchs");

if (searchs.length === 0) searchs = predefinedSearchs;

var searchwords = [];
for (i in searchs) searchwords.push(i);

function getMatchingProperties(input) {
  var result = [];
  for (search of searchwords) {
    if (search.indexOf(input) >= 0 ) {
      let suggestion = {
        content: showLink(searchs[search],'test'),
        description: '!' + search
      }
      result.push(suggestion);
    }
  }
  return result;
}

browser.omnibox.onInputChanged.addListener((input, suggest) => {
  let ret = splitInput(input);
  console.log(ret);
  if (ret.locked === false) {
    suggest(getMatchingProperties(input));
  } else {
    if (searchs[ret.search]) {
      console.log("generating items");
      suggest([
        {
          content: showLink(searchs[ret.search],ret.param),
          description: '!' + ret.search + ' ' + ret.param
        }
      ])
    } 
  }
});

browser.omnibox.onInputEntered.addListener((url, disposition) => {
  switch (disposition) {
    case "currentTab":
      browser.tabs.update({url});
      break;
    case "newForegroundTab":
      browser.tabs.create({url});
      break;
    case "newBackgroundTab":
      browser.tabs.create({url, active: false});
      break;
  }
});