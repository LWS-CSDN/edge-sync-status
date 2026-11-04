# 更新记录

[English](CHANGELOG.md) | **简体中文**

[项目介绍](README.zh-CN.md)

## [1.0.5] - 2026-11-04

文档改为独立的英文和简体中文文件，每份文档顶部均可点击切换语言。

- `README.md` 使用英文，新增 `README.zh-CN.md`；两份均包含完整安装、使用、升级、限制和开发说明。
- 使用指南和更新记录分别拆成两种语言，保留各版本的历史记录。
- Windows 安装包包含全部六份语言文档，解压后也能通过相对链接互相跳转。
- 插件内两种语言的帮助页分别链接对应语言的在线 README；发布页使用英文说明，并提供中文记录链接。

下载 [edge-sync-status-v1.0.5-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/edge-sync-status-v1.0.5-windows-x64.zip)，完整解压，在 `edge://extensions/` 打开开发人员模式并加载 `extension` 文件夹，再运行 `install.cmd`。点击工具栏图标打开状态页，不需要 Python 或管理员权限。

升级时关闭扩展页面，将新文件覆盖到原安装目录，重新加载扩展，再运行一次 `install.cmd`。读取程序、扩展 ID 和同步读取行为不变，仍只支持 Edge 标准用户数据目录中的 Default 配置文件。

[SHA-256 校验文件](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/SHA256SUMS.txt) · [中文指南](https://github.com/LWS-CSDN/edge-sync-status/blob/v1.0.5/README.zh-CN.md)

## [1.0.4] - 2026-11-04

安装与卸载统一为一对入口：**install.cmd / uninstall.cmd**。

- 将注册入口改名为 `install.cmd`，与 `uninstall.cmd` 对应。
- 删除已弃用的 `install.ps1`，同时移除功能重复的 `register.ps1` 和 `uninstall.ps1`。仓库和新安装包只保留两个 CMD 入口。
- 同步中英文界面提示、帮助文档和打包清单。

下载 [edge-sync-status-v1.0.4-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/edge-sync-status-v1.0.4-windows-x64.zip)，完整解压，在 `edge://extensions/` 打开开发人员模式、加载包内 `extension` 文件夹，再双击 **install.cmd**。点击扩展图标打开状态页，顶部可切换中英文。卸载时先从 Edge 删除扩展，再运行 **uninstall.cmd**。

升级时关闭状态页，覆盖原安装目录，在 Edge 中重新加载扩展，再运行 `install.cmd`。覆盖解压不会自动删除旧文件，旧版残留的 `register.cmd` 和三个 PowerShell 脚本可以手动删除。读取程序和扩展 ID 不变，仍不需要 Python 或管理员权限。

[SHA-256 校验文件](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/SHA256SUMS.txt) · [完整中文说明](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.zh-CN.md)

## [1.0.3] - 2026-11-04

注册和卸载入口统一使用英文文件名，中文和英文界面使用相同的命令：

- **register.cmd**：注册本机读取程序，首次安装或移动目录后运行一次。
- **uninstall.cmd**：移除本机读取程序的当前用户登记。
- 更新主界面提示、中英文帮助、README 和安装包清单，避免文件名与说明不一致。

下载 [edge-sync-status-v1.0.3-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.3/edge-sync-status-v1.0.3-windows-x64.zip)，解压后在 `edge://extensions/` 打开开发人员模式并加载 `extension` 文件夹，再双击 `register.cmd`。点击工具栏图标打开状态页，右上角可切换中英文；无需单独启动 EXE 或服务器。

旧版升级：关闭状态页，将新包覆盖到原安装目录，在 `edge://extensions/` 重新加载扩展，再运行 `register.cmd`。若改用新目录，先从 Edge 删除旧扩展，再加载并注册新目录。卸载时先从 Edge 删除扩展，再运行 `uninstall.cmd`。

系统要求和数据读取行为不变：Windows 10/11 x64、Microsoft Edge，当前只支持 Default 配置文件，不需要 Python。注册仍仅写当前用户登记，不需要管理员权限。

[校验文件](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.3/SHA256SUMS.txt) · [完整说明](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.zh-CN.md)

## [1.0.2] - 2026-11-04

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

下载校验文件：[SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.2/SHA256SUMS.txt)。完整说明：[README](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.zh-CN.md)。

系统要求仍为 Windows 10/11 x64 和 Microsoft Edge，当前只读取标准目录中的 Default 配置文件。已有日志解析限制仍然适用；原生读取程序沿用已有未签名 EXE。本次浏览器验证在真实 Edge 中交互切换，使用示例原生消息数据，未执行本机注册操作。

## [1.0.1] - 2026-11-04

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

完整说明见 [README](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.zh-CN.md)。GitHub 自动附带的 Source code 压缩包供开发使用；普通用户请下载上面命名的完整 Windows 安装包。

#### 已知限制

- 当前只读取标准 Edge 用户数据目录中的 **Default** 配置文件，暂不支持其他配置文件、自定义用户数据目录、macOS 或 Linux。
- 「同步卡住」基于本机日志推断，新配置初始化也可能触发；应结合 Edge 的同步状态与后续记录确认，再决定是否排障。
- 设备名称识别可能不完整；跨年日志时间及部分事件详情解析可能有偏差。
- 本次复用仓库已有的 x64 `syncstatus-host.exe`，未重新构建，未进行数字签名。其 SHA-256 为 `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`。
- 发布验证覆盖自动测试、包内容与原生消息协议；尚未完成浏览器内真实安装与同步日志的端到端验收。

## [1.0.0] - 2026-11-03

Edge 同步状态首次发布，支持 Windows 10/11 x64 和 Microsoft Edge 120 或更新版本。

### 下载与安装

下载 **edge-sync-status-v1.0.0-windows-x64.zip**，解压到准备长期保留的位置。包内包含扩展和本机读取程序，不需要安装 Python。

1. 打开 `edge://extensions/`，打开「开发人员模式」，选择「加载解压缩的扩展」，选中解压目录里的 `extension` 文件夹。
2. 双击解压目录里的 `注册.cmd`，看到 `Registered com.edge.syncstatus` 后点击扩展图标。

注册只写当前用户的原生宿主登记，不需要管理员权限。移动解压目录后需要重新注册；卸载时先从 Edge 删除扩展，再运行 `卸载.cmd`。

### 本次发布

- 查看本机最近一次上传结果、各类数据最近成功上传时间、设备最近出现时间与近期同步事件。
- 固定扩展 ID，使不同解压路径使用相同的原生消息连接配置。
- 注册与卸载入口直接使用 Windows 当前用户登记，无需依赖 PowerShell 脚本。
- 统一安装和故障提示，明确不需要 Python。
- 提供完整 Windows x64 ZIP、SHA256SUMS.txt 和后续标签自动发布流程。

### 校验下载

在 PowerShell 中运行下面的命令，将结果与同一发布页的 `SHA256SUMS.txt` 比较：

```powershell
Get-FileHash .\edge-sync-status-v1.0.0-windows-x64.zip -Algorithm SHA256
```

GitHub 自动附带的 Source code 压缩包供开发使用，普通用户请下载上述完整 Windows 安装包。

### 已知限制

- 仅支持 Edge 标准用户数据目录中的 **Default** 配置文件，暂不支持其他配置文件、自定义目录、macOS 和 Linux。
- 「同步卡住」基于本机日志推断，新配置初始化也可能触发；应结合 Edge 的同步状态与后续记录确认。
- 设备名称识别可能不完整，跨年时间和部分事件详情可能存在解析偏差。
- 沿用已有的 x64 `syncstatus-host.exe`，未重新构建或数字签名，SHA-256 为 `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`。
- 验证覆盖自动测试、包内容和原生消息协议，尚未完成 Edge 内真实安装与同步日志的完整验收。
