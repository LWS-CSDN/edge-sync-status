# 更新记录

## [1.0.0] - 2026-11-03

Edge 同步状态首次发布，支持 Windows 10/11 x64 和 Microsoft Edge（Chromium 120 或更新版本）。

### 下载与安装

下载附件 **edge-sync-status-v1.0.0-windows-x64.zip**，解压到准备长期保留的位置。包内包含扩展和本机读取程序，不需要安装 Python。

1. 打开 `edge://extensions/`，打开「开发人员模式」，点击「加载解压缩的扩展」，选择解压目录里的 `extension` 文件夹。
2. 双击解压目录里的 `注册.cmd`，看到 `Registered com.edge.syncstatus` 后点击扩展图标。

注册只写当前用户的原生宿主登记，不需要管理员权限。移动整个解压目录后需要重新注册。卸载时从 Edge 删除扩展，再运行 `卸载.cmd`。

### 本次发布

- 查看本机最近一次上传结果、各类型最近成功上传时间、设备最近出现时间与近期同步事件。
- 固定扩展 ID，使不同解压路径使用相同的原生消息连接配置。
- 注册与卸载入口直接使用 Windows 当前用户登记，减少对 PowerShell 执行策略的依赖。
- 统一安装和故障提示，明确不需要 Python。
- 提供完整 Windows x64 ZIP、SHA256SUMS.txt 和后续标签自动发布流程。

### 校验下载

在 PowerShell 中运行下列命令，将结果与同页 `SHA256SUMS.txt` 的 ZIP 校验值比较：

```powershell
Get-FileHash .\edge-sync-status-v1.0.0-windows-x64.zip -Algorithm SHA256
```

GitHub 自动附带的 Source code 压缩包供开发使用；普通用户请下载上面命名的完整 Windows 安装包。

### 已知限制

- 当前只读取标准 Edge 用户数据目录中的 **Default** 配置文件，暂不支持其他配置文件、自定义用户数据目录、macOS 或 Linux。
- 「同步卡住」基于本机日志推断，新配置初始化也可能触发；应结合 Edge 的同步状态与后续记录确认，再决定是否排障。
- 设备名称识别可能不完整；跨年日志时间及部分事件详情解析可能有偏差。
- 本次复用仓库已有的 x64 `syncstatus-host.exe`，未重新构建，未进行数字签名。其 SHA-256 为 `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`。
- 发布验证覆盖自动测试、包内容与原生消息协议；尚未完成浏览器内真实安装与同步日志的端到端验收。
