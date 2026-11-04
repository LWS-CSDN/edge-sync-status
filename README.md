# Edge 同步状态 / Edge Sync Status

一个本地使用的 Edge 扩展，用来确认这台电脑的同步到底有没有成功。

A local Edge extension that checks whether sync on this computer actually succeeded.

**最新版本 Latest release:** [v1.0.4](https://github.com/LWS-CSDN/edge-sync-status/releases/tag/v1.0.4)

## 系统要求 / Requirements

- Windows 10 或 Windows 11，64 位。读取程序是打包好的 `syncstatus-host.exe`，只支持 64 位 Windows。Windows 10 or Windows 11, 64-bit. The bundled reader `syncstatus-host.exe` supports 64-bit Windows only.
- 不需要安装 Python，也不需要联网。Python is not required, and the extension does not need a network connection.
- macOS 和 Linux 暂不支持。读取程序要按系统分别打包，目前只做了 Windows 版。macOS and Linux are not supported yet; the reader is currently packaged for Windows only.
- 需要 Microsoft Edge。扩展 ID 是固定的，换一台电脑不用重新配置。Microsoft Edge is required. The extension ID is fixed, so moving to another computer does not require reconfiguration.

## 它解决什么问题 / What it answers

Edge 的设置页只显示同步开关开没开，不显示数据有没有真的传上去。这个扩展读本机的同步记录，回答三件事：

Edge's settings page only shows whether sync is switched on. It does not show whether data was actually uploaded. This extension reads the local sync records and answers three questions:

- 最近一次上传有没有被服务器接受。Whether the latest upload was accepted by the server.
- 这个账号下有哪些设备连过、各自最后一次出现是什么时候。Which devices have connected under this account, and when each was last seen.
- 日志是否出现疑似同步卡住的迹象。新客户端初始化也可能触发这一标记，需要结合 Edge 同步状态与后续记录确认。Whether the logs suggest sync may be stuck. A new-client initialization can also trigger this marker, so confirm it against Edge's own sync status and later records.

## 下载与启动 / Download and start

1. 从 [v1.0.4 Release](https://github.com/LWS-CSDN/edge-sync-status/releases/tag/v1.0.4) 下载 [edge-sync-status-v1.0.4-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/edge-sync-status-v1.0.4-windows-x64.zip)。完整包包含扩展、读取程序和注册／卸载入口；GitHub 的 `Source code` 附件供开发使用。Download [edge-sync-status-v1.0.4-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/edge-sync-status-v1.0.4-windows-x64.zip) from the [v1.0.4 release](https://github.com/LWS-CSDN/edge-sync-status/releases/tag/v1.0.4). The full package contains the extension, reader, and register/unregister entries. GitHub's `Source code` attachments are for development.
2. 同页提供 [SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/SHA256SUMS.txt)。如需校验，在 PowerShell 中运行下面的命令，与校验文件中的值比较。The same page provides [SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/SHA256SUMS.txt). To verify the download, run the command below in PowerShell and compare it with the value in that file.

```powershell
Get-FileHash .\edge-sync-status-v1.0.4-windows-x64.zip -Algorithm SHA256
```

3. 将 ZIP 解压到准备长期保留的位置。不要在压缩包里直接运行。Extract the ZIP to a location you intend to keep. Do not run it directly from inside the archive.
4. 打开 `edge://extensions/`，打开「开发人员模式」，选「加载解压缩的扩展」，指向解压出来的 `extension` 文件夹。Open `edge://extensions/`, turn on Developer mode, choose "Load unpacked", and select the extracted `extension` folder.
5. 双击解压目录里的 `install.cmd`。它只在当前用户的注册表里写一条记录，告诉 Edge 去哪里找读取程序，不需要管理员权限。看到 `Registered com.edge.syncstatus` 就成功了。Double-click `install.cmd` in the extracted folder. It writes one current-user registry entry telling Edge where to find the reader and does not need administrator rights. `Registered com.edge.syncstatus` means it succeeded.
6. 点工具栏里的图标启动。它会打开一个标签页；已经打开过就切到那一页。Click the toolbar icon to start it. It opens a tab, or switches to that tab if it is already open.

如果工具栏没有图标，点击 Edge 的「扩展」按钮，找到「Edge 同步状态」，将它固定到工具栏。以后打开 Edge 后点击此图标即可使用；点击「刷新」重新读取记录。读取程序由 Edge 按需启动，无需手动运行 `syncstatus-host.exe`，也没有需要另外启动的服务器。

If the icon is missing, open Edge's Extensions menu, find "Edge 同步状态", and pin it to the toolbar. On later visits, click the icon and use the "刷新" (Refresh) button to read the records again. Edge starts the reader on demand; you do not need to run `syncstatus-host.exe` or start a separate server.

两个入口统一使用英文文件名，中文和英文界面都使用同一套文件：

Both interface languages use the same English-named entry points:

| 文件 / File | 用途 / Purpose |
|---|---|
| `install.cmd` | 注册本机读取程序；首次安装或移动目录后运行 / Register the local reader after installation or moving the folder |
| `uninstall.cmd` | 移除本机读取程序的当前用户登记 / Remove the current user's native-host registration |

## 切换界面语言 / Switch the interface language

点击状态页右上角的 **English / 中文** 按钮，即可立即切换整页语言，包括状态说明、数据类型、设备提示、同步记录和错误提示。首次打开跟随 Edge 的界面语言（中文使用中文，其他语言使用英文），手动选择会保存在本机，关闭页面后再次打开仍然生效。

Click **English / 中文** at the top right of the status page to switch the entire interface immediately, including statuses, data types, device notices, sync events, and error messages. On first use, the interface follows Edge's UI language: Chinese for Chinese locales, English otherwise. Your manual choice is saved locally and retained when you reopen the page.

页面底部的「使用说明 / Help」也会使用同一语言设置，帮助页同样有切换按钮；已经打开的主页面和帮助页会同步切换。设备名称、时间、原始诊断代码及真实脚本文件名保持原样。

The help page uses the same saved language and has its own switch. Open status and help pages update together. Device names, timestamps, original diagnostic codes, and actual script filenames are preserved.

## 从旧版升级 / Upgrade from earlier releases

关闭扩展的状态页，将新包内的文件覆盖到原安装目录，保持 `extension`、`host` 等相对位置不变。在 `edge://extensions/` 找到此扩展并点击重新加载，随后再次运行 `install.cmd`。扩展 ID 保持不变。如果改用新目录，先在 Edge 删除旧扩展，再从新目录加载并注册。

Close the status tab and copy the new package contents over the original installation, keeping the `extension` and `host` directory structure. Reload the extension at `edge://extensions/`, then run `install.cmd` again. The extension ID is unchanged. If using a new directory, remove the old extension from Edge before loading and registering it from the new location.

覆盖升级后，旧版遗留在安装目录中的 `register.cmd`、`install.ps1`、`register.ps1`、`uninstall.ps1` 可以删除；新版只使用 `install.cmd` 和 `uninstall.cmd`。

After upgrading in place, you can delete the old `register.cmd`, `install.ps1`, `register.ps1`, and `uninstall.ps1` left in the installation folder. The current version uses only `install.cmd` and `uninstall.cmd`.

## 状态怎么看 / How to read the status

页面顶部是一个状态标记。The top of the page shows one status marker.

| 标记 Marker | 含义 Meaning |
|---|---|
| 同步正常 Sync OK | 最近一次上传被服务器接受了 The latest upload was accepted by the server |
| 同步卡住 Possibly stuck | 日志出现新客户端初始化且没有成功上传，可能仍在初始化，需进一步确认 A new-client initialization appears without a successful upload; it may still be initializing and needs confirmation |
| 最近无上传 No recent upload | 有过同步记录，但最近没有上传 Sync records exist, but there is no recent upload |
| 没有记录 No records | 没找到同步日志 No sync log was found |
| 读取失败 Read failed | 没连上本机读取程序，先确认运行过 `install.cmd` The local reader did not connect; confirm that `install.cmd` has been run |

中间一栏按数据类型列出最近一次成功上传的时间，收藏夹、历史记录、设置各自独立。设备列表里，超过 14 天没有出现的设备会标红；同一台电脑、同一个版本的重复登记会合并成一行。

The middle section lists the latest successful upload time for each data type, including bookmarks, history, and settings. Devices not seen for more than 14 days are marked in red. Repeated registrations of the same computer and version are merged into one row.

## 它怎么工作 / How it works

扩展本身读不了本地文件，所以分成两部分：

The extension itself cannot read local files, so it has two parts:

- `extension` 是扩展本体，只负责显示。`extension` is the extension itself and only displays the result.
- `host\syncstatus-host.exe` 读取 Edge 的同步日志 `Sync Data\Logs\cv_debug.log` 和设备数据库 `Sync Data\LevelDB`，把结果传给扩展。它是打包好的程序，运行时不需要 Python。`host\syncstatus-host.exe` reads Edge's sync log `Sync Data\Logs\cv_debug.log` and device database `Sync Data\LevelDB`, then sends the result to the extension. It is bundled and does not need Python at runtime.

两者通过 Edge 的原生消息机制通信。`host\com.edge.syncstatus.json` 里写着允许连接的扩展 ID，所以扩展必须用这个固定的 ID 加载，不能重新打包生成新 ID。

They communicate through Edge's native messaging. `host\com.edge.syncstatus.json` lists the allowed extension ID, so the extension must keep this fixed ID and must not be repackaged with a new one.

## 限制 / Limitations

- 当前只读取 Edge 标准用户数据目录中的 **Default 配置文件**。其他配置文件（如 `Profile 1`）、自定义用户数据目录暂不支持；页面已标明实际读取对象。It currently reads only the **Default profile** in Edge's standard user-data directory. Other profiles (such as `Profile 1`) and custom user-data directories are not supported yet; the page states what it reads.
- 「同步卡住」是日志启发式判断，可能将正常初始化识别为异常。先等待并刷新、结合 Edge 自带同步状态排查，再决定是否采取修复措施。"Possibly stuck" is a log heuristic and may flag normal initialization. Wait, refresh, and check Edge's own sync status before taking corrective action.
- 设备名称识别可能不完整；跨年日志时间及部分事件详情可能有解析偏差。Device-name recognition may be incomplete. Times that cross a year boundary, and some event details, may be parsed incorrectly.
- 读取程序复用仓库已有的未签名 x64 EXE，本次发布未从源码重新构建。发布验证覆盖自动测试、包内容和消息协议，尚未完成 Edge 内真实安装与同步的端到端验收。The reader reuses the repository's existing unsigned x64 executable and was not rebuilt from source for this release. Verification covers automated tests, package contents, and the messaging protocol, but not yet an end-to-end install and sync check inside Edge.
- 只能看本机的同步记录。手机或别的电脑只有在它们连上同步、记录出现在这台电脑的数据库里之后，才会显示在设备列表里。It can only see records on this computer. A phone or another computer appears only after it has synced and its record exists in this computer's database.
- 依赖本机的同步日志和数据库，这两份文件由 Edge 自己维护，格式变化时解析可能需要跟着调整。It depends on Edge's locally maintained sync log and database. Parsing may need adjustment if those formats change.

## 卸载 / Uninstall

1. 在 `edge://extensions/` 里删除扩展。Remove the extension at `edge://extensions/`.
2. 双击 `uninstall.cmd`，清除注册表里的登记。Double-click `uninstall.cmd` to remove the registry entry.

## 开发与发布 / Development and releases

需要 Python 3.10+ 和 Node.js 18+；Python 仅用于开发验证，使用发布包无需安装。Python 3.10+ and Node.js 18+ are required for development. Python is only for verification; the release package does not need it.

```powershell
python -I -B host/test_sync_status.py
python -I -B -m unittest discover -s tests -v
node --test tests/*.test.js
python -I -B scripts/build_release.py --tag v1.0.4
```

打包输出到 `dist/`。发布新版本时，同时更新扩展的 `version` 和 `CHANGELOG.md`；提交并推送后，推送匹配的 `v<version>` 标签，GitHub Actions 会运行验证、打包并创建附有 ZIP 和校验文件的 Release。也可手动触发工作流，仅验证和生成构件。

The package is written to `dist/`. To publish, update the extension `version` and `CHANGELOG.md`, commit and push, then push the matching `v<version>` tag. GitHub Actions verifies, packages, and creates a Release with the ZIP and checksum file. A manual workflow run only verifies and builds artifacts.

扩展公钥是固定安装身份的一部分，请保留它；修改公钥时必须同步宿主的 `allowed_origins`，已安装用户也需要重新加载扩展。

The extension public key is part of the fixed install identity; keep it. If it changes, update the host `allowed_origins` as well, and installed users must reload the extension.
