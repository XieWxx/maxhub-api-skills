# Recipe: 工具 / Tools

> 工具域编排链路，覆盖指纹→加密→msToken 生成流程等场景。

---

## fingerprint_msToken — 指纹→加密strData→msToken

**Inputs:** `browser_type`
**Atomic Steps:**
1. `gen_fingerprint` (starter) ← `browser_type` → 输出 `fingerprint_data`
2. `encrypt_strData` (relay) ← `data=fingerprint_data` → 输出 `encrypted_strData`
3. `gen_msToken` (standalone) ← `random_strData=true` + `browser_type` → 输出 msToken
**Output:** 浏览器指纹 + 加密数据 + msToken
**Fallback:** 第 1 步失败：STOP；第 2 步失败：跳过加密直接生成 msToken
