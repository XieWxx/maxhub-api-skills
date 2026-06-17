# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-bilibili` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担七个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：版本检查 + SkillHub / ClawHub 更新，详见 [`update.md`](./update.md)

---

## 0. 🚨 全局红线 (Global Forbidden) — 强制约束

> 以下规则**最高优先级**，任何端点级 ERR 表都不得突破。

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 v1 改成 v2 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **写入操作禁止替代**：`fetch_vip_video_playurl` 失败时，禁止用 `fetch_video_playurl` 等"模拟"或"伪造"大会员结果；必须 STOP 并让用户重新确认参数。
4. **写入端点 5xx 重试 ≤ 1 次**：避免重复扣配额。读端点可重试 1 次。
5. **找不到能力必须 STOP 并告知用户**：用户请求 Bilibili 不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **oneOf 参数必须传且只传一个**：如 `av_id` 与 `bv_id` 二选一，同时传或都不传 → 400/422，必须修正后重试。
7. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
8. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
9. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
10. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 28 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发送弹幕 / 评论 / 回复 | 仅支持读评论/弹幕，无写入端点 |
| 点赞 / 投币 / 收藏操作 | 无社交互动写入端点 |
| 关注 / 取消关注 | 仅支持读关注/粉丝统计 |
| 上传视频 / 修改视频信息 | 无上传/修改端点 |
| 删除投稿 / 收藏夹 | 无删除端点 |
| 修改用户资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播推流 / 开播 | 仅支持读直播间信息，无推流端点 |
| 视频下载（非播放地址） | 仅提供播放流地址，不提供文件下载 |
| 弹幕发送 / 弹幕过滤设置 | 仅支持读弹幕，无写入端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在 Bilibili 官方应用中操作"，**禁止**用 fetch_video_playurl / fetch_video_comments 等端点伪造结果。

---

## 0.2 原子化 + 编排入口 (Atomic & Orchestration)

> Agent 可通过两层入口快速定位端点与链路：
> - **原子层**：[`atoms/_index.md`](./atoms/_index.md) — 每个端点封装为原子（atom_id ↔ endpoint_id 映射 + 幂等性 + 链路角色）
> - **编排层**：[`recipes/_index.md`](./recipes/_index.md) — 每个用户目标封装为 Recipe（trigger_keywords + 多步链路 + 容错）
> - **推荐流程**：用户语义 → `recipes/_index.md` 匹配 Recipe → 按 Recipe 的 Atomic Steps 调用 `atoms/_index.md` 中的原子

---


## 0.3 ⚡ Agent 速查 · 同义参数表 (Synonym Quick-Lookup)

> 当 agent 拿到上游响应字段时，先查此表确认它是否能直接传给下游端点。
> 同一行的所有字段名指代**同一个标识**，可在跨端点链路中互换（按下游端点要求的实际名称使用）。

| 同义字段组 | 指代 | 典型出处 (OUT) | 典型用途 (IN) |
|-----------|------|---------------|--------------|
| `av_id` / `aid` | AV号/作品aid | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |
| `uid` / `user_id` | 用户ID | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |






## 0.4 📍 endpoints_whitelist.yaml 域内导航 (Loading Map)

> 此 yaml 共 **331 行**。**禁止全文加载**——按下表用 `sed -n` 精确加载所需 domain 段。
> Agent 调用前用 `grep '<endpoint_id>' references/endpoints_whitelist.yaml` 一次确认 id 存在即可，无需读完整文件。

| 域 (Domain) | 端点数 | 行号区间 | 加载命令 |
|------------|-------|---------|---------|
| `Video (video.md)` | 11 | 26–105 | `sed -n '26,105p' references/endpoints_whitelist.yaml` |
| `User (user.md)` | 10 | 106–176 | `sed -n '106,176p' references/endpoints_whitelist.yaml` |
| `Search (search.md)` | 9 | 177–240 | `sed -n '177,240p' references/endpoints_whitelist.yaml` |
| `Comments (comments.md)` | 5 | 241–276 | `sed -n '241,276p' references/endpoints_whitelist.yaml` |
| `Live (live.md)` | 4 | 277–305 | `sed -n '277,305p' references/endpoints_whitelist.yaml` |
| `Collections (collections.md)` | 2 | 306–320 | `sed -n '306,320p' references/endpoints_whitelist.yaml` |
| `Pre-call verification protocol` | 0 | 321–330 | `sed -n '321,330p' references/endpoints_whitelist.yaml` |

## 1. 端点路由索引 (Endpoint Routing Index)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_one_video_app | 用 av_id/bv_id 取视频详情（App 端，oneOf 入口） | video.md | GET | low |
| fetch_one_video_web | 用 bv_id 取视频详情（Web 端） | video.md | GET | low |
| fetch_one_video_v2 | 用 a_id+c_id 取视频详情 V2 | video.md | GET | low |
| fetch_one_video_v3 | 用视频 URL 取视频详情 V3 | video.md | GET | low |
| fetch_video_detail | 用 aid 取视频详情 | video.md | GET | low |
| fetch_video_play_info | 用 URL 取视频播放信息 | video.md | GET | low |
| fetch_video_playurl | 用 bv_id+cid 取视频流地址 | video.md | GET | low |
| fetch_vip_video_playurl | 用 bv_id+cid+cookie 取大会员视频流 ⚠️ POST | video.md | POST | **high ⚠️** |
| fetch_video_subtitle | 用 a_id+c_id 取视频字幕 | video.md | GET | low |
| fetch_video_parts | 用 bv_id 取视频分P信息 | video.md | GET | low |
| bv_to_aid | BV号转AV号 | video.md | GET | low |
| fetch_user_info_app | 用 user_id 取用户信息（App 端） | user.md | GET | low |
| fetch_user_videos_app | 用 user_id 取用户投稿视频（App 端） | user.md | GET | low |
| fetch_user_profile | 用 uid 取用户资料（Web 端） | user.md | GET | low |
| fetch_user_up_stat | 用 uid 取 UP主统计 | user.md | GET | low |
| fetch_user_relation_stat | 用 uid 取关注/粉丝数 | user.md | GET | low |
| fetch_user_post_videos | 用 uid 取投稿视频（Web 端） | user.md | GET | low |
| fetch_user_dynamic | 用 uid 取用户动态 | user.md | GET | low |
| fetch_dynamic_detail | 用 dynamic_id 取动态详情 V1（图文/专栏） | user.md | GET | low |
| fetch_dynamic_detail_v2 | 用 dynamic_id 取动态详情 V2（视频类） | user.md | GET | low |
| fetch_get_user_id | 用分享链接提取用户 ID | user.md | GET | low |
| fetch_search_all | 综合搜索（App 端） | search.md | GET | low |
| fetch_search_by_type | 分类搜索（App 端） | search.md | GET | low |
| fetch_home_feed | 首页推荐流（App 端） | search.md | GET | low |
| fetch_popular_feed | 热门推荐（App 端） | search.md | GET | low |
| fetch_cinema_tab | 影视推荐（App 端，无参数） | search.md | GET | low |
| fetch_bangumi_tab | 番剧推荐（App 端，无参数） | search.md | GET | low |
| fetch_hot_search | 热门搜索（Web 端） | search.md | GET | low |
| fetch_general_search | 综合搜索（Web 端，4 个必填参数） | search.md | GET | low |
| fetch_com_popular | 综合热门（Web 端） | search.md | GET | low |
| fetch_video_comments_app | 用 av_id/bv_id 取视频评论（App 端，oneOf 入口） | comments.md | GET | low |
| fetch_reply_detail | 用 root+av_id/bv_id 取二级回复（App 端） | comments.md | GET | low |
| fetch_video_comments_web | 用 bv_id 取视频评论（Web 端） | comments.md | GET | low |
| fetch_comment_reply | 用 bv_id+rpid 取评论回复（Web 端） | comments.md | GET | low |
| fetch_video_danmaku | 用 cid 取视频弹幕 | comments.md | GET | low |
| fetch_live_room_detail | 用 room_id 取直播间详情 | live.md | GET | low |
| fetch_live_videos | 用 room_id 取直播视频流 | live.md | GET | low |
| fetch_live_streamers | 用 area_id 取分区主播 | live.md | GET | low |
| fetch_all_live_areas | 取所有直播分区（无参数） | live.md | GET | low |
| fetch_collect_folders | 用 uid 取收藏夹列表 | collections.md | GET | low |
| fetch_user_collection_videos | 用 folder_id 取收藏夹内视频 | collections.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `bv_id` — BV号（形如 `BV1xxxxxx`）
- **可从这些端点产出（OUT）**：
  - `fetch_search_all` → `$.data.item[].bvid`（搜索结果）
  - `fetch_search_by_type` → `$.data.result[].bvid`（分类搜索）
  - `fetch_general_search` → `$.data.result[].bvid`（Web 搜索）
  - `fetch_user_post_videos` → `$.data.list.vlist[].bvid`（用户投稿）
  - `fetch_user_videos_app` → `$.data.list.vlist[].bvid`（App 端投稿）
  - `fetch_user_collection_videos` → `$.data.medias[].bvid`（收藏夹视频）
  - `fetch_user_dynamic` → `$.data.cards[].desc.bvid`（动态中的视频）
  - `fetch_home_feed` → `$.data.item[].bvid`（推荐流）
  - `fetch_popular_feed` → `$.data.list[].bvid`（热门推荐）
  - `fetch_com_popular` → `$.data.list[].bvid`（综合热门）
- **可作为输入（IN）**：
  - `fetch_one_video_app`（与 av_id 二选一）
  - `fetch_one_video_web`
  - `fetch_video_playurl`
  - `fetch_vip_video_playurl` ⚠️
  - `fetch_video_parts`
  - `bv_to_aid`
  - `fetch_video_comments_app`（与 av_id 二选一）
  - `fetch_video_comments_web`
  - `fetch_comment_reply`

### `av_id` / `aid` — AV号/作品aid
- **可从这些端点产出（OUT）**：
  - `bv_to_aid` → `$.data.aid`（BV 转 AV）
  - `fetch_one_video_app` → `$.data.aid`（视频详情）
  - `fetch_one_video_web` → `$.data.aid`
  - `fetch_search_all` → `$.data.item[].aid`
  - `fetch_user_post_videos` → `$.data.list.vlist[].aid`
- **可作为输入（IN）**：
  - `fetch_one_video_app`（av_id，与 bv_id 二选一）
  - `fetch_video_detail`（aid）
  - `fetch_video_subtitle`（a_id）
  - `fetch_one_video_v2`（a_id）
  - `fetch_video_comments_app`（av_id，与 bv_id 二选一）
  - `fetch_reply_detail`（av_id，与 bv_id 二选一）

### `cid` — 作品cid（分P ID）
- **可从这些端点产出（OUT）**：
  - `fetch_one_video_app` → `$.data.cid`（视频详情中的 cid）
  - `fetch_one_video_web` → `$.data.cid`
  - `fetch_one_video_v2` → `$.data.cid`
  - `fetch_one_video_v3` → `$.data.cid`
  - `fetch_video_detail` → `$.data.cid`
  - `fetch_video_parts` → `$.data.parts[].cid`（分P列表）
- **可作为输入（IN）**：
  - `fetch_one_video_v2`（c_id）
  - `fetch_video_playurl`（cid）
  - `fetch_vip_video_playurl` ⚠️（cid）
  - `fetch_video_subtitle`（c_id）
  - `fetch_video_danmaku`（cid）

### `uid` / `user_id` — 用户ID
- **可从这些端点产出（OUT）**：
  - `fetch_one_video_app` → `$.data.owner.mid`（视频作者 uid）
  - `fetch_one_video_web` → `$.data.owner.mid`
  - `fetch_get_user_id` → `$.data.uid`（从分享链接提取）
  - `fetch_search_by_type`（search_type=user）→ `$.data.result[].mid`
  - `fetch_live_room_detail` → `$.data.uid`（主播 uid）
- **可作为输入（IN）**：
  - `fetch_user_info_app`（user_id）
  - `fetch_user_videos_app`（user_id）
  - `fetch_user_profile`（uid）
  - `fetch_user_up_stat`（uid）
  - `fetch_user_relation_stat`（uid）
  - `fetch_user_post_videos`（uid）
  - `fetch_user_dynamic`（uid）
  - `fetch_collect_folders`（uid）

### `dynamic_id` — 动态ID
- **可从这些端点产出（OUT）**：
  - `fetch_user_dynamic` → `$.data.cards[].desc.dynamic_id`
- **可作为输入（IN）**：
  - `fetch_dynamic_detail`
  - `fetch_dynamic_detail_v2`

### `folder_id` — 收藏夹ID
- **可从这些端点产出（OUT）**：
  - `fetch_collect_folders` → `$.data.list[].id`
- **可作为输入（IN）**：
  - `fetch_user_collection_videos`

### `area_id` — 直播分区ID
- **可从这些端点产出（OUT）**：
  - `fetch_all_live_areas` → `$.data.data[].id`
- **可作为输入（IN）**：
  - `fetch_live_streamers`

### `room_id` — 直播间ID
- **可从这些端点产出（OUT）**：
  - `fetch_live_streamers` → `$.data.list[].roomid`
  - `fetch_search_by_type`（search_type=live）→ `$.data.result[].roomid`
- **可作为输入（IN）**：
  - `fetch_live_room_detail`
  - `fetch_live_videos`

### `rpid` — 评论/回复ID
- **可从这些端点产出（OUT）**：
  - `fetch_video_comments_app` → `$.data.replies[].rpid`
  - `fetch_video_comments_web` → `$.data.replies[].rpid`
- **可作为输入（IN）**：
  - `fetch_comment_reply`

### `root` — 一级评论ID
- **可从这些端点产出（OUT）**：
  - `fetch_video_comments_app` → `$.data.replies[].rpid`（一级评论的 rpid 即 root）
  - `fetch_video_comments_web` → `$.data.replies[].rpid`
- **可作为输入（IN）**：
  - `fetch_reply_detail`

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

> 以下为 MaxHub API 平台官方 HTTP 状态码定义。**Agent 必须**按此表语义判定错误类型，不要自行解读。

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400 Bad Request** | 请求格式错误或参数不正确 | • 参数缺失 / 类型错 / 格式不符 / 互斥参数同时传<br>• 偶尔出现于服务器内部错误（罕见，按 422 处理） |
| **401 Unauthorized** | API 令牌身份无效 | • API 令牌无效<br>• 缺少 API 令牌<br>• 无法验证 API 令牌<br>• API 令牌状态无效或未被激活<br>• API 令牌已过期<br>• 用户不存在 |
| **402 Payment Required** | 余额不足 / 付费路由 | • 余额不足，此路由需要付费，**允许使用免费额度**<br>• 余额不足，此路由需要付费，**不接受免费额度** |
| **403 Forbidden** | 已认证但无权限 | • 缺少路由访问权限<br>• 账户已禁用<br>• 邮箱未验证<br>• API Token 权限不足 |
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线<br>• 资源（bv_id/uid 等）不存在或已删除 |
| **429 Too Many Requests** | 请求速率超限 | • 请求速度过快，超过速率限制（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | • 上游异常，无法完成请求（5xx 通常归入此类，含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> ⚠️ **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。自检通过后再走重试或 STOP。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错（读端点） | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试 1 次；仍失败 STOP | ≤1 次 | 查端点 reference IN 表 |
| **400** | 参数错（**写端点 ⚠️ fetch_vip_video_playurl**） | **先做 §3.1 防臆造自检 (B)** → 让用户重新确认参数，**禁止静默重试** | 0 | 查 video.md fetch_vip_video_playurl IN 表 |
| **401** | API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 | **STOP**，提示用户检查或更换 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足（允许免费额度） | 告知用户当前免费额度已耗尽，可选择充值 | 0 | https://www.aconfig.cn |
| **402** | 余额不足（不接受免费额度） | 告知用户该端点为付费路由，必须充值 | 0 | https://www.aconfig.cn |
| **403** | 缺少路由访问权限 / API Token 权限不足 | **STOP**，提示用户当前 Token 无该端点权限，需联系平台 | 0 | https://www.aconfig.cn |
| **403** | 账户已禁用 | **STOP**，提示用户账户被禁用 | 0 | https://www.aconfig.cn |
| **403** | 邮箱未验证 | **STOP**，提示用户先到控制台验证邮箱 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（疑似 Agent 臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP，**禁止改路径段重试** | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在（bv_id/uid 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在，**STOP** | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP，禁止改路径重试；若 SKILL 长期未更新，提示用户运行 §5 SKILL 更新检查 | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §5 |
| **422** | 参数校验失败（如 oneOf 互斥同时传） | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次；写端点不重试 | 读≤1 / 写=0 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障（读端点） | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **500/502/503/504** | 上游故障（**写端点 ⚠️ fetch_vip_video_playurl**） | 等 3 秒重试 1 次封顶，仍失败 STOP（**禁止重复扣配额**） | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0` 配额耗尽** | 业务层配额错 | 读 `message_zh` 告知，不重试 | 0 | https://www.aconfig.cn |
| **HTTP 200 + `code != 0` Cookie 无效** | 大会员 Cookie 过期/无效（仅 fetch_vip_video_playurl） | 读 `message_zh` 告知用户更新 Cookie | 0 | — |
| **HTTP 200 + `code != 0` 其他** | 其他业务错误 | 读 `message_zh` 报告，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 ⚠️ 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径（如 `/api/v1/bilibili/web/fetch_one_video`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 v1→v2 / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `bv_id` / `uid` / `cid` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`bvid` vs `bv_id`）、缩写错（`avid` vs `av_id`）、参数名错（`video_id` vs `bv_id`）？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `oneOf(av_id, bv_id)` 类型是否做到"传且只传一个"？
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？数组是否被传成 JSON 字符串？
   - 是否符合 `pattern` / `enum` / `min` / `max` 等 Constraints？
4. **传参方式正确**
   - GET 端点：参数应放在 query string，不应放在 request body
   - POST 端点（fetch_vip_video_playurl）：参数放在 request body（JSON）
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？例如 `sort_by` / `lang` 等 Agent 自行编造的字段
   - 这类参数即使被忽略也可能触发 400
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查；如仍无法定位 → STOP，向用户报告参数错误

> 💡 **自检方法**：建议在响应解析阶段把请求 URL、headers、body 与 `endpoints_whitelist.yaml` + reference IN 表做一次结构化对比，再决定是否重试。

---

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错（读端点） | 1 次（修正参数后） | 立即 | ❌ 不换端点 |
| 400 / 422 参数错（**写端点 ⚠️ fetch_vip_video_playurl**） | **0 次**（必须用户重新确认参数） | — | ❌ 不换端点 |
| 401 鉴权错（含令牌过期/未激活/用户不存在） | 0 | — | STOP |
| **402 余额不足 / 付费路由** | 0 | — | STOP，告知用户充值或升级 |
| 403 权限/账户禁用/邮箱未验证 | 0 | — | STOP，按子场景给修复指引 |
| 404 / 410 路径错或资源不存在 | 0 | — | ❌ 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | ❌ |
| 5xx 上游错（读端点） | 1 次 | 固定 3s | ✅ 走"端点替换矩阵" |
| 5xx 上游错（**写端点 ⚠️ fetch_vip_video_playurl**） | **1 次封顶**（避免重复扣配额） | 固定 3s | ❌ |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告，不重试 |

### 降级策略原则
1. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
2. **数据时效降级**：实时接口失败 → 命中 `cache_url` 取缓存数据（注意时效性）
3. **端点版本降级**：V3/V2 接口失败 → 降级到 V1 或 App 端接口（字段可能不同，必须显式告知）
4. **平台端降级**：Web 端失败 → 尝试 App 端同功能端点（参数名可能不同，注意 uid vs user_id）

### 链式调用容错原则
- **第 1 步失败** → 整条链 **STOP**
- **中间步失败** → 返回截止前已有的数据 + **显式告知**用户缺失了哪一段
- **最后步失败** → 返回前序数据 + 告知最终步未完成
- **跨文件链路失败** → 返回当前文件已得数据 + 告知用户后续步骤未完成

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

> 当首选端点持续 5xx / 数据为空 / 验证失败时，按此表寻找语义相近的替代端点。
> **强约束**：
> - 替换前必须**显式告知**用户："由于 X 失败，已切换到 Y，数据完整度可能下降"
> - 替换次数 ≤ 1 次（禁止无限链式替换）
> - 写入端点（fetch_vip_video_playurl）**无替代**，失败必须 STOP

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| fetch_one_video_web | fetch_one_video_app（需转换 bv_id→av_id 或用 bv_id） | App 端可用 | App 端字段结构可能不同 |
| fetch_one_video_web | fetch_one_video_v3（如有视频 URL） | 用户提供了视频链接 | V3 返回格式可能不同 |
| fetch_one_video_web | fetch_video_detail（需先 bv_to_aid 获取 aid） | 多一次调用 | 字段名可能不同 |
| fetch_video_playurl | fetch_video_play_info（如有视频 URL） | 用户提供了视频链接 | play_info 返回更完整的播放信息 |
| fetch_video_comments_web | fetch_video_comments_app（需 av_id 或 bv_id） | App 端可用 | App 端分页方式不同（next_offset vs pn） |
| fetch_comment_reply | fetch_reply_detail（App 端，需 root + av_id/bv_id） | App 端可用 | App 端参数不同 |
| fetch_user_profile | fetch_user_info_app（需 uid→user_id） | App 端可用 | 参数名不同（uid vs user_id） |
| fetch_user_post_videos | fetch_user_videos_app（需 uid→user_id） | App 端可用 | 参数名和分页方式不同 |
| fetch_dynamic_detail | fetch_dynamic_detail_v2 | 仅当用户需要视频类动态数据 | V2 不含 favorite/coin，含 comment/forward/like |
| fetch_dynamic_detail_v2 | fetch_dynamic_detail | 仅当用户需要图文/专栏类动态数据 | V1 不含 comment/forward/like，含 favorite/coin |
| fetch_general_search | fetch_search_all（App 端） | App 端可用 | App 端参数更少，排序选项不同 |
| fetch_general_search | fetch_search_by_type（App 端） | App 端可用 | App 端有 search_type 分类 |
| fetch_vip_video_playurl | **无替代** ⚠️ | — | 写入操作，失败 STOP，让用户重新确认 Cookie |
| fetch_live_room_detail | 无替代 | — | 直播间无替代来源 |
| fetch_collect_folders | 无替代 | — | 收藏夹无替代来源 |
| fetch_video_danmaku | 无替代 | — | 弹幕无替代来源 |
| bv_to_aid | fetch_one_video_web（从返回的 aid 字段获取） | 多返回数据 | 返回更多字段，非专门转换 |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。
>
> **特别注意 Bilibili 双端路径差异**：
> - App 端路径前缀：`/api/v1/bilibili/app/`
> - Web 端路径前缀：`/api/v1/bilibili/web/`
> - 禁止混用前缀（如把 App 端参数传到 Web 端路径，或反之）

---

## 6. SKILL 更新机制（版本检查 + SkillHub / ClawHub 更新）

> 完整流程见 [`update.md`](./update.md)。本节给出关键索引：

### 何时建议用户更新
- ✅ 合法路径（已通过 §3.1(A) 自检）持续返回 **404 / 410**
- ✅ 多个端点连续返回 410（路由批量下线）
- ✅ 上游响应字段结构与 reference OUT 表明显不一致
- ✅ 用户主动询问"版本/更新"
- ✅ 距上次成功调用已超过 30 天

### 何时**禁止**建议更新
- ❌ 收到 401（鉴权错）、402（余额）、403（权限）、网络/DNS 错——这些**不是** SKILL 版本问题
- ❌ §3.1(A) 自检**失败**——这是 Agent 臆造路径，不是 SKILL 过时

### 更新通道（按优先级）
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-bilibili`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-bilibili
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-bilibili`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
