var ext = browser.extension.getBackgroundPage();
var Setting = ext.Setting;

var settingsList = {
  searchs: "taArea",
  useDdgFallback: "iuseDdgFallback"
}

function loadSettings() {
  for (i in settingsList) {
    document.getElementById(settingsList[i]).value = Setting.get(i)
  }
}

function saveSettings(items) {
  for (let i in items) {
    Setting.set(i, items[i]);
  }
}

document.getElementById('btnSave').addEventListener('click', () => {
  let result = {}, error = false;
  try {
    result = JSON.parse(document.getElementById('taArea').value);
  } catch (err) {
    error = true;
    document.getElementById('resultArea').innerText = err;
  }
  if (!error) {
    saveSettings({
      searchs: document.getElementById('taArea').value,
      useDdgFallback: document.getElementById('iuseDdgFallback').checked
    })
    document.getElementById('resultArea').innerText = "Success.";
    ext.updateSearch();
  }
});

document.getElementById('btnReload').addEventListener('click', () => { loadSettings(); });

loadSettings();