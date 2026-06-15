# MaxHub Skills 安全扫描报告

**扫描时间**: 2026-06-15
**扫描器**: ClawHub skill-vetter 体系（本地 Python 扫描器）  `clawhub-skill-scanner/scripts/scan_skill.py`
**扫描方式**: 本地静态扫描，无需联网/发布
**扫描目标**: maxhub-skills 仓库全部 20 个 skill 目录

---

## 扫描结果总览

| # | Skill | 风险分 | 等级 | 文件数 | 行数 | 备注 |
|---|-------|--------|------|--------|------|------|
| 1 | maxhub-sora2 | 0/100 | 🟢 SAFE | 10 | 1843 | ✅ |
| 2 | maxhub-douyin | 0/100 | 🟢 SAFE | 17 | 12955 | ✅ |
| 3 | maxhub-tiktok | 30/100 | 🟡 CAUTION | 16 | 8822 | ⚠️ 误报 1 |
| 4 | maxhub-bilibili | 0/100 | 🟢 SAFE | 13 | 3056 | ✅ |
| 5 | maxhub-xiaohongshu | 0/100 | 🟢 SAFE | 11 | 2710 | ✅ |
| 6 | maxhub-weibo | 0/100 | 🟢 SAFE | 11 | 3349 | ✅ |
| 7 | maxhub-wechat | 100/100 | 🔴 BLOCK | 10 | 2081 | ⚠️ 误报 5 |
| 8 | maxhub-twitter | 0/100 | 🟢 SAFE | 9 | 1578 | ✅ |
| 9 | maxhub-instagram | 0/100 | 🟢 SAFE | 11 | 3516 | ✅ |
| 10 | maxhub-kuaishou | 100/100 | 🔴 BLOCK | 12 | 2734 | ⚠️ 误报 4 |
| 11 | maxhub-youtube | 0/100 | 🟢 SAFE | 11 | 2847 | ✅ |
| 12 | maxhub-reddit | 0/100 | 🟢 SAFE | 11 | 2391 | ✅ |
| 13 | maxhub-linkedin | 30/100 | 🟡 CAUTION | 11 | 2354 | ⚠️ 误报 1 |
| 14 | maxhub-threads | 0/100 | 🟢 SAFE | 9 | 1451 | ✅ |
| 15 | maxhub-lemon8 | 0/100 | 🟢 SAFE | 9 | 1515 | ✅ |
| 16 | maxhub-pipixia | 0/100 | 🟢 SAFE | 9 | 1656 | ✅ |
| 17 | maxhub-zhihu | 0/100 | 🟢 SAFE | 10 | 1763 | ✅ |
| 18 | maxhub-toutiao | 0/100 | 🟢 SAFE | 9 | 963 | ✅ |
| 19 | maxhub-xigua | 0/100 | 🟢 SAFE | 9 | 1047 | ✅ |
| 20 | maxhub-temp-mail | 0/100 | 🟢 SAFE | 8 | 894 | ✅ |

**统计**：
- 🟢 SAFE（自动通过）：16 个（80%）
- 🟡 CAUTION（人工审查）：2 个（10%）—— tiktok / linkedin
- 🔴 BLOCK（被阻断）：2 个（10%）—— wechat / kuaishou

---

## 误报分析（False Positive）

经人工逐条审查，4 个告警 **全部为误报**，无真实安全风险：

### 1. maxhub-tiktok (30/100, CAUTION)

- **触发位置**：`maxhub-tiktok/references/creator.md:814`
- **触发规则**：`Shell profile modification`
- **实际内容**：`stats.profile_type` 字段说明（API 响应字段 "画像类型，固定值 2"）
- **误报原因**：规则匹配 "profile" 关键词，但此处为 JSON 字段名，并非 shell profile 文件
- **风险等级**：🟢 无风险

### 2. maxhub-wechat (100/100, BLOCK)

- **触发位置**：`maxhub-wechat/SKILL.md:198-202`（共 5 行）
- **触发规则**：`Curl POST/PUT command`
- **实际内容**：5 行 curl 命令示例（鉴权文档中展示如何调用微信 API）
- **误报原因**：规则识别 curl 命令视为风险，但此 skill 不包含可执行脚本，curl 仅作为文档示例展示
- **风险等级**：🟢 无风险

### 3. maxhub-kuaishou (100/100, BLOCK)

- **触发位置**：`maxhub-kuaishou/references/live.md:24`、`param-mappings.md:149`、`user.md:210-211`
- **触发规则**：`Shell profile modification`
- **实际内容**：4 处 `userProfile.profile` JSON 路径（如 `$.data.userProfile.profile.user_id`）
- **误报原因**：规则匹配 "userProfile" 关键词，但此处为快手 API 响应的 JSON path
- **风险等级**：🟢 无风险

### 4. maxhub-linkedin (30/100, CAUTION)

- **触发位置**：`maxhub-linkedin/references/user.md:222`
- **触发规则**：`Shell profile modification`
- **实际内容**：`$.data.profile` JSON 路径说明
- **误报原因**：规则匹配 "profile" 关键词，但此处为 LinkedIn API 响应的 JSON path
- **风险等级**：🟢 无风险

---

## 扫描器说明

- **扫描器来源**：通过 `clawhub install clawhub-skill-scanner` 安装到 `/tmp/scanner-test/`
- **扫描器原理**：基于正则 + 启发式规则（与 [skill-vetter-hermes](https://openclawai.io/skills/skill/skill-vetter-hermes) 同源）
- **规则设计意图**：检测恶意代码、凭据泄露、远程代码执行、反弹 shell、curl pipe bash 等真实威胁
- **已知缺陷**：规则基于文本匹配，**会误报 JSON path / 字段名 / 文档示例**（如本次 4 例）

---

## 结论

✅ **全部 20 个 skill 通过安全审查**（人工复核后）

- **真实威胁**：0 个
- **误报**：4 个 skill 中的 11 处触发点（已逐一标注）
- **可发布性**：🟢 推荐通过安全审查，可进入 `clawhub sync` 发布阶段

---

## 后续建议

1. **如要发布到 ClawHub**：执行 `clawhub sync --all`（需先 `clawhub login` 登录）
2. **如要 CI/CD 集成**：扫描脚本可封装为 GitHub Action
3. **如要人工深度审查**：重点审阅 4 个误报 skill 的 references 目录（文件结构 + JSON path 命名）
4. **可优化方向**：将 SKILL.md 中的 curl 示例改为"代码块说明"而非实际命令，规避扫描器误报
