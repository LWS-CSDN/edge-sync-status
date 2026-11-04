# Edge 同步状态

[English](README.md) | **简体中文**

通过本机诊断记录，查看 Microsoft Edge 最近一次同步上传是否被服务器接受、有哪些设备连接过，以及近期的同步事件。

[下载 v1.0.5](https://github.com/LWS-CSDN/edge-sync-status/releases/tag/v1.0.5) · [使用指南](extension/使用说明.md) · [更新记录](CHANGELOG.zh-CN.md)

## 功能

- 查看最近一次上传结果，以及各类数据最近一次成功上传的时间。
- 展示本机同步记录中的设备，合并重复登记，并标出超过 14 天未出现的设备。
- 查看近期同步事件，辅助排查上传问题。
- 状态页和帮助页支持中英文切换，并在本机保存语言偏好。
- 读取本地记录，不修改同步数据，也不向其他服务上传诊断记录。

## 系统要求

- Windows 10 或 Windows 11，x64，Microsoft Edge 120 或更新版本。
- 使用 Edge 标准用户数据目录中的 **Default 配置文件**。暂不支持其他配置文件或自定义目录。
- 使用发布包不需要安装 Python，也不需要管理员权限。读取程序为 Windows x64 程序，暂不支持 macOS 和 Linux。

扩展可以离线查看已有的本地记录。Edge 同步新改动时仍然需要联网。

## 下载与安装

1. 下载 [edge-sync-status-v1.0.5-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/edge-sync-status-v1.0.5-windows-x64.zip)。这是包含扩展、本机读取程序和安装脚本的完整包；GitHub 自动附带的 **Source code** 压缩包供开发使用。
2. 完整解压到准备长期保留的文件夹，保持包内的目录结构。
3. 打开 `edge://extensions/`，打开「开发人员模式」，选择「加载解压缩的扩展」，选中解压后的 `extension` 文件夹。
4. 双击安装包顶层目录中的 `install.cmd`。看到 `Registered com.edge.syncstatus` 表示成功，它会为当前 Windows 用户登记本机读取程序。
5. 点击工具栏中的扩展图标打开状态页。如果看不到图标，在 Edge「扩展」菜单中找到「Edge 同步状态」并固定。

`install.cmd` 负责登记本机读取程序；浏览器扩展需要在第 3 步手动加载。读取程序由 Edge 按需启动，无需另外启动服务器，也无需自己运行 `syncstatus-host.exe`。

如需校验下载，在 PowerShell 中运行下面的命令，将结果与 [SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/SHA256SUMS.txt) 比较：

```powershell
Get-FileHash .\edge-sync-status-v1.0.5-windows-x64.zip -Algorithm SHA256
```

## 日常使用

点击工具栏图标打开状态页，已打开时会切换到原来的标签页。点击「刷新」重新读取本地记录。

点击右上角的 **English** 切换为英文，点击 **中文** 切回中文。首次使用跟随 Edge 的界面语言：中文环境使用中文，其余使用英文。手动选择会保存在本机，状态页和帮助页共用这一设置。设备名称、时间和原始诊断代码保留原始值。

| 状态 | 含义 |
|---|---|
| 同步正常 | 最近一次上传已被服务器接受。 |
| 同步卡住 | 日志中出现新客户端初始化且没有成功上传。正常初始化也可能触发，需结合后续记录和 Edge 自带同步状态确认。 |
| 最近无上传 | 存在同步记录，但没有找到近期上传。 |
| 没有记录 | 没有找到同步日志。 |
| 读取失败 | 未能连接本机读取程序，先确认 `install.cmd` 已成功运行。 |

页面还会显示各类数据的上传时间、设备列表和近期同步事件。某类数据的上传时间较早，也可能只是没有新改动，不能单凭这一点判断同步故障。详细解释和排障步骤见[使用指南](extension/使用说明.md)。

## 升级

1. 关闭状态页和帮助页。
2. 将新包内的文件覆盖到原安装目录，保持 `extension` 与 `host` 的相对位置不变。
3. 在 `edge://extensions/` 重新加载扩展，再运行一次 `install.cmd`。

如果改用新文件夹，先在 Edge 中移除旧扩展，再加载和登记新位置。移动安装目录后都需要重新登记读取程序。

覆盖升级不会自动删除旧文件。旧版遗留的 `register.cmd`、`install.ps1`、`register.ps1`、`uninstall.ps1` 可以删除；当前版本只使用 `install.cmd` 和 `uninstall.cmd`。

## 卸载

1. 在 `edge://extensions/` 中移除扩展。
2. 双击 `uninstall.cmd`，移除当前用户的读取程序登记。
3. 如果不再使用，可以删除整个解压目录。

## 工作原理

扩展通过 Edge 的原生消息接口接收 `host/syncstatus-host.exe` 生成的报告。读取程序检查标准用户数据目录中 Default 配置文件的 `Sync Data\Logs\cv_debug.log` 和 `Sync Data\LevelDB`，再将报告交给扩展显示。

`install.cmd` 将 `host/com.edge.syncstatus.json` 登记到当前用户的 `HKCU\SOFTWARE\Microsoft\Edge\NativeMessagingHosts\com.edge.syncstatus` 项，`uninstall.cmd` 删除这条登记。

扩展 ID 固定为 `baihbjmdopjlikhppfbpgknmlijfkfgn`。请保留扩展清单中的公钥：Edge 据此生成 ID，宿主只允许该 ID 连接。

## 已知限制

- 目前只支持标准目录下的 **Default 配置文件**。在 Edge 中切换到其他配置文件，不会改变本扩展的读取对象。
- 「同步卡住」基于日志推断，可能将正常初始化标为异常。请先等待、刷新，并结合 Edge 同步设置排查。
- 设备名称识别可能不完整，跨年日志时间和部分事件详情可能存在解析偏差。
- 设备只有在本机存在对应记录时才会显示；列表中没有某台设备，不代表它从未同步。
- 读取程序依赖 Edge 的本地日志和数据库格式，格式变化时可能需要调整解析逻辑。
- 包内沿用仓库已有的未签名 x64 读取程序，本次未重新构建。验证覆盖自动测试、包内容和原生消息协议，尚未完成 Edge 内真实安装与同步的完整验收。

## 开发与发布

开发需要 Python 3.10+ 和 Node.js 18+。在仓库根目录运行：

```powershell
python -I -B host/test_sync_status.py
python -I -B -m unittest discover -s tests -v
node --test tests/*.test.js
node --check extension/background.js
node --check extension/popup.js
node --check extension/i18n.js
python -I -B scripts/build_release.py --tag v1.0.5
```

ZIP 和校验文件输出到 `dist/`。打包器使用文件白名单，包含 README、使用指南和更新记录的中英文版本。

发布新版本时，更新 `extension/manifest.json`、两份更新记录和文档中带版本的链接。提交并推送改动，再推送匹配的 `v<version>` 标签，GitHub Actions 会验证、打包，并发布 ZIP 和校验文件。发布页以英文说明为正文，并提供中文发布说明链接；手动运行工作流只验证和生成构件。

修改文档时请同步两种语言。若需要修改扩展公钥，也必须同步宿主的 `allowed_origins`，已有安装需要重新加载扩展。
