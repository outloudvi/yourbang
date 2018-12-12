var ext = browser.extension.getBackgroundPage();
var Setting = ext.Setting;
var searchs = JSON.parse(Setting.get('searchs'));

document.getElementById('btnSave').addEventListener('click', () => {
  ext.saveSearchs(JSON.parse(document.getElementById('taArea').value));
  ext.updateSearch();
});

document.getElementById('taArea').value = JSON.stringify(searchs);