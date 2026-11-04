// Shared by the status and help pages. Preferences stay on this extension's origin.
(() => {
  const storageKey = 'edge-sync-status-language';
  const messages = {
    zh: {
      appName: 'Edge 同步状态', refresh: '刷新', helpTitle: '使用说明',
      profileNotice: '当前读取：Edge 默认配置文件（Default）。其他配置文件暂不支持。',
      typesHeading: '各类数据最近一次成功上传', devicesHeading: '设备', eventsHeading: '最近的同步记录',
      loading: '正在读取本机同步记录…',
      'status.ok': '同步正常', 'status.stuck': '同步卡住', 'status.idle': '最近无上传',
      'status.unknown': '没有记录', 'status.error': '读取失败',
      'summary.ok': '同步正常，最近一次上传已被服务器接受',
      'summary.stuck': '发现新客户端初始化记录，尚无成功上传；请结合 Edge 同步状态确认。',
      'summary.idle': '有过同步记录，但最近没有上传', 'summary.unknown': '没有找到同步记录',
      'summary.error': '无法读取同步记录，请检查本机读取程序及注册配置。',
      lastUpload: '上次成功上传 {time}', noUpload: '没有成功上传的记录', generatedAt: '读取于 {time}',
      noTypes: '还没有成功上传的记录。', noDevices: '没有找到设备记录。', noEvents: '没有同步记录。',
      unknownTime: '时间未知', stale: '已超过 14 天', registrations: '重复登记 {count} 次',
      registerHint: '确认已经在解压目录中双击「install.cmd」注册本机程序；移动目录后需要重新注册。',
      connectionFailed: '没有连上本机程序。', nativeMissing: '未找到本机读取程序，请先运行install.cmd。',
      nativeForbidden: '本机读取程序拒绝连接，请检查扩展 ID 和注册配置。',
      nativeExited: '本机读取程序意外退出。', nativeCommunication: '与本机读取程序通信失败。',
      switchLanguage: 'Switch to English', itemCount: '{count} 条', receivedCount: '收到 {count} 条更新',
      'type.Bookmarks': '收藏夹', 'type.History': '历史记录', 'type.Preferences': '设置',
      'type.Sessions': '打开的标签页', 'type.Device Info': '设备信息', 'type.Passwords': '密码',
      'type.Autofill': '自动填充', 'type.Extensions': '扩展', 'type.Tabs': '标签页',
      'event.Commit Request': '上传请求', 'event.Commit Response': '上传响应',
      'event.Initial GetUpdates': '初始化下载', 'event.GetUpdates Request': '下载请求',
      'event.GetUpdates Response': '下载响应', typeUpload: '上传：{type}',
      'result.Success': '成功', 'result.SYNC_SERVER_OK': '成功', 'result.Failure': '失败',
      'result.Failed': '失败', 'result.Error': '错误',
    },
    en: {
      appName: 'Edge Sync Status', refresh: 'Refresh', helpTitle: 'Help',
      profileNotice: 'Reading the default Edge profile (Default). Other profiles are not supported yet.',
      typesHeading: 'Latest successful upload by data type', devicesHeading: 'Devices', eventsHeading: 'Recent sync events',
      loading: 'Reading local sync records…',
      'status.ok': 'Sync OK', 'status.stuck': 'Possibly stuck', 'status.idle': 'No recent upload',
      'status.unknown': 'No records', 'status.error': 'Read failed',
      'summary.ok': 'The latest upload was accepted by the server.',
      'summary.stuck': 'A new-client initialization was found without a successful upload. Check Edge\'s sync status to confirm.',
      'summary.idle': 'Sync records exist, but there is no recent upload.', 'summary.unknown': 'No sync records were found.',
      'summary.error': 'Unable to read sync records. Check the local reader and its registration.',
      lastUpload: 'Last successful upload: {time}', noUpload: 'No successful upload recorded', generatedAt: 'Read at {time}',
      noTypes: 'No successful uploads recorded yet.', noDevices: 'No device records found.', noEvents: 'No sync records.',
      unknownTime: 'Unknown time', stale: 'Not seen for over 14 days', registrations: '{count} registrations',
      registerHint: 'Double-click install.cmd in the extracted folder to register the local reader. Register again after moving the folder.',
      connectionFailed: 'Could not connect to the local reader.', nativeMissing: 'The local reader was not found. Run install.cmd first.',
      nativeForbidden: 'Access to the local reader was denied. Check the extension ID and registration.',
      nativeExited: 'The local reader exited unexpectedly.', nativeCommunication: 'Communication with the local reader failed.',
      switchLanguage: '切换为中文', itemCount: '{count} items', receivedCount: 'Received {count} updates',
      'type.Bookmarks': 'Bookmarks', 'type.History': 'History', 'type.Preferences': 'Settings',
      'type.Sessions': 'Open tabs', 'type.Device Info': 'Device info', 'type.Passwords': 'Passwords',
      'type.Autofill': 'Autofill', 'type.Extensions': 'Extensions', 'type.Tabs': 'Tabs',
      'event.Commit Request': 'Upload request', 'event.Commit Response': 'Upload response',
      'event.Initial GetUpdates': 'Initial download', 'event.GetUpdates Request': 'Download request',
      'event.GetUpdates Response': 'Download response', typeUpload: 'Upload: {type}',
      'result.Success': 'Success', 'result.SYNC_SERVER_OK': 'Success', 'result.Failure': 'Failure',
      'result.Failed': 'Failed', 'result.Error': 'Error',
    },
  };
  const listeners = new Set();
  function browserLanguage() {
    let locale;
    try { locale = chrome.i18n.getUILanguage(); } catch { /* fall back to navigator */ }
    return String(locale || globalThis.navigator?.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }
  let language = browserLanguage();
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'zh' || saved === 'en') language = saved;
  } catch { /* the current page still supports switching without persistent storage */ }

  function t(key, values = {}) {
    const template = messages[language][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
  }
  function apply() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = document.getElementById('summary') ? t('appName') : `${t('helpTitle')} · ${t('appName')}`;
    for (const element of document.querySelectorAll('[data-i18n]')) {
      element.textContent = t(element.getAttribute('data-i18n'));
    }
    for (const element of document.querySelectorAll('[data-language]')) {
      element.hidden = element.getAttribute('data-language') !== language;
    }
    const button = document.getElementById('language-toggle');
    if (button) {
      button.textContent = language === 'zh' ? 'English' : '中文';
      button.setAttribute('aria-label', t('switchLanguage'));
      button.setAttribute('title', t('switchLanguage'));
    }
  }
  function setLanguage(next, persist = true) {
    if (next !== 'zh' && next !== 'en') return;
    language = next;
    if (persist) {
      try { localStorage.setItem(storageKey, language); } catch { /* keep the in-page choice */ }
    }
    apply();
    for (const callback of listeners) callback();
  }
  window.EdgeI18n = {
    get language() { return language; },
    t,
    typeName(name) { return messages[language][`type.${name}`] ?? String(name || ''); },
    onChange(callback) { listeners.add(callback); },
    setLanguage,
  };
  document.getElementById('language-toggle')?.addEventListener('click', () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  });
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) {
      setLanguage(event.newValue === 'zh' || event.newValue === 'en' ? event.newValue : browserLanguage(), false);
    }
  });
  apply();
})();
