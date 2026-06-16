#!/usr/bin/env bash
# ClawHub 三层安全扫描·免费本地等价版
# 用法：./run-all.sh [skill_name|all]
# 输出：.security-audit/reports/<skill>-<timestamp>.json

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORTS="$SCRIPT_DIR/reports"
mkdir -p "$REPORTS"

SCANNER="/tmp/scanner-test/clawhub-skill-scanner/scripts/scan_skill.py"
TS=$(date +%Y%m%d-%H%M%S)

# 参数解析
TARGET="${1:-all}"
if [ "$TARGET" = "all" ]; then
  SKILLS=$(ls -d "$ROOT"/maxhub-* | xargs -n1 basename)
else
  SKILLS="$TARGET"
fi

echo "====================================="
echo " ClawHub 本地三层扫描·免费版"
echo " 时间：$TS"
echo "====================================="

# 检查扫描器
if [ ! -f "$SCANNER" ]; then
  echo "⚠️  本地静态扫描器未找到，正在安装..."
  clawhub install clawhub-skill-scanner --dir /tmp/scanner-test
fi

PASS=0
WARN=0
FAIL=0

for skill in $SKILLS; do
  SKILL_DIR="$ROOT/$skill"
  if [ ! -d "$SKILL_DIR" ]; then
    echo "⚠️  跳过：$skill 目录不存在"
    continue
  fi

  REPORT="$REPORTS/${skill}-${TS}.json"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔍 扫描 $skill"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # === Layer 2：静态代码分析 ===
  echo "📋 Layer 2 / 静态代码分析（clawhub-skill-scanner）..."
  L2_OUT=$(python3 "$SCANNER" "$SKILL_DIR" 2>&1)
  L2_SCORE=$(echo "$L2_OUT" | grep "RISK SCORE" | grep -oE "[0-9]+/100" | head -1)
  L2_LEVEL=$(echo "$L2_OUT" | grep -oE "🟢 SAFE|🟡 CAUTION|🔶 DANGER|🔴 BLOCKED" | head -1)
  echo "   结果：$L2_SCORE $L2_LEVEL"

  # === Layer 1a：本地 ClawHavoc 黑名单比对 ===
  echo "📋 Layer 1a / ClawHavoc 黑名单比对..."
  BLACKLIST="$SCRIPT_DIR/clawhavoc-blacklist.txt"
  if [ ! -f "$BLACKLIST" ]; then
    cat > "$BLACKLIST" <<'EOF'
# ClawHavoc 已知恶意 skill slug 列表（部分公开样本）
email-triage-pr0
crm-enricher
daily-briefing-v2
calendar-sync-plus
web-scrapper
yahoo-finance-pro
crypto-tracker-v3
notion-sync-v2
slack-bot-helper
github-actions-pro
EOF
  fi
  L1A_HIT=0
  if grep -q "^${skill}$" "$BLACKLIST" 2>/dev/null; then
    L1A_HIT=1
    echo "   ⚠️ 命中 ClawHavoc 黑名单"
  else
    echo "   ✅ 不在黑名单"
  fi

  # === Layer 1b：SHA-256 计算（用于后续 VT 查询，不上传文件）===
  echo "📋 Layer 1b / 计算 SHA-256 指纹..."
  HASH=$(find "$SKILL_DIR" -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.json" \) -not -path "*/.security-audit/*" | sort | xargs cat 2>/dev/null | shasum -a 256 | awk '{print $1}')
  echo "   SHA-256: $HASH"

  # === Layer 1c：可选的 VT 公开 hash 查询（免费 API key）===
  echo "📋 Layer 1c / VirusTotal hash 查询..."
  if [ -n "$VT_API_KEY" ] || [ -f "$HOME/.vt.toml" ]; then
    VT_RESULT=$(curl -s -X GET "https://www.virustotal.com/api/v3/files/$HASH" \
      -H "x-apikey: ${VT_API_KEY:-$(grep apikey $HOME/.vt.toml 2>/dev/null | cut -d'"' -f2)}" 2>/dev/null)
    if echo "$VT_RESULT" | grep -q '"data"'; then
      VT_MAL=$(echo "$VT_RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['data']['attributes']['last_analysis_stats']['malicious'])" 2>/dev/null || echo "?")
      echo "   命中 VT 全球库：恶意引擎数 = $VT_MAL"
    else
      echo "   未命中 VT（新文件，未公开过）"
      VT_MAL=0
    fi
    sleep 16  # VT 免费版限速
  else
    echo "   ⏭️  跳过（未配置 VT_API_KEY，运行 \`vt init\` 注册免费 key）"
    VT_MAL="not_configured"
  fi

  # === 汇总裁决（模拟 ClawHub buildModerationSnapshot）===
  VERDICT="clean"
  REASON_CODES=()
  if [ "$L1A_HIT" = "1" ]; then
    VERDICT="malicious"
    REASON_CODES+=("malicious.clawhavoc_blacklist")
  fi
  case "$L2_LEVEL" in
    *BLOCKED*) VERDICT="malicious"; REASON_CODES+=("static.blocked") ;;
    *DANGER*)  [ "$VERDICT" != "malicious" ] && VERDICT="suspicious"; REASON_CODES+=("static.danger") ;;
    *CAUTION*) [ "$VERDICT" = "clean" ] && VERDICT="suspicious"; REASON_CODES+=("static.caution") ;;
  esac
  if [ "$VT_MAL" != "0" ] && [ "$VT_MAL" != "?" ] && [ "$VT_MAL" != "not_configured" ]; then
    VERDICT="malicious"
    REASON_CODES+=("vt.malicious")
  fi

  # 写入 JSON 报告
  python3 - <<PYEOF > "$REPORT"
import json
report = {
    "skill": "$skill",
    "scan_time": "$TS",
    "sha256": "$HASH",
    "moderationVerdict": "$VERDICT",
    "moderationReasonCodes": [$(IFS=,; echo "\"${REASON_CODES[*]:-clean}\"")],
    "layers": {
        "layer1a_clawhavoc_blacklist": {"hit": $L1A_HIT},
        "layer1c_virustotal_hash": "$VT_MAL",
        "layer2_static_analysis": {"score": "$L2_SCORE", "level": "$L2_LEVEL"}
    }
}
print(json.dumps(report, indent=2, ensure_ascii=False))
PYEOF

  # 计数
  case "$VERDICT" in
    clean) PASS=$((PASS+1)); echo "✅ $skill 通过（$VERDICT）" ;;
    suspicious) WARN=$((WARN+1)); echo "🟡 $skill 警告（$VERDICT，已记录到报告）" ;;
    malicious) FAIL=$((FAIL+1)); echo "🔴 $skill 失败（$VERDICT，已记录到报告）" ;;
  esac
done

echo ""
echo "====================================="
echo " 扫描总结"
echo "====================================="
echo "✅ Clean:      $PASS"
echo "🟡 Suspicious: $WARN"
echo "🔴 Malicious:  $FAIL"
echo "📁 报告目录：$REPORTS"
echo "====================================="

# Layer 3 提示
echo ""
echo "ℹ️  Layer 3（文档/代码一致性审查）由当前 Agent 即时执行，"
echo "    可在对话中要求 Agent 审查具体 skill 的 SKILL.md 与 references/ 一致性。"
