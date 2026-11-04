# 更新记录 / Changelog

## [1.0.1] - 2026-11-04

### 中文

Edge 同步状态是一个 Windows Edge 扩展，读取本机诊断记录，显示最近上传结果、各类数据成功上传时间、设备列表和近期同步事件。

v1.0.1 补充中英文介绍，并写清下载、启动、升级和日常使用步骤。功能与 v1.0.0 相同。

#### 下载与启动

1. 下载 [edge-sync-status-v1.0.1-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.1/edge-sync-status-v1.0.1-windows-x64.zip)，解压到准备长期保留的位置。完整包包含扩展和本机读取程序，不需要安装 Python。
2. 可选：下载 [SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.1/SHA256SUMS.txt)，在 PowerShell 中运行下面的命令，与校验文件比较。

```powershell
Get-FileHash .\edge-sync-status-v1.0.1-windows-x64.zip -Algorithm SHA256
```

3. 打开 `edge://extensions/`，打开「开发人员模式」，点击「加载解压缩的扩展」，选择解压目录里的 `extension` 文件夹。
4. 双击解压目录里的 `注册.cmd`。看到 `Registered com.edge.syncstatus` 后，点击工具栏图标启动。

如果工具栏没有图标，在 Edge「扩展」菜单中找到「Edge 同步状态」并固定。日常点击图标打开状态页，点击「刷新」重新读取。读取程序由 Edge 按需启动，不需要单独启动 EXE 或服务器。

从 v1.0.0 升级时，关闭状态页，将新包内的文件覆盖到原安装目录，在 `edge://extensions/` 重新加载扩展，再运行 `注册.cmd`。扩展 ID 不变；若使用新目录，先删除 Edge 中的旧扩展，再从新目录加载和注册。

注册只写当前用户的原生宿主登记，不需要管理员权限。移动整个解压目录后需要重新注册。卸载时从 Edge 删除扩展，再双击 `卸载.cmd`。

完整说明见 [README](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)。GitHub 自动附带的 Source code 压缩包供开发使用；普通用户请下载上面命名的完整 Windows 安装包。

#### 已知限制

- 当前只读取标准 Edge 用户数据目录中的 **Default** 配置文件，暂不支持其他配置文件、自定义用户数据目录、macOS 或 Linux。
- 「同步卡住」基于本机日志推断，新配置初始化也可能触发；应结合 Edge 的同步状态与后续记录确认，再决定是否排障。
- 设备名称识别可能不完整；跨年日志时间及部分事件详情解析可能有偏差。
- 本次复用仓库已有的 x64 `syncstatus-host.exe`，未重新构建，未进行数字签名。其 SHA-256 为 `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`。
- 发布验证覆盖自动测试、包内容与原生消息协议；尚未完成浏览器内真实安装与同步日志的端到端验收。

### English

Edge Sync Status is a Windows Edge extension that reads local diagnostics to show upload results, successful uploads by data type, connected devices, and recent sync events.

v1.0.1 adds bilingual documentation and clearer download, startup, upgrade, and daily-use instructions. Behavior is unchanged from v1.0.0.

#### Download and start

1. Download [edge-sync-status-v1.0.1-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.1/edge-sync-status-v1.0.1-windows-x64.zip) and extract it to a location you intend to keep. The package includes the extension and local reader; Python is not required.
2. Optional: download [SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.1/SHA256SUMS.txt), run the command below in PowerShell, and compare the result with the checksum file.

```powershell
Get-FileHash .\edge-sync-status-v1.0.1-windows-x64.zip -Algorithm SHA256
```

3. Open `edge://extensions/`, turn on Developer mode, choose "Load unpacked", and select the extracted `extension` folder.
4. Double-click `注册.cmd` in the extracted folder. After `Registered com.edge.syncstatus` appears, click the toolbar icon to start the extension.

If the icon is missing, find "Edge 同步状态" in Edge's Extensions menu and pin it. Click the icon to open the status page and "刷新" (Refresh) to read again. Edge starts the reader on demand; do not launch the EXE or a separate server. The main status page uses Chinese labels; the bilingual guide explains them in English.

To upgrade from v1.0.0, close the status tab, copy the new package contents over the original installation, reload the extension at `edge://extensions/`, and run `注册.cmd` again. The extension ID is unchanged. If using a new directory, remove the old extension from Edge first, then load and register the new location.

Registration writes only the current user's native-host entry and does not need administrator rights. Register again after moving the extracted folder. To uninstall, remove the extension from Edge, then double-click `卸载.cmd`.

The full guide is in the [README](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md). GitHub's automatic Source code archives are for development; users should download the named Windows package above.

#### Known limitations

- It currently reads only the **Default** profile in Edge's standard user-data directory. Other profiles, custom user-data directories, macOS, and Linux are not supported yet.
- "Possibly stuck" is inferred from local logs and can also be triggered by a new profile's initialization. Confirm it with Edge's sync status and later records before troubleshooting.
- Device-name recognition may be incomplete. Times crossing a year boundary, and some event details, may be parsed incorrectly.
- This release reuses the existing x64 `syncstatus-host.exe`. It was not rebuilt and is not digitally signed. Its SHA-256 is `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`.
- Release verification covers automated tests, package contents, and the native messaging protocol. An end-to-end install and sync-log check inside the browser has not been completed.

## [1.0.0] - 2026-11-03

Edge 同步状态首次发布，支持 Windows 10/11 x64 和 Microsoft Edge（Chromium 120 或更新版本）。First release of Edge Sync Status for Windows 10/11 x64 and Microsoft Edge (Chromium 120 or newer).

### 下载与安装 / Download and install

下载附件 **edge-sync-status-v1.0.0-windows-x64.zip**，解压到准备长期保留的位置。包内包含扩展和本机读取程序，不需要安装 Python。Download **edge-sync-status-v1.0.0-windows-x64.zip** and extract it to a location you intend to keep. It includes the extension and local reader; Python is not required.

1. 打开 `edge://extensions/`，打开「开发人员模式」，点击「加载解压缩的扩展」，选择解压目录里的 `extension` 文件夹。Open `edge://extensions/`, turn on Developer mode, choose "Load unpacked", and select the extracted `extension` folder.
2. 双击解压目录里的 `注册.cmd`，看到 `Registered com.edge.syncstatus` 后点击扩展图标。Double-click `注册.cmd` in the extracted folder. After `Registered com.edge.syncstatus` appears, click the extension icon.

注册只写当前用户的原生宿主登记，不需要管理员权限。移动整个解压目录后需要重新注册。卸载时从 Edge 删除扩展，再运行 `卸载.cmd`。Registration writes only the current user's native-host entry and does not need administrator rights. Register again after moving the extracted folder. To uninstall, remove the extension from Edge, then run `卸载.cmd`.

### 本次发布 / This release

- 查看本机最近一次上传结果、各类型最近成功上传时间、设备最近出现时间与近期同步事件。View the latest local upload result, the latest successful upload time by data type, when devices were last seen, and recent sync events.
- 固定扩展 ID，使不同解压路径使用相同的原生消息连接配置。The extension ID is fixed, so different extraction paths use the same native-messaging configuration.
- 注册与卸载入口直接使用 Windows 当前用户登记，减少对 PowerShell 执行策略的依赖。The register and unregister entries write the current-user Windows registration directly, reducing dependence on the PowerShell execution policy.
- 统一安装和故障提示，明确不需要 Python。Installation and failure guidance is consistent and states that Python is not required.
- 提供完整 Windows x64 ZIP、SHA256SUMS.txt 和后续标签自动发布流程。It provides a complete Windows x64 ZIP, SHA256SUMS.txt, and automatic publishing for later tags.

### 校验下载 / Verify the download

在 PowerShell 中运行下列命令，将结果与同页 `SHA256SUMS.txt` 的 ZIP 校验值比较。Run the following command in PowerShell and compare the result with the ZIP checksum in `SHA256SUMS.txt` on the same page:

```powershell
Get-FileHash .\edge-sync-status-v1.0.0-windows-x64.zip -Algorithm SHA256
```

GitHub 自动附带的 Source code 压缩包供开发使用；普通用户请下载上面命名的完整 Windows 安装包。GitHub's automatic Source code archives are for development; users should download the named complete Windows package above.

### 已知限制 / Known limitations

- 当前只读取标准 Edge 用户数据目录中的 **Default** 配置文件，暂不支持其他配置文件、自定义用户数据目录、macOS 或 Linux。It currently reads only the **Default** profile in Edge's standard user-data directory. Other profiles, custom user-data directories, macOS, and Linux are not supported yet.
- 「同步卡住」基于本机日志推断，新配置初始化也可能触发；应结合 Edge 的同步状态与后续记录确认，再决定是否排障。"Possibly stuck" is inferred from local logs and can also be triggered by a new profile's initialization. Confirm it with Edge's sync status and later records before troubleshooting.
- 设备名称识别可能不完整；跨年日志时间及部分事件详情解析可能有偏差。Device-name recognition may be incomplete. Times crossing a year boundary, and some event details, may be parsed incorrectly.
- 本次复用仓库已有的 x64 `syncstatus-host.exe`，未重新构建，未进行数字签名。其 SHA-256 为 `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`。This release reuses the existing x64 `syncstatus-host.exe`. It was not rebuilt and is not digitally signed. Its SHA-256 is `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`.
- 发布验证覆盖自动测试、包内容与原生消息协议；尚未完成浏览器内真实安装与同步日志的端到端验收。Release verification covers automated tests, package contents, and the native messaging protocol. An end-to-end install and sync-log check inside the browser has not been completed.
