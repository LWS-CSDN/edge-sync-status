const assert = require('node:assert/strict');
const test = require('node:test');
const { openPage } = require('./browser-fixture');

const report = {
  status: 'ok', summary: '同步正常，最近一次上传已被服务器接受',
  generatedAt: '2026-11-04 12:00', lastUpload: '2026-11-04 11:59',
  types: [{ type: 'Bookmarks', time: '2026-11-04 11:59' }],
  devices: [{ name: '<img src=x onerror=alert(1)>', os: 'Windows', version: '142.0',
    lastSeen: '', stale: true, registrations: 2 }],
  recentEvents: [{ action: 'Commit Response', result: 'Success', detail: 'Bookmarks，2 条',
    time: '2026-11-04 11:59' }],
};

// Without UI-language detection English users see untranslated headings and status text.
test('English browser gets English static labels, reports, types, devices and events', () => {
  const page = openPage({ uiLanguage: 'en-US' });
  page.report(report);
  assert.match(page.document.title, /Edge Sync Status/);
  assert.equal(page.element('refresh').textContent, 'Refresh');
  assert.equal(page.document.documentElement.lang, 'en');
  assert.match(page.element('summary').innerHTML, /Sync OK/);
  assert.doesNotMatch(page.element('summary').innerHTML, /同步正常/);
  assert.match(page.element('types').innerHTML, /Bookmarks/);
  assert.match(page.element('devices').innerHTML, /14 days|14-day/);
  assert.match(page.element('devices').innerHTML, /2 registrations/);
  assert.doesNotMatch(page.element('devices').innerHTML, /<img/);
  assert.match(page.element('events').innerHTML, /Upload response/);
  assert.match(page.element('events').innerHTML, /2 items/);
  assert.doesNotMatch(page.element('events').innerHTML, /条/);
});

// Switching must re-render the already fetched report, rather than only the button.
test('language button updates the complete existing report without re-reading the host', () => {
  const page = openPage({ uiLanguage: 'zh-CN' });
  page.report(report);
  const button = page.element('language-toggle');
  assert.ok(button, 'the status page needs a visible language switch');
  assert.match(page.element('types').innerHTML, /收藏夹/);
  button.click();
  assert.equal(button.textContent, '中文');
  assert.equal(page.element('refresh').textContent, 'Refresh');
  assert.match(page.element('summary').innerHTML, /Sync OK/);
  assert.match(page.element('types').innerHTML, /Bookmarks/);
  assert.match(page.element('events').innerHTML, /Upload response/);
  assert.equal(page.requests.length, 1);
  button.click();
  assert.equal(button.textContent, 'English');
  assert.match(page.element('summary').innerHTML, /同步正常/);
  assert.match(page.element('events').innerHTML, /上传响应/);
});

// A manual choice must survive reopening and be shared with the help page.
test('saved language overrides browser language on both the status and help pages', () => {
  const storage = new Map();
  const page = openPage({ storage, uiLanguage: 'zh-CN' });
  assert.ok(page.element('language-toggle'));
  page.element('language-toggle').click();
  const reopened = openPage({ storage, uiLanguage: 'zh-CN' });
  assert.equal(reopened.element('refresh').textContent, 'Refresh');
  const help = openPage({ page: 'help.html', storage, uiLanguage: 'zh-CN' });
  const sections = help.elements.filter((el) => 'data-language' in el.attributes);
  assert.ok(sections.some((el) => el.attributes['data-language'] === 'en'));
  for (const section of sections) assert.equal(section.hidden, section.attributes['data-language'] !== 'en');
  assert.match(help.document.title, /Help/);
  help.element('language-toggle').click();
  for (const section of sections) assert.equal(section.hidden, section.attributes['data-language'] !== 'zh');
  assert.equal(openPage({ storage, uiLanguage: 'en-US' }).element('refresh').textContent, '刷新');
});

test('language switch also updates errors and loading text without another host connection', () => {
  const errorPage = openPage({ uiLanguage: 'zh-CN', connectionError: 'Native host unavailable' });
  assert.ok(errorPage.element('language-toggle'));
  errorPage.element('language-toggle').click();
  assert.match(errorPage.element('summary').innerHTML, /Read failed/);
  assert.match(errorPage.element('summary').innerHTML, /Native host unavailable/);
  assert.match(errorPage.element('summary').innerHTML, /register\.cmd/);
  assert.doesNotMatch(errorPage.element('summary').innerHTML, /确认|读取失败/);
  const loading = openPage({ uiLanguage: 'zh-CN' });
  loading.element('language-toggle').click();
  assert.match(loading.element('summary').innerHTML, /Reading/);
  assert.equal(loading.requests.length, 1);
});

test('all normal status messages use the selected language instead of raw host Chinese', () => {
  const page = openPage({ uiLanguage: 'en-US' });
  for (const status of ['ok', 'stuck', 'idle', 'unknown', 'error']) {
    page.report({ ...report, status, summary: '读取失败：中文诊断', devices: [], types: [], recentEvents: [] });
    const html = page.element('summary').innerHTML;
    assert.doesNotMatch(html, /读取失败|中文诊断/);
    assert.match(page.element('devices').innerHTML, /No device records/);
    assert.match(page.element('types').innerHTML, /No successful uploads/);
    assert.match(page.element('events').innerHTML, /No sync records/);
  }
});

test('blocked or invalid storage leaves the page usable with browser defaults', () => {
  const blocked = openPage({ uiLanguage: 'en-GB', failStorage: true });
  assert.equal(blocked.element('refresh').textContent, 'Refresh');
  blocked.element('language-toggle').click();
  assert.equal(blocked.element('refresh').textContent, '刷新');
  const invalid = openPage({ storage: new Map([['edge-sync-status-language', 'bogus']]), uiLanguage: 'zh-TW' });
  assert.equal(invalid.element('refresh').textContent, '刷新');
});

test('language changes in another extension page update the open status tab', () => {
  const storage = new Map();
  const page = openPage({ storage, uiLanguage: 'zh-CN' });
  page.report(report);
  storage.set('edge-sync-status-language', 'en');
  page.storageEvent({ key: 'edge-sync-status-language', newValue: 'en' });
  assert.equal(page.element('refresh').textContent, 'Refresh');
  assert.match(page.element('summary').innerHTML, /Sync OK/);
});
