# 本地安全扫描·免费版（ClawHub 等价方案）

完全免费、无需付费 API。模拟 ClawHub 后端三层扫描架构。

## 用法

```bash
# 扫描全部 20 个 skill
./run-all.sh all

# 扫描单个 skill
./run-all.sh maxhub-douyin
```

报告输出到 `reports/<skill>-<timestamp>.json`（已加入 .gitignore）。

## 三层扫描映射

| 本地层 | 等价 ClawHub 官方层 | 工具 | 是否免费 |
|--------|------------------|------|---------|
| Layer 1a | VirusTotal hash 黑名单 | 内置 ClawHavoc 黑名单文本比对 | ✅ 完全免费 |
| Layer 1b | SHA-256 指纹 | `shasum -a 256` | ✅ 系统自带 |
| Layer 1c | VirusTotal 全球库查询 | `vt-cli`（可选）| ✅ 注册免费 API Key |
| Layer 2 | 静态代码分析 | `clawhub-skill-scanner`（Python）| ✅ 完全免费 |
| Layer 3 | OpenAI LLM 文档审查 | 当前 Agent 即时审查 | ✅ 复用对话 |

## 可选：启用 VT hash 查询

```bash
# 1. 注册 https://www.virustotal.com Community 账号（免费邮箱即可）
# 2. 复制 API Key（https://www.virustotal.com/gui/my-apikey）
# 3. 任选其一：
brew install virustotal-cli && vt init   # 推荐：使用 vt-cli
# 或直接环境变量：
export VT_API_KEY="你的免费key"

# 4. 重新扫描
./run-all.sh all
```

## 限制说明

- **Layer 1c VT 免费版**：4 req/min, 500 req/day，已加入限速 sleep 16s
- **Layer 3 LLM**：本地不内置，需要在 Agent 对话中执行
- **typosquatting 检测**：仅本地黑名单，全网检测仅 ClawHub 服务端能做
- **每日重扫**：可加入 `crontab` 或 `launchd` 定时执行

## 输出格式（模仿 ClawHub moderationSnapshot）

```json
{
  "skill": "maxhub-douyin",
  "scan_time": "20260616-121910",
  "sha256": "...",
  "moderationVerdict": "clean | suspicious | malicious",
  "moderationReasonCodes": ["static.caution", "vt.malicious", ...],
  "layers": {
    "layer1a_clawhavoc_blacklist": { "hit": 0 },
    "layer1c_virustotal_hash": "0",
    "layer2_static_analysis": { "score": "0/100", "level": "🟢 SAFE" }
  }
}
```
