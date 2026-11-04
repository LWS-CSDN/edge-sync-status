# v1.0.2 界面语言切换设计与实现计划

用户要求插件实际页面提供中英文切换按钮并发布 v1.0.2；按既有偏好直接实施和发布。

**目标：** 主页面与帮助页可即时切换中文/英文，保存选择，更新动态数据与提示，随完整安装包发布。

**方案：** 新增共用 i18n.js，使用本地 localStorage 保存 zh/en，无需新增扩展权限。初次跟随 chrome.i18n.getUILanguage()，中文地区使用中文，其余使用英文；存储不可用时仍允许页面内切换。主页面缓存当前报告/错误/加载状态并按语言重绘；帮助页隐藏非当前语言区块。storage 事件同步已打开页面。

**范围：** 不改宿主协议、解析算法或 EXE，不改固定公钥。翻译应用文案与已知事件/数据类型，保留用户设备名、时间和原始诊断代码。

## 文件职责

- extension/i18n.js：中英词典、语言选择与保存、静态DOM翻译、页面间同步。
- extension/popup.js、popup.html、popup.css：按钮、缓存报告重绘和响应式工具栏。
- extension/help.html、使用说明.md：单语言帮助显示与双语使用说明。
- scripts/build_release.py、tests/test_release_package.py：将新语言脚本列入必需安装包文件。
- tests/browser-fixture.js、language.test.js：执行真实页面脚本的DOM边界测试；测试夹具留在tests。
- .github/workflows/release.yml：运行全部JS行为测试和新脚本语法检查。
- manifest、README、CHANGELOG：版本号、切换说明、升级说明和v1.0.2下载链接。

## 验证步骤

1. 先运行新增语言测试，确认旧版缺少按钮和英文渲染导致7项失败。
2. 实现后执行 `node --test tests/*.test.js`：切换完整报告、保存重开、帮助页与跨页同步、错误与加载状态、存储失败回退。
3. 执行 `python -I -B host/test_sync_status.py` 和 `python -I -B -m unittest discover -s tests -v`，确保后端协议与安装包测试通过。
4. 在临时独立Edge配置中打开真实页面，只在测试边界模拟Native Messaging：点击切换、检查英文报告、验证帮助语言与storage同步并截图。本机不执行注册/卸载。
5. 运行新旧JS语法检查、git diff --check，生成v1.0.2 ZIP和SHA256SUMS，检查新语言脚本已在安装包中。
6. 独立审查；提交并合回main，干净状态推送，再推v1.0.2标签。通过GitHub API确认Actions成功、双语Release及两个附件、latest版本指向。
