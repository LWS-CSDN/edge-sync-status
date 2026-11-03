# 首次 GitHub Release 实现计划

> **面向 AI 代理的工作者：** 安装与打包任务分别由工作流子代理执行，主会话整合文档、验证、提交与发布。

**目标：** 发布可安装的 v1.0.0 Windows x64 ZIP，并让后续 v* 标签自动发布。

**架构：** 固定扩展公钥及原生宿主允许来源；CMD 直接调用当前用户注册表登记；Python 标准库白名单打包；Windows GitHub Actions 验证并上传 Release。

**技术栈：** Chromium MV3、Windows CMD/PowerShell、Python unittest/zipfile/hashlib、GitHub Actions。

---

### 任务 1：可移植安装

文件：extension/manifest.json、host/com.edge.syncstatus.json、注册.cmd、卸载.cmd、extension/popup.js、extension/使用说明.md、tests/install-config.test.js。

- [ ] 对公钥缺失与允许来源不一致写失败测试并运行。
- [ ] 生成公共 SPKI key，仅保存公钥；计算固定 ID 并同步允许来源。
- [ ] 注册入口用 reg.exe 登记 HKCU，先检查宿主与清单；卸载入口只删除同一项，不改执行策略。
- [ ] 更正错误提示与说明，运行安装配置测试。

固定 ID 规则：

```python
key_hash = hashlib.sha256(base64.b64decode(manifest['key'], validate=True)).hexdigest()[:32]
extension_id = ''.join(chr(ord('a') + int(c, 16)) for c in key_hash)
assert native_manifest['allowed_origins'] == [f'chrome-extension://{extension_id}/']
```

### 任务 2：运行包与自动发布

文件：scripts/build_release.py、tests/test_release_package.py、tests/test_native_host.py、.github/workflows/release.yml、.gitignore。

- [ ] 先测试实际 ZIP 条目、内容哈希、错误版本标签与必需文件缺失。
- [ ] 实现白名单打包，缺文件、ID不一致或版本不匹配均非零退出。
- [ ] 对现有 EXE 发送不存在配置文件的长度前缀 JSON 请求，检查响应帧与状态。
- [ ] Windows CI 跑测试、打包、保存构件；仅 v* 标签的发布任务写 Release。

验证命令：

```powershell
python -I -B host/test_sync_status.py
python -I -B -m unittest discover -s tests -v
python -I -B scripts/build_release.py --tag v1.0.0
```

### 任务 3：文档、复核与发布

文件：README.md、CHANGELOG.md、extension/help.html、extension/popup.html、本设计和计划。

- [ ] 增加 Release 下载链接、校验方法、Default 配置限制、保守状态说明。
- [ ] 运行全部测试、node --check、git diff --check，独立审查发布链路。
- [ ] 中文 Conventional Commit；确认干净后将变更合入 main 并推送，再推送 v1.0.0 标签。
- [ ] 用公开 GitHub API 查看 Actions 和 Release，确认 ZIP 与 SHA256SUMS.txt 已发布。

发布命令：

```powershell
git status --short
git push origin main
git tag -a v1.0.0 -m "发布 v1.0.0 Windows x64 安装包"
git push origin v1.0.0
```

本机不执行注册和卸载；不运行刚下载的 CLI，不改注册表与执行策略。Release 中注明沿用已有未签名 EXE 和真实浏览器安装验收的限制。
