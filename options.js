var ext = browser.extension.getBackgroundPage();
var Setting = ext.Setting;
var searchs = JSON.parse(Setting.get('searchs'));

document.getElementById('btnSave').addEventListener('click', () => {
  let result = {}, error = false;
  try {
    result = JSON.parse(document.getElementById('taArea').value);
  } catch (err) {
    error = true;
    document.getElementById('resultArea').innerText = err;
  }
  if (!error) {
    ext.saveSearchs(result);
    document.getElementById('resultArea').innerText = "Success.";
    ext.updateSearch();
  }
});

document.getElementById('btnReload').addEventListener('click', () => {
  document.getElementById('taArea').value = JSON.stringify(searchs);
});

document.getElementById('taArea').value = JSON.stringify(searchs);