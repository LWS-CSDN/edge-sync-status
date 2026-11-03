# 首次 GitHub Release 设计

用户于 2026-11-03 确认：检查并修复安装阻塞，补自动发布流程，发布 v1.0.0。

## 交付目标

GitHub 仓库 https://github.com/LWS-CSDN/edge-sync-status 提供可下载的 Windows x64 完整 ZIP 和 SHA256SUMS.txt。安装仍为解压、在 Edge 加载 extension、双击注册.cmd，无需 Python 或管理员权限。

## 安装修复

在 extension/manifest.json 保存公共 SPKI key，按 Chromium 的 SHA-256 规则生成固定扩展 ID；host/com.edge.syncstatus.json 仅允许这一 ID。私钥不进入仓库或安装包。

CMD 直接调用 Windows reg.exe，只登记或删除当前用户 HKCU 的本项目 NativeMessagingHosts 项，登记前检查宿主和清单存在。保留 PowerShell 脚本供已有用户使用；不修改系统执行策略。更正错误提示和旧说明对 Python、install.ps1 的引用。

## 打包与发布

Python 标准库脚本用白名单收集运行文件，输出单一顶层目录的 edge-sync-status-v1.0.0-windows-x64.zip 和 SHA256SUMS.txt。校验版本标签、公共 key、allowed_origins 与必需文件。只复用仓库中已有的 x64 EXE，不声称本次从源码重建或完成数字签名。

GitHub Actions 在 v* 标签上运行测试、EXE 原生消息协议冒烟、打包，然后以仅发布任务具有的 contents:write 权限创建 Release。手动触发只验证并生成构件。中文说明来自 CHANGELOG.md 对应版本节。发布由 Actions 中已有 gh 完成，本地不运行下载的 CLI。

## 范围与已知限制

此次不改后端解析算法或重建 EXE。页面及文档明确当前只读取默认用户数据目录的 Default 配置文件；其他配置文件和自定义目录暂不支持。同步卡住是日志启发式判断，新配置初始化可能触发，不能仅凭此标记建议重置同步。设备名称识别和跨年日志时间存在局限。

## 验收

已有后端测试通过；新增固定 ID 校验和打包行为测试先失败后通过；EXE 对不存在的配置文件返回合法长度前缀 JSON；ZIP 内容完整、无开发目录、哈希吻合；JS 语法检查与 git diff --check 通过。发布后通过 GitHub API 确认 Actions 结果及 Release 的两个附件。本次不会替用户修改本机注册表；浏览器真实安装连接尚需使用者验收。
