const HOST = 'com.edge.syncstatus';
const i18n = window.EdgeI18n;
const t = (key, values) => i18n.t(key, values);
const summary = document.getElementById('summary');
const types = document.getElementById('types');
const devices = document.getElementById('devices');
const events = document.getElementById('events');
let view = { state: 'loading' };

function escapeText(value) {
  const node = document.createElement('span');
  node.textContent = value == null ? '' : String(value);
  return node.innerHTML;
}

function renderSummary(report) {
  const status = ['ok', 'stuck', 'idle', 'unknown', 'error'].includes(report.status) ? report.status : 'unknown';
  document.title = `${t('appName')} · ${t(`status.${status}`)}`;
  const lastUpload = report.lastUpload ? t('lastUpload', { time: report.lastUpload }) : t('noUpload');
  summary.innerHTML =
    `<span class="badge ${status}">${escapeText(t(`status.${status}`))}</span>` +
    `<p class="summary-line">${escapeText(t(`summary.${status}`))}</p>` +
    `<p class="meta">${escapeText(lastUpload)} · ${escapeText(t('generatedAt', { time: report.generatedAt || '' }))}</p>`;
}

function renderTypes(list) {
  if (!list || !list.length) {
    types.innerHTML = `<p class="muted">${escapeText(t('noTypes'))}</p>`;
    return;
  }
  const rows = list.map((item) =>
    `<tr><td class="name">${escapeText(i18n.typeName(item.type))}</td>` +
    `<td class="time">${escapeText(item.time || t('unknownTime'))}</td></tr>`);
  types.innerHTML = `<table>${rows.join('')}</table>`;
}

function renderDevices(list) {
  if (!list || !list.length) {
    devices.innerHTML = `<p class="muted">${escapeText(t('noDevices'))}</p>`;
    return;
  }
  const rows = list.map((device) => {
    const seen = device.lastSeen || t('unknownTime');
    const flag = device.stale ? `<span class="stale"> ${escapeText(t('stale'))}</span>` : '';
    return `<tr><td><div class="name">${escapeText(device.name)}</div>` +
      `<div class="meta">${escapeText(device.os)} · Edge ${escapeText(device.version)}</div></td>` +
      `<td class="time">${escapeText(seen)}${flag}` +
      `${device.registrations > 1 ? `<div class="meta">${escapeText(t('registrations', { count: device.registrations }))}</div>` : ''}</td></tr>`;
  });
  devices.innerHTML = `<table>${rows.join('')}</table>`;
}

function eventDetail(value) {
  return String(value || '')
    .replace(/\b(Bookmarks|History|Preferences|Sessions|Device Info|Passwords|Autofill|Extensions|Tabs)\b/g,
      (name) => i18n.typeName(name))
    .replace(/Received (\d+) update\(s\)/g, (_, count) => t('receivedCount', { count }))
    .replace(/(\d+)\s*条/g, (_, count) => t('itemCount', { count }))
    .replace(/，\s*/g, i18n.language === 'en' ? ', ' : '，');
}

function eventAction(action) {
  if (String(action).startsWith('Commit.')) {
    return t('typeUpload', { type: i18n.typeName(action.slice('Commit.'.length)) });
  }
  const key = `event.${action}`;
  const translated = t(key);
  return translated === key ? action : translated;
}

function renderEvents(list) {
  if (!list || !list.length) {
    events.innerHTML = `<p class="muted">${escapeText(t('noEvents'))}</p>`;
    return;
  }
  const rows = list.slice().reverse().map((event) => {
    const detail = event.detail ? ` · ${escapeText(eventDetail(event.detail))}` : '';
    const resultKey = `result.${event.result}`;
    const result = t(resultKey) === resultKey ? event.result : t(resultKey);
    return `<tr><td class="time">${escapeText((event.time || '').slice(5))}</td>` +
      `<td>${escapeText(eventAction(event.action))}<span class="result ${escapeText(event.result)}"> ${escapeText(result)}</span>` +
      `<span class="meta">${detail}</span></td></tr>`;
  });
  events.innerHTML = `<table>${rows.join('')}</table>`;
}

function connectionMessage(message) {
  const known = {
    'Specified native messaging host not found.': 'nativeMissing',
    'Access to the specified native messaging host is forbidden.': 'nativeForbidden',
    'Native host has exited.': 'nativeExited',
    'Error when communicating with the native messaging host.': 'nativeCommunication',
  };
  return known[message] ? t(known[message]) : message || t('connectionFailed');
}

function renderError(message) {
  document.title = `${t('appName')} · ${t('status.error')}`;
  summary.innerHTML =
    `<span class="badge error">${escapeText(t('status.error'))}</span>` +
    `<p class="summary-line">${escapeText(connectionMessage(message))}</p>` +
    `<p class="meta">${escapeText(t('registerHint'))}</p>`;
  types.innerHTML = '';
  devices.innerHTML = '';
  events.innerHTML = '';
}

function render() {
  if (view.state === 'error') return renderError(view.message);
  if (view.state === 'loading') {
    document.title = t('appName');
    summary.innerHTML = `<p class="muted">${escapeText(t('loading'))}</p>`;
    return;
  }
  const report = view.report;
  renderSummary(report);
  renderTypes(report.types);
  renderDevices(report.devices);
  renderEvents(report.recentEvents);
}

function load() {
  view = { state: 'loading' };
  render();
  let port;
  const failed = (message) => {
    view = { state: 'error', message };
    render();
  };
  try {
    port = chrome.runtime.connectNative(HOST);
  } catch (error) {
    failed(error.message);
    return;
  }
  let gotReport = false;
  port.onDisconnect.addListener(() => {
    if (gotReport) return;
    const reason = chrome.runtime.lastError && chrome.runtime.lastError.message;
    failed(reason);
  });
  port.onMessage.addListener((report) => {
    gotReport = true;
    view = { state: 'report', report };
    render();
  });
  port.postMessage({ profile: 'Default' });
}

document.getElementById('refresh').addEventListener('click', load);
i18n.onChange(render);
load();
