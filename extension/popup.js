const HOST = 'com.edge.syncstatus';

const STATUS_TEXT = {
  ok: '同步正常',
  stuck: '同步卡住',
  idle: '最近无上传',
  unknown: '没有记录',
  error: '读取失败',
};

const TYPE_NAMES = {
  Bookmarks: '收藏夹',
  History: '历史记录',
  Preferences: '设置',
  Sessions: '打开的标签页',
  'Device Info': '设备信息',
  Passwords: '密码',
  Autofill: '自动填充',
  Extensions: '扩展',
  Tabs: '标签页',
};

const summary = document.getElementById('summary');
const types = document.getElementById('types');
const devices = document.getElementById('devices');
const events = document.getElementById('events');

function typeName(name) {
  return TYPE_NAMES[name] || name;
}

function escapeText(value) {
  const node = document.createElement('span');
  node.textContent = value == null ? '' : String(value);
  return node.innerHTML;
}

function renderSummary(report) {
  document.title = 'Edge 同步状态 · ' + (STATUS_TEXT[report.status] || report.status || '');
  const label = STATUS_TEXT[report.status] || '未知';
  const lastUpload = report.lastUpload ? `上次成功上传 ${report.lastUpload}` : '没有成功上传的记录';
  summary.innerHTML =
    `<span class="badge ${escapeText(report.status)}">${escapeText(label)}</span>` +
    `<p class="summary-line">${escapeText(report.summary || '')}</p>` +
    `<p class="meta">${escapeText(lastUpload)} · 读取于 ${escapeText(report.generatedAt || '')}</p>`;
}

function renderTypes(list) {
  if (!list || !list.length) {
    types.innerHTML = '<p class="muted">还没有成功上传的记录。</p>';
    return;
  }
  const rows = list.map((item) =>
    `<tr><td class="name">${escapeText(typeName(item.type))}</td>` +
    `<td class="time">${escapeText(item.time || '时间未知')}</td></tr>`);
  types.innerHTML = `<table>${rows.join('')}</table>`;
}

function renderDevices(list) {
  if (!list || !list.length) {
    devices.innerHTML = '<p class="muted">没有找到设备记录。</p>';
    return;
  }
  const rows = list.map((device) => {
    const seen = device.lastSeen || '时间未知';
    const flag = device.stale ? '<span class="stale"> 已超过 14 天</span>' : '';
    return `<tr><td><div class="name">${escapeText(device.name)}</div>` +
      `<div class="meta">${escapeText(device.os)} · Edge ${escapeText(device.version)}</div></td>` +
      `<td class="time">${escapeText(seen)}${flag}` +
      `${device.registrations > 1 ? `<div class="meta">重复登记 ${device.registrations} 次</div>` : ''}</td></tr>`;
  });
  devices.innerHTML = `<table>${rows.join('')}</table>`;
}

function renderEvents(list) {
  if (!list || !list.length) {
    events.innerHTML = '<p class="muted">没有同步记录。</p>';
    return;
  }
  const rows = list.slice().reverse().map((event) => {
    const detail = event.detail ? ` · ${escapeText(event.detail)}` : '';
    return `<tr><td class="time">${escapeText((event.time || '').slice(5))}</td>` +
      `<td>${escapeText(event.action)}<span class="result ${escapeText(event.result)}"> ${escapeText(event.result)}</span>` +
      `<span class="meta">${detail}</span></td></tr>`;
  });
  events.innerHTML = `<table>${rows.join('')}</table>`;
}

function renderError(message) {
  summary.innerHTML =
    '<span class="badge error">读取失败</span>' +
    `<p class="summary-line">${escapeText(message)}</p>` +
    '<p class="meta">确认已经运行过 install.ps1 注册本机程序。</p>';
  types.innerHTML = '';
  devices.innerHTML = '';
  events.innerHTML = '';
}

function load() {
  summary.innerHTML = '<p class="muted">正在读取本机同步记录…</p>';
  let port;
  try {
    port = chrome.runtime.connectNative(HOST);
  } catch (error) {
    renderError(error.message);
    return;
  }

  let gotReport = false;
  const failed = (message) => renderError(message || '没有连上本机程序。');
  port.onDisconnect.addListener(() => {
    if (gotReport) return;
    const reason = chrome.runtime.lastError && chrome.runtime.lastError.message;
    failed(reason);
  });
  port.onMessage.addListener((report) => {
    gotReport = true;
    renderSummary(report);
    renderTypes(report.types);
    renderDevices(report.devices);
    renderEvents(report.recentEvents);
  });
  port.postMessage({ profile: 'Default' });
}

document.getElementById('refresh').addEventListener('click', load);
load();
