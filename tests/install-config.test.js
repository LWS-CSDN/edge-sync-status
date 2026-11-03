const assert = require('node:assert/strict');
const { createHash, createPublicKey } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

// Removing the public key or changing only one side of the identity contract
// must fail: Edge derives its ID from the SPKI digest, not the install path.
test('RSA SPKI identity matches the native host allowed origin', () => {
  const manifest = JSON.parse(read('extension/manifest.json'));
  assert.ok(manifest.key, 'manifest.key must fix the unpacked extension identity');
  const der = Buffer.from(manifest.key, 'base64');
  const publicKey = createPublicKey({ key: der, format: 'der', type: 'spki' });
  assert.equal(publicKey.asymmetricKeyType, 'rsa');
  assert.ok(publicKey.asymmetricKeyDetails.modulusLength >= 2048);
  assert.deepEqual(publicKey.export({ format: 'der', type: 'spki' }), der);
  const hex = createHash('sha256').update(der).digest('hex').slice(0, 32);
  const extensionId = [...hex].map((n) => String.fromCharCode(97 + parseInt(n, 16))).join('');
  const host = JSON.parse(read('host/com.edge.syncstatus.json'));
  assert.deepEqual(host.allowed_origins, [`chrome-extension://${extensionId}/`]);
  assert.equal(host.name, 'com.edge.syncstatus');
  assert.equal(host.path, 'syncstatus-host.exe');
});

// These checks deliberately do not execute either installer or touch the registry.
// They catch machine-wide registration, a script-policy dependency, missing
// payload guards, and overwritten failure codes at this installation boundary.
function checkRegistryCommand(source, operation) {
  assert.doesNotMatch(source, /powershell|pwsh|ExecutionPolicy|HKLM|HKEY_LOCAL_MACHINE/i);
  assert.match(source, new RegExp('reg\\.exe"? ' + operation + ' "HKCU\\\\SOFTWARE\\\\Microsoft\\\\Edge\\\\NativeMessagingHosts\\\\com\\.edge\\.syncstatus"', 'i'));
  assert.match(source, /set "exitCode=%errorlevel%"/i);
  assert.match(source, /exit \/b %exitCode%/i);
}

test('registration uses HKCU reg.exe after checking both payload files', () => {
  const source = read('注册.cmd');
  checkRegistryCommand(source, 'add');
  assert.match(source, /set "manifestPath=%~dp0host\\com\.edge\.syncstatus\.json"/i);
  assert.match(source, /set "hostPath=%~dp0host\\syncstatus-host\.exe"/i);
  const registration = source.search(/reg\.exe/i);
  for (const variable of ['manifestPath', 'hostPath']) {
    const guard = source.indexOf(`if not exist "%${variable}%" (`);
    assert.ok(guard >= 0 && guard < registration, `${variable} must be checked before registration`);
    assert.match(source.slice(guard, registration), /set "exitCode=1"[\s\S]*goto :finish/i);
  }
  assert.match(source, /\/ve \/t REG_SZ \/d "%manifestPath%" \/f/i);
});

test('unregistration deletes only the current-user host and preserves errors', () => {
  const source = read('卸载.cmd');
  checkRegistryCommand(source, 'delete');
  assert.match(source, /com\.edge\.syncstatus" \/f/i);
});

test('native connection failure points users to the CMD registration entry', () => {
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { innerHTML: '', addEventListener() {} });
      return elements.get(id);
    },
    createElement() {
      return {
        set textContent(value) { this.innerHTML = String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;'); },
      };
    },
  };
  vm.runInNewContext(read('extension/popup.js'), {
    document,
    chrome: { runtime: { connectNative() { throw new Error('Native host unavailable'); } } },
  });
  const html = elements.get('summary').innerHTML;
  assert.match(html, /Native host unavailable/);
  assert.match(html, /注册\.cmd/);
  assert.doesNotMatch(html, /install\.ps1/);
});
