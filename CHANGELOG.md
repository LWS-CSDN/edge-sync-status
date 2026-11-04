# 更新记录 / Changelog

## [1.0.4] - 2026-11-04

### 中文

安装与卸载统一为一对入口：**install.cmd / uninstall.cmd**。

- 将注册入口改名为 `install.cmd`，与 `uninstall.cmd` 对应。
- 删除已弃用的 `install.ps1`，同时移除功能重复的 `register.ps1` 和 `uninstall.ps1`。仓库和新安装包只保留两个 CMD 入口。
- 同步中英文界面提示、帮助文档和打包清单。

下载 [edge-sync-status-v1.0.4-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/edge-sync-status-v1.0.4-windows-x64.zip)，完整解压，在 `edge://extensions/` 打开开发人员模式、加载包内 `extension` 文件夹，再双击 **install.cmd**。点击扩展图标打开状态页，顶部可切换中英文。卸载时先从 Edge 删除扩展，再运行 **uninstall.cmd**。

升级时关闭状态页，覆盖原安装目录，在 Edge 中重新加载扩展，再运行 `install.cmd`。覆盖解压不会自动删除旧文件，旧版残留的 `register.cmd` 和三个 PowerShell 脚本可以手动删除。读取程序和扩展 ID 不变，仍不需要 Python 或管理员权限。

[SHA-256 校验文件](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/SHA256SUMS.txt) · [完整中英文说明](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)

### English

Installation and uninstallation now use a matching pair: **install.cmd / uninstall.cmd**.

- Rename the registration entry point to `install.cmd`, paired with `uninstall.cmd`.
- Remove the deprecated `install.ps1` and the redundant `register.ps1` and `uninstall.ps1`. The repository and new package contain only the two CMD entry points.
- Update interface messages, bilingual help, and the release package file list.

Download [edge-sync-status-v1.0.4-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/edge-sync-status-v1.0.4-windows-x64.zip) and extract it completely. At `edge://extensions/`, enable Developer mode and load the included `extension` folder, then double-click **install.cmd**. Open the status page from the extension icon and use the language button at the top. To uninstall, remove the extension from Edge, then run **uninstall.cmd**.

To upgrade, close the status tab, copy the new files over the installation folder, reload the extension in Edge, and run `install.cmd`. Extracting over an old installation does not remove old files: you can delete the leftover `register.cmd` and the three PowerShell scripts manually. The native reader and extension ID are unchanged. Python and administrator rights are not required.

[SHA-256 checksums](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/SHA256SUMS.txt) · [Full bilingual guide](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)

## [1.0.3] - 2026-11-04

### 中文

注册和卸载入口统一使用英文文件名，中文和英文界面使用相同的命令：

- **register.cmd**：注册本机读取程序，首次安装或移动目录后运行一次。
- **uninstall.cmd**：移除本机读取程序的当前用户登记。
- 更新主界面提示、中英文帮助、README 和安装包清单，避免文件名与说明不一致。

下载 [edge-sync-status-v1.0.3-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.3/edge-sync-status-v1.0.3-windows-x64.zip)，解压后在 `edge://extensions/` 打开开发人员模式并加载 `extension` 文件夹，再双击 `register.cmd`。点击工具栏图标打开状态页，右上角可切换中英文；无需单独启动 EXE 或服务器。

旧版升级：关闭状态页，将新包覆盖到原安装目录，在 `edge://extensions/` 重新加载扩展，再运行 `register.cmd`。若改用新目录，先从 Edge 删除旧扩展，再加载并注册新目录。卸载时先从 Edge 删除扩展，再运行 `uninstall.cmd`。

系统要求和数据读取行为不变：Windows 10/11 x64、Microsoft Edge，当前只支持 Default 配置文件，不需要 Python。注册仍仅写当前用户登记，不需要管理员权限。

[校验文件](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.3/SHA256SUMS.txt) · [完整说明](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)

### English

The registration and uninstall entry points now use English filenames in both interface languages:

- **register.cmd** registers the local reader. Run it once after installation or after moving the installation folder.
- **uninstall.cmd** removes the current user's native-host registration.
- Interface messages, bilingual help, the README, and package contents now use these same filenames.

Download [edge-sync-status-v1.0.3-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.3/edge-sync-status-v1.0.3-windows-x64.zip) and extract it. At `edge://extensions/`, enable Developer mode and load the included `extension` folder, then double-click `register.cmd`. Open the status page from the toolbar icon and use the language switch at the top right. Edge starts the reader automatically; no separate EXE or server needs to be launched.

To upgrade, close the status tab, copy the new files over the original installation, reload the extension at `edge://extensions/`, and run `register.cmd`. If using a new directory, remove the old extension from Edge first, then load and register the new location. To uninstall, remove the extension from Edge, then run `uninstall.cmd`.

Requirements and reader behavior are unchanged: Windows 10/11 x64, Microsoft Edge, and the Default profile. Python and administrator rights are not required. Registration still affects only the current user.

[Checksums](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.3/SHA256SUMS.txt) · [Full guide](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)

## [1.0.2] - 2026-11-04

### 中文

插件实际界面现已支持中英文切换。

- 点击状态页右上角的 **English / 中文** 按钮，整页立即切换；状态说明、数据类型、设备提示、同步事件和错误提示一起更新。
- 首次使用跟随 Edge 界面语言（中文使用中文，其余使用英文）。手动选择保存在本机，关闭页面后仍然记住。
- 帮助页显示当前选择的语言，也提供切换按钮；已经打开的状态页与帮助页会同步语言。
- 不需要修改原生读取程序或安装额外依赖，扩展 ID 保持不变。设备名称、时间和原始诊断代码保持原样。

#### 下载、启动与升级

1. 下载 [edge-sync-status-v1.0.2-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.2/edge-sync-status-v1.0.2-windows-x64.zip)，解压到准备长期保留的位置。
2. 打开 `edge://extensions/`，打开「开发人员模式」，选择「加载解压缩的扩展」，加载包内 `extension` 文件夹。
3. 双击解压目录中的 `注册.cmd`，然后点击扩展图标打开页面；无需安装 Python 或单独运行 EXE。
4. 点击页面右上角的 **English / 中文** 按钮切换语言。

从 v1.0.0 / v1.0.1 升级：关闭状态页，将新版文件覆盖到原安装目录，在 `edge://extensions/` 重新加载扩展，再运行 `注册.cmd`。如需换目录，先从 Edge 移除旧扩展，再加载并注册新目录。

下载校验文件：[SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.2/SHA256SUMS.txt)。完整说明：[README](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)。

系统要求仍为 Windows 10/11 x64 和 Microsoft Edge，当前只读取标准目录中的 Default 配置文件。已有日志解析限制仍然适用；原生读取程序沿用已有未签名 EXE。本次浏览器验证在真实 Edge 中交互切换，使用示例原生消息数据，未执行本机注册操作。

### English

The extension's actual interface now supports switching between Chinese and English.

- Click **English / 中文** at the top right to update the entire page immediately, including status descriptions, data types, device notices, sync events, and error messages.
- The first visit follows Edge's UI language: Chinese for Chinese locales, English otherwise. Your manual choice is saved locally and retained when the page is reopened.
- Help displays the selected language and has its own language button. Open status and help pages stay in sync.
- No changes to the native reader or additional dependencies are needed, and the extension ID is unchanged. Device names, timestamps, and original diagnostic codes are preserved.

#### Download, start, and upgrade

1. Download [edge-sync-status-v1.0.2-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.2/edge-sync-status-v1.0.2-windows-x64.zip) and extract it to a location you intend to keep.
2. Open `edge://extensions/`, enable Developer mode, choose **Load unpacked**, and select the included `extension` folder.
3. Double-click `注册.cmd` in the extracted folder, then click the extension icon. Python is not required; Edge starts the reader automatically.
4. Click **English / 中文** at the top right to change the language.

Upgrading from v1.0.0 / v1.0.1: close the status tab, copy the new files over the original installation, reload the extension at `edge://extensions/`, and run `注册.cmd` again. For a new directory, remove the old extension from Edge before loading and registering the new location.

[Download checksums](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.2/SHA256SUMS.txt) · [Full guide](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)

Requires Windows 10/11 x64 and Microsoft Edge. Only the Default profile in the standard user-data directory is currently supported. Existing log-parser limitations still apply; the bundled native reader remains the existing unsigned EXE. Browser verification exercised the real Edge UI with sample native-message data and did not change the local host registration.

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
