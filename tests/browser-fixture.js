// A small DOM boundary for running the shipped scripts without installing Edge's host.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

class Element {
  constructor(tag, attributes = {}) {
    this.tagName = tag;
    this.attributes = attributes;
    this.hidden = false;
    this.listeners = {};
    this.innerHTML = '';
  }
  set textContent(value) {
    this.innerHTML = String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
  get textContent() { return this.innerHTML; }
  setAttribute(key, value) { this.attributes[key] = String(value); }
  getAttribute(key) { return this.attributes[key] ?? null; }
  addEventListener(event, callback) { this.listeners[event] = callback; }
  click() { this.listeners.click?.(); }
}

function openPage({ page = 'popup.html', storage = new Map(), uiLanguage = 'zh-CN', failStorage = false,
                    connectionError = null } = {}) {
  const html = fs.readFileSync(path.join(root, 'extension', page), 'utf8');
  const elements = [...html.matchAll(/<([a-z][\w-]*)([^>]*)>/gi)].map((match) => {
    const attrs = Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]));
    return new Element(match[1], attrs);
  });
  const document = {
    title: '',
    documentElement: elements.find((el) => el.tagName === 'html'),
    getElementById(id) { return elements.find((el) => el.attributes.id === id) || null; },
    querySelectorAll(selector) {
      return elements.filter((el) => selector === '[data-i18n]' ? 'data-i18n' in el.attributes :
        selector === '[data-language]' ? 'data-language' in el.attributes : false);
    },
    createElement(tag) { return new Element(tag); },
  };
  const requests = [];
  const ports = [];
  const windowEvents = {};
  const context = vm.createContext({
    document, navigator: { language: uiLanguage },
    localStorage: {
      getItem(key) { if (failStorage) throw Error('storage unavailable'); return storage.get(key) ?? null; },
      setItem(key, value) { if (failStorage) throw Error('storage unavailable'); storage.set(key, value); },
    },
    addEventListener(event, callback) { windowEvents[event] = callback; },
    chrome: {
      i18n: { getUILanguage() { return uiLanguage; } },
      runtime: {
        connectNative() {
          if (connectionError) throw Error(connectionError);
          const callbacks = {};
          const port = {
            onDisconnect: { addListener(fn) { callbacks.disconnect = fn; } },
            onMessage: { addListener(fn) { callbacks.message = fn; } },
            postMessage(request) { requests.push(request); },
            disconnect() {},
          };
          ports.push({ port, callbacks });
          return port;
        },
      },
    },
  });
  context.window = context;
  // Loading only referenced scripts also detects a missing script tag in the real page.
  for (const script of html.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g)) {
    const filename = path.join(root, 'extension', script[1]);
    if (fs.existsSync(filename)) vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  }
  return {
    context, document, elements, requests,
    element(id) { return document.getElementById(id); },
    report(report) { ports.at(-1).callbacks.message(report); },
    storageEvent(event) { windowEvents.storage?.(event); },
  };
}
module.exports = { openPage };
