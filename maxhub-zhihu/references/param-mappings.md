# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-zhihu` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担六个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：版本检查 + ClawHub / SkillHub 更新，详见 [`update.md`](./update.md)

---

## 0. 🚨 全局红线 (Global Forbidden) — 强制约束

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)。
3. **找不到能力必须 STOP 并告知用户**：用户请求知乎不支持的能力 → 直接告知，**禁止**拼凑伪造。
4. **替换/降级前必须显式告知用户**；禁止静默降级。
5. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。
6. **业务 `code != 0` 不重试**：读 `message_zh` 报告用户。
7. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

| 不支持的能力 | 说明 |
|------------|------|
| 发布/删除文章/回答 | 无写入端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 仅支持读关注列表 |
| 转发 / 分享操作 | 无写入端点 |
| 发送私信 / DM | 无私信端点 |
| 修改用户资料 | 无修改端点 |
| 充值 / 计费查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播 / WebSocket 流 | 无实时流端点 |
| 知乎 Live / 圆桌 | 无对应端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在知乎官方应用中操作"。

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
| fetch_column_articles | 用 column_id 取专栏文章列表 | post.md | GET | low |
| fetch_column_article_detail | 用 article_id 取文章详情 | post.md | GET | low |
| fetch_column_recommend | 用 article_id 取相似专栏推荐 | post.md | GET | low |
| fetch_column_relationship | 用 article_id 取文章互动关系 | post.md | GET | low |
| fetch_column_comment_config | 用 article_id 取评论区配置 | post.md | GET | low |
| fetch_comment_v5 | 用 answer_id 取评论区 | post.md | GET | low |
| fetch_sub_comment_v5 | 用 comment_id 取子评论 | post.md | GET | low |
| fetch_question_answers | 用 question_id 取问题回答列表 | post.md | GET | low |
| fetch_hot_recommend | 取首页推荐 | post.md | GET | low |
| fetch_hot_list | 取首页热榜 | post.md | GET | low |
| fetch_video_list | 取首页视频榜 | post.md | GET | low |
| fetch_article_search_v3 | 按关键词搜索文章/回答 | search.md | GET | low |
| fetch_user_search_v3 | 按关键词搜索用户 | search.md | GET | low |
| fetch_topic_search_v3 | 按关键词搜索话题 | search.md | GET | low |
| fetch_scholar_search_v3 | 按关键词搜索论文 | search.md | POST | low |
| fetch_ai_search | 发起 AI 搜索 | search.md | GET | low |
| fetch_ai_search_result | 用 message_id 取 AI 搜索结果 | search.md | GET | low |
| fetch_video_search_v3 | 按关键词搜索视频 | search.md | GET | low |
| fetch_column_search_v3 | 按关键词搜索专栏 | search.md | GET | low |
| fetch_salt_search_v3 | 按关键词搜索盐选内容 | search.md | GET | low |
| fetch_ebook_search_v3 | 按关键词搜索电子书 | search.md | GET | low |
| fetch_preset_search | 取搜索预设词 | search.md | GET | low |
| fetch_search_recommend | 取搜索发现 | search.md | GET | low |
| fetch_search_suggest | 取搜索预测词 | search.md | GET | low |
| fetch_user_info | 用 user_url_token 取用户信息 | user.md | GET | low |
| fetch_user_followees | 用 user_url_token 取关注列表 | user.md | GET | low |
| fetch_user_followers | 用 user_url_token 取粉丝列表 | user.md | GET | low |
| fetch_user_articles | 用 user_url_token 取用户文章 | user.md | GET | low |
| fetch_user_included_articles | 用 user_url_token 取被收录文章 | user.md | GET | low |
| fetch_user_follow_columns | 用 user_url_token 取订阅专栏 | user.md | GET | low |
| fetch_user_follow_questions | 用 user_url_token 取关注问题 | user.md | GET | low |
| fetch_user_follow_collections | 用 user_url_token 取关注收藏 | user.md | GET | low |
| fetch_user_follow_topics | 用 user_url_token 取关注话题 | user.md | GET | low |
| fetch_recommend_followees | 取推荐关注列表 | user.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

### `article_id` — 文章 ID
- **产出**：`fetch_column_articles` → `$.data.data[].id`
- **输入**：`fetch_column_article_detail` / `fetch_column_recommend` / `fetch_column_relationship` / `fetch_column_comment_config`

### `answer_id` — 回答 ID
- **产出**：`fetch_question_answers` → `$.data.data[].id`
- **输入**：`fetch_comment_v5`

### `comment_id` — 评论 ID
- **产出**：`fetch_comment_v5` → `$.data.data[].id`
- **输入**：`fetch_sub_comment_v5`

### `question_id` — 问题 ID
- **产出**：`fetch_hot_list` → `$.data.data[].target.id`（热榜中的问题）
- **输入**：`fetch_question_answers`

### `column_id` — 专栏 ID
- **产出**：`fetch_user_follow_columns` → `$.data.data[].id`
- **输入**：`fetch_column_articles`

### `user_url_token` — 用户 URL Token（知乎用户标识）
- **产出**：
  - `fetch_user_search_v3` → `$.data.data[].url_token`
  - `fetch_comment_v5` → `$.data.data[].author.url_token`
  - `fetch_question_answers` → `$.data.data[].author.url_token`
  - `fetch_user_followees` → `$.data.data[].url_token`
  - `fetch_user_followers` → `$.data.data[].url_token`
- **输入**：user.md 全部 user 系端点

### `message_id` — AI 搜索消息 ID
- **产出**：`fetch_ai_search` → `$.data.message_id`
- **输入**：`fetch_ai_search_result`

### `search_hash_id` — 搜索哈希 ID（用于翻页）
- **产出**：各搜索端点首次响应 → `$.data.search_hash_id`
- **输入**：同搜索端点的后续翻页请求

### `offset / cursor` — 分页参数（通用）
- 各端点分页方式不同，详见各 reference 文件 IN 表

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400** | 请求格式错误或参数不正确 | 参数缺失 / 类型错 / 格式不符 |
| **401** | API 令牌身份无效 | 令牌无效 / 缺少 / 过期 / 未激活 |
| **402** | 余额不足 / 付费路由 | 余额不足 |
| **403** | 已认证但无权限 | 缺少路由权限 / 账户禁用 |
| **404** | 路由数据未找到 | 路径不在白名单 / 资源不存在 |
| **429** | 请求速率超限 | 请求过快 |
| **500** | 服务器内部错误 | 上游异常（含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 |
|--------|-------|------|------|---------|
| **400** | 参数错 | **先做 §3.1(B)** → 修正后重试 1 次 | ≤1 次 | 查端点 IN 表 |
| **401** | 令牌无效 | **STOP**，提示用户检查 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足 | **STOP**，告知用户充值 | 0 | https://www.aconfig.cn |
| **403** | 权限不足 | **STOP** | 0 | https://www.aconfig.cn |
| **404** | 路径臆造 | **先做 §3.1(A)** → STOP | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在 | **先做 §3.1(A)** → 告知用户 | 0 | — |
| **410** | 上游下线 | **先做 §3.1(A)** → STOP，建议更新 | 0 | [`update.md`](./update.md) |
| **429** | 限流 | 退避重试 | ≤2 次 | — |
| **5xx** | 上游故障 | 等 3s 重试 | ≤1 次 | 走替换矩阵 |

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
4. 传参方式是否正确（GET→query，POST→body）？
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
| 业务 code≠0 | 0 | — | 读 message_zh |

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| fetch_column_article_detail | fetch_column_articles（在列表中匹配 article_id） | 须有 column_id | 字段较少 |
| fetch_comment_v5 | 无替代 | — | 评论无替代，失败 STOP |
| fetch_sub_comment_v5 | 无替代 | — | 同上 |
| fetch_question_answers | 无替代 | — | — |
| fetch_hot_recommend | fetch_hot_list | 用户接受热榜替代推荐 | 数据源不同 |
| fetch_hot_list | fetch_hot_recommend | 用户接受推荐替代热榜 | 数据源不同 |
| fetch_user_info | fetch_user_search_v3（已知用户名） | 须有用户名关键词 | 字段更少 |
| fetch_user_articles | fetch_article_search_v3（用作者名搜索） | 须有作者名 | 可能混入他人文章 |
| fetch_ai_search → fetch_ai_search_result | 无替代 | — | AI 搜索为异步链路，失败 STOP |
| 各搜索端点 | 无替代 | — | — |

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
1. `skillhub upgrade maxhub-zhihu`（国内首选）
2. `clawhub upgrade maxhub-zhihu`（国际）
3. `git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本：`3.7.2`（读取 [`../_meta.json`](../_meta.json)）
