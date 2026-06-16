# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-xigua` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担六个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：详见 [`update.md`](./update.md)

---

## 0. 🚨 全局红线 (Global Forbidden) — 强制约束

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单)。
3. **找不到能力必须 STOP 并告知用户**：用户请求西瓜视频不支持的能力 → 直接告知。
4. **替换/降级前必须显式告知用户**；禁止静默降级。
5. **404 / 410 强制 STOP**：禁止自行修改路径段后重试。
6. **业务 `code != 0` 不重试**：读 `message_zh` 报告用户。
7. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

| 不支持的能力 | 说明 |
|------------|------|
| 发布/删除视频 | 无写入端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 无写入端点 |
| 转发 / 分享操作 | 无写入端点 |
| 发送私信 | 无私信端点 |
| 修改用户资料 | 无修改端点 |
| 充值 / 计费查询 | 在 https://www.aconfig.cn 控制台查询 |
| 首页推荐/Feed | 无 Feed 端点 |
| 热榜/热搜 | 无热榜端点 |
| 直播 | 无直播端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在西瓜视频官方应用中操作"。

---

## 0.2 原子化 + 编排入口 (Atomic & Orchestration)

> Agent 可通过两层入口快速定位端点与链路：
> - **原子层**：[`atoms/_index.md`](./atoms/_index.md) — 每个端点封装为原子（atom_id ↔ endpoint_id 映射 + 幂等性 + 链路角色）
> - **编排层**：[`recipes/_index.md`](./recipes/_index.md) — 每个用户目标封装为 Recipe（trigger_keywords + 多步链路 + 容错）
> - **推荐流程**：用户语义 → `recipes/_index.md` 匹配 Recipe → 按 Recipe 的 Atomic Steps 调用 `atoms/_index.md` 中的原子

---

## 1. 端点路由索引 (Endpoint Routing Index)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_one_video | 用 item_id 取视频数据（V1，含相关推荐） | post.md | GET | low |
| fetch_one_video_v2 | 用 item_id 取视频数据（V2，信息更全面） | post.md | GET | low |
| fetch_one_video_play_url | 用 item_id 取视频播放链接（已解码） | post.md | GET | low |
| fetch_video_comment_list | 用 item_id 取视频评论列表 | post.md | GET | low |
| search_video | 按关键词搜索视频 | post.md | GET | low |
| fetch_user_info | 用 user_id 取用户信息 | user.md | GET | low |
| fetch_user_post_list | 用 user_id 取用户作品列表 | user.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

### `item_id` — 视频/作品 ID（纯数字字符串）
- **可从链接中获取**：西瓜视频分享链接中的数字
- **产出**：`search_video` → `$.data.data[].item_id`
- **输入**：fetch_one_video / fetch_one_video_v2 / fetch_one_video_play_url / fetch_video_comment_list

### `user_id` — 用户 ID（纯数字字符串）
- **产出**：
  - `fetch_one_video` / `fetch_one_video_v2` → `$.data.user.user_id`（视频作者）
  - `fetch_video_comment_list` → `$.data.comments[].user_id`（评论者）
  - `search_video` → `$.data.data[].user_info.user_id`（搜索结果作者）
- **输入**：fetch_user_info / fetch_user_post_list

### `max_behot_time` — 用户作品分页游标
- **产出**：`fetch_user_post_list` → `$.data.data[-1].behot_time`（最后一条数据的 behot_time）
- **输入**：fetch_user_post_list 的下一次调用

### `offset` — 评论/搜索分页偏移量
- 评论分页：首次传 0，后续传上一次返回的 offset
- 搜索分页：首次传 0，后续传上一次返回的 offset

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400** | 请求格式错误 | 参数缺失 / 类型错 |
| **401** | API 令牌无效 | 令牌无效 / 缺少 / 过期 |
| **402** | 余额不足 | 余额不足 |
| **403** | 无权限 | 缺少路由权限 / 账户禁用 |
| **404** | 数据未找到 | 路径不在白名单 / 资源不存在 |
| **429** | 限流 | 请求过快 |
| **500** | 服务器错误 | 上游异常（含 502/503/504） |

### 错误码 → 行动（决策表）

| HTTP 码 | 行动 | 重试 |
|--------|------|------|
| 400 | 先做 §3.1(B) → 修正后重试 1 次 | ≤1 次 |
| 401 | STOP，提示检查 API Key | 0 |
| 402 | STOP，告知充值 | 0 |
| 403 | STOP | 0 |
| 404 | 先做 §3.1(A) → STOP | 0 |
| 410 | 先做 §3.1(A) → STOP，建议更新 | 0 |
| 429 | 退避重试 | ≤2 次 |
| 5xx | 等 3s 重试 | ≤1 次 |
| 网络/DNS | STOP | 0 |
| 业务 code≠0 | 读 message_zh | 0 |

### § 3.1 防臆造自检清单

#### (A) 收到 404 时
1. 路径是否逐字符匹配 `endpoints_whitelist.yaml`？
2. Method 是否匹配？
3. 参数键名是否在 `required` ∪ `optional` 中？
4. 资源 ID 是否来自合法响应字段？
5. 全通过 → 判定"资源不存在"，STOP

#### (B) 收到 400 / 422 时
1. 参数名是否逐字符匹配 IN 表？
2. 必填项是否齐全？
3. 类型/格式是否匹配？
4. 传参方式是否正确？
5. 是否有臆造参数？
6. 全通过 → 按 `message_zh` 排查

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避 | 换端点 |
|---------|---------|------|-------|
| 400/422 | 1 次 | 立即 | ❌ |
| 401/402/403 | 0 | — | STOP |
| 404/410 | 0 | — | ❌ |
| 429 | 2 次 | 指数+抖动 | ❌ |
| 5xx | 1 次 | 3s | ✅ 走替换矩阵 |
| 网络/DNS | 0 | — | STOP |

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| fetch_one_video_v2 | fetch_one_video（同 item_id） | 用户接受缺标题但有相关推荐 | V1 缺标题等信息，但有相关视频推荐 |
| fetch_one_video | fetch_one_video_v2（同 item_id） | 用户需要完整信息 | V2 信息更全面，但无相关推荐 |
| fetch_one_video_play_url | fetch_one_video_v2（取播放地址字段） | 用户接受 Base64 编码需自行解码 | V2 返回的播放地址为 Base64 编码 |
| fetch_video_comment_list | 无替代 | — | 评论无替代，失败 STOP |
| search_video | 无替代 | — | — |
| fetch_user_info | 无替代 | — | — |
| fetch_user_post_list | 无替代 | — | — |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。

---

## 6. SKILL 更新机制

> 完整流程见 [`update.md`](./update.md)。

### 何时建议用户更新
- ✅ 合法路径持续 404 / 410
- ✅ 多端点连续 410
- ✅ 用户主动询问版本

### 何时禁止建议更新
- ❌ 401 / 402 / 403 / 网络错

### 更新通道
1. `skillhub upgrade maxhub-xigua`（国内首选）
2. `clawhub upgrade maxhub-xigua`（国际）
3. `git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本：`3.7.2`
