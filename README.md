# Edge 同步状态

一个本地使用的 Edge 扩展，用来确认这台电脑的同步到底有没有成功。

## 系统要求

- Windows 10 或 Windows 11，64 位。读取程序是打包好的 `syncstatus-host.exe`，只支持 64 位 Windows。
- 不需要安装 Python，也不需要联网。
- macOS 和 Linux 暂不支持。读取程序要按系统分别打包，目前只做了 Windows 版。
- 需要 Microsoft Edge。扩展 ID 是固定的，换一台电脑不用重新配置。

## 它解决什么问题

Edge 的设置页只显示同步开关开没开，不显示数据有没有真的传上去。这个扩展读本机的同步记录，回答三件事：

- 最近一次上传有没有被服务器接受。
- 这个账号下有哪些设备连过、各自最后一次出现是什么时候。
- 日志是否出现疑似同步卡住的迹象。新客户端初始化也可能触发这一标记，需要结合 Edge 同步状态与后续记录确认。

## 下载

从 [最新 Release](https://github.com/LWS-CSDN/edge-sync-status/releases/latest) 下载 **`edge-sync-status-v1.0.0-windows-x64.zip`**。完整包包含扩展、读取程序和注册／卸载入口；GitHub 的 `Source code` 附件供开发使用。

同页提供 `SHA256SUMS.txt`。如需校验，在 PowerShell 中运行 `Get-FileHash .\edge-sync-status-v1.0.0-windows-x64.zip -Algorithm SHA256`，与校验文件中的值比较。

## 安装

将 ZIP 解压到准备长期保留的位置，再完成两步，不需要命令行。

1. 打开 `edge://extensions/`，打开「开发人员模式」，选「加载解压缩的扩展」，指向解压出来的 `extension` 文件夹。
2. 双击解压目录里的 `注册.cmd`。它只在当前用户的注册表里写一条记录，告诉 Edge 去哪里找读取程序，不需要管理员权限。看到「Registered com.edge.syncstatus」就成功了。

然后点工具栏里的图标，会打开一个标签页（已经打开过就切到那一页）。

页面底部有「使用说明」，讲每个状态标记的含义和读取失败时怎么排查。

## 状态怎么看

页面顶部是一个状态标记。

| 标记 | 含义 |
|---|---|
| 同步正常 | 最近一次上传被服务器接受了 |
| 同步卡住 | 日志出现新客户端初始化且没有成功上传，可能仍在初始化，需进一步确认 |
| 最近无上传 | 有过同步记录，但最近没有上传 |
| 没有记录 | 没找到同步日志 |
| 读取失败 | 没连上本机读取程序，先确认运行过 `注册.cmd` |

中间一栏按数据类型列出最近一次成功上传的时间，收藏夹、历史记录、设置各自独立。设备列表里，超过 14 天没有出现的设备会标红；同一台电脑、同一个版本的重复登记会合并成一行。

## 它怎么工作

扩展本身读不了本地文件，所以分成两部分：

- `extension` 是扩展本体，只负责显示。
- `host\syncstatus-host.exe` 读取 Edge 的同步日志 `Sync Data\Logs\cv_debug.log` 和设备数据库 `Sync Data\LevelDB`，把结果传给扩展。它是打包好的程序，运行时不需要 Python。

两者通过 Edge 的原生消息机制通信。`host\com.edge.syncstatus.json` 里写着允许连接的扩展 ID，所以扩展必须用这个固定的 ID 加载，不能重新打包生成新 ID。

## 限制

- 当前只读取 Edge 标准用户数据目录中的 **Default 配置文件**。其他配置文件（如 `Profile 1`）、自定义用户数据目录暂不支持；页面已标明实际读取对象。
- 「同步卡住」是日志启发式判断，可能将正常初始化识别为异常。先等待并刷新、结合 Edge 自带同步状态排查，再决定是否采取修复措施。
- 设备名称识别可能不完整；跨年日志时间及部分事件详情可能有解析偏差。
- 读取程序复用仓库已有的未签名 x64 EXE，本次发布未从源码重新构建。发布验证覆盖自动测试、包内容和消息协议，尚未完成 Edge 内真实安装与同步的端到端验收。
- 只能看本机的同步记录。手机或别的电脑只有在它们连上同步、记录出现在这台电脑的数据库里之后，才会显示在设备列表里。
- 依赖本机的同步日志和数据库，这两份文件由 Edge 自己维护，格式变化时解析可能需要跟着调整。

## 卸载

1. 在 `edge://extensions/` 里删除扩展。
2. 双击 `卸载.cmd`，清除注册表里的登记。

## 开发与发布

需要 Python 3.10+ 和 Node.js 18+；Python 仅用于开发验证，使用发布包无需安装。

```powershell
python -I -B host/test_sync_status.py
python -I -B -m unittest discover -s tests -v
node --test tests/install-config.test.js
python -I -B scripts/build_release.py --tag v1.0.0
```

打包输出到 `dist/`。发布新版本时，同时更新扩展的 `version` 和 `CHANGELOG.md`；提交并推送后，推送匹配的 `v<version>` 标签，GitHub Actions 会运行验证、打包并创建附有 ZIP 和校验文件的 Release。也可手动触发工作流，仅验证和生成构件。

扩展公钥是固定安装身份的一部分，请保留它；修改公钥时必须同步宿主的 `allowed_origins`，已安装用户也需要重新加载扩展。
