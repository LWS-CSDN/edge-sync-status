# 独立中英文文档实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将面向读者的文档整理为独立中英文文件，顶部互链，并发布包含两种语言文档的 v1.0.5 安装包。

**架构：** `README.md` 为英文入口，`README.zh-CN.md` 为中文入口。保留 `extension/使用说明.md` 作为中文使用指南，新增 `extension/USAGE.md` 作为英文指南；更新记录使用 `CHANGELOG.md` 和 `CHANGELOG.zh-CN.md`。语言切换均为相对 Markdown 链接，兼容 GitHub 和解压后的安装包。现有帮助页面继续按所选语言显示，并链接到对应语言的 README。

**技术栈：** Markdown、HTML、Python 标准库、GitHub Actions。

---

### 任务 1：拆分和导航

**文件职责：**
- `README.md` / `README.zh-CN.md`：独立英文、中文项目介绍，下载、快速开始、升级、限制、开发与发布步骤。
- `extension/USAGE.md` / `extension/使用说明.md`：独立英文、中文详细使用与排障指南。
- `CHANGELOG.md` / `CHANGELOG.zh-CN.md`：独立英文、中文版本记录，保留已有版本的实际变化和历史入口名称。
- `extension/help.html`：中文帮助链接中文 README，英文帮助链接英文 README。

- [x] 改写 README、使用指南和更新记录；两种语言顶部互链，正文按自己的语言完整组织。
- [x] 两份 README 都提供对应语言的使用指南和更新记录链接；两份使用指南链接回对应 README。
- [x] 更新帮助页的在线文档链接及 v1.0.5 下载地址。

### 任务 2：打包和发布

**文件职责：**
- `tests/test_release_package.py`：维护独立期望清单，验证两种语言文档确实出现在 ZIP 内。
- `scripts/build_release.py`：将六份语言文档加入发布白名单。
- `extension/manifest.json`：版本升级到 `1.0.5`，保留原公钥和权限。
- `.github/workflows/release.yml`：继续从英文 CHANGELOG 对应版本提取发布说明，同时增加当前标签下的中文发布说明链接。

- [x] 创建语言文件后，先更新包内容测试的独立清单，运行 `python -I -B -m unittest discover -s tests -p test_release_package.py -v`，确认 ZIP 遗漏四份新增文档而失败。
- [x] 更新打包白名单和版本；发布说明使用单一英文正文，并链接标签下的中文记录。
- [x] 运行全部验证：

```powershell
python -I -B host/test_sync_status.py
python -I -B -m unittest discover -s tests -v
node --test tests/*.test.js
node --check extension/background.js
node --check extension/popup.js
node --check extension/i18n.js
python -I -B scripts/build_release.py --tag v1.0.5
git diff --check
```

- [x] 检查生成 ZIP：18 个文件含六份语言文档，20 个相对链接有效；SHA256SUMS.txt 与 ZIP 一致；发布说明提取和缺少中文记录时的拒绝行为均通过验证。
- [ ] 中文 Conventional Commit 提交，工作区干净后快进合并 main 并推送，创建和推送 `v1.0.5` 标签。
- [ ] 使用 GitHub 公开 API 检查 Actions、Release 正文、ZIP 和校验附件，并确认 latest 指向 v1.0.5。
