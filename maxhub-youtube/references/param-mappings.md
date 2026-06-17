# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-youtube` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担六个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：版本检查 + ClawHub / SkillHub 更新，详见 [`update.md`](./update.md)

---

## 0. 全局红线 (Global Forbidden) — 强制约束

> 以下规则**最高优先级**，任何端点级 ERR 表都不得突破。

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 web 改成 web_v2 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **Web 与 Web V2 端点禁止混用**：`/api/v1/youtube/web/` 与 `/api/v1/youtube/web_v2/` 是**两套独立端点**，参数名、返回结构均不同。禁止将 Web 端点的参数名用于 Web V2 端点，反之亦然。
4. **读取端点 5xx 重试 ≤ 1 次**：避免过度请求。YouTube 数据获取均为只读操作。
5. **找不到能力必须 STOP 并告知用户**：用户请求 YouTube 不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **分页 token 禁止跨端点使用**：`continuation_token` / `nextToken` 仅可用于**同一端点**的翻页，禁止将 A 端点的 token 传给 B 端点。
7. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
8. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
9. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
10. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。

---

## 0.1 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 37 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 上传/删除视频 | 无视频写入端点 |
| 上传/管理 Shorts | 无 Shorts 写入端点 |
| 发布/删除社区帖子 | 无帖子写入端点 |
| 发表/删除评论 | 仅支持读评论，无写入端点 |
| 点赞 / 踩 / 收藏 | 无社交互动写入端点 |
| 订阅 / 取消订阅频道 | 无频道订阅端点 |
| 创建/管理播放列表 | 无播放列表端点 |
| 修改频道资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播 / WebSocket 流 | 无实时流端点 |
| 视频下载到本地 | 仅提供流媒体 URL，不提供下载执行 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在 YouTube 官方应用中操作"，**禁止**用 get_video_info / search_video 等端点伪造结果。

---

## 0.2 原子化 + 编排入口 (Atomic & Orchestration)

> Agent 可通过两层入口快速定位端点与链路：
> - **原子层**：[`atoms/_index.md`](./atoms/_index.md) — 每个端点封装为原子（atom_id ↔ endpoint_id 映射 + 幂等性 + 链路角色）
> - **编排层**：[`recipes/_index.md`](./recipes/_index.md) — 每个用户目标封装为 Recipe（trigger_keywords + 多步链路 + 容错）
> - **推荐流程**：用户语义 → `recipes/_index.md` 匹配 Recipe → 按 Recipe 的 Atomic Steps 调用 `atoms/_index.md` 中的原子

---






## 0.4 📍 endpoints_whitelist.yaml 域内导航 (Loading Map)

> 此 yaml 共 **308 行**。**禁止全文加载**——按下表用 `sed -n` 精确加载所需 domain 段。
> Agent 调用前用 `grep '<endpoint_id>' references/endpoints_whitelist.yaml` 一次确认 id 存在即可，无需读完整文件。

| 域 (Domain) | 端点数 | 行号区间 | 加载命令 |
|------------|-------|---------|---------|
| `Video - Web (video.md)` | 5 | 27–62 | `sed -n '27,62p' references/endpoints_whitelist.yaml` |
| `Video - Web V2 (video.md)` | 8 | 63–119 | `sed -n '63,119p' references/endpoints_whitelist.yaml` |
| `Channel - Web (channel.md)` | 6 | 120–162 | `sed -n '120,162p' references/endpoints_whitelist.yaml` |
| `Channel - Web V2 (channel.md)` | 6 | 163–205 | `sed -n '163,205p' references/endpoints_whitelist.yaml` |
| `Comments - Web V2 (comments.md)` | 5 | 206–241 | `sed -n '206,241p' references/endpoints_whitelist.yaml` |
| `Search - Web (search.md)` | 2 | 242–256 | `sed -n '242,256p' references/endpoints_whitelist.yaml` |
| `Search - Web V2 (search.md)` | 6 | 257–299 | `sed -n '257,299p' references/endpoints_whitelist.yaml` |
| `Pre-call verification protocol` | 0 | 300–307 | `sed -n '300,307p' references/endpoints_whitelist.yaml` |

## 1. 端点路由索引 (Endpoint Routing Index)

### Video 端点 (video.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| web_get_video_info | 获取视频元数据及下载信息（Web V1） | video.md | GET | low |
| web_get_video_info_v2 | 获取视频元数据 V2（Web V1） | video.md | GET | low |
| web_get_video_subtitles | 获取视频字幕（需先取 subtitle_url） | video.md | GET | low |
| web_get_relate_video | 获取推荐视频 | video.md | GET | low |
| web_get_trending_videos | 获取趋势视频 | video.md | GET | low |
| web_v2_get_video_info | 获取视频详情（Web V2，原始数据） | video.md | GET | low |
| web_v2_get_video_info_v2 | 获取视频详情 V2（Web V2，结构化数据） | video.md | GET | low |
| web_v2_get_video_streams | 获取视频流信息（URL 为 null，需两步法） | video.md | GET | low |
| web_v2_get_video_streams_v2 | 获取视频流信息 V2（URL 已解密，一步到位） | video.md | GET | low |
| web_v2_get_signed_stream_url | 获取已签名的视频流 URL（需 itag） | video.md | GET | low |
| web_v2_get_video_captions | 获取视频字幕（Web V2） | video.md | GET | low |
| web_v2_get_video_captions_v2 | 获取视频字幕 V2（Web V2 备用） | video.md | GET | low |
| web_v2_get_related_videos | 获取视频相似内容（Web V2） | video.md | GET | low |

### Channel 端点 (channel.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| web_get_channel_id | 用频道名称获取频道 ID | channel.md | GET | low |
| web_get_channel_id_v2 | 用频道 URL 获取频道 ID（支持多种格式） | channel.md | GET | low |
| web_get_channel_url | 用频道 ID 获取频道 URL | channel.md | GET | low |
| web_get_channel_info | 获取频道信息 | channel.md | GET | low |
| web_get_channel_videos_v2 | 获取频道视频列表（支持排序/类型筛选） | channel.md | GET | low |
| web_get_channel_short_videos | 获取频道短视频 | channel.md | GET | low |
| web_v2_get_channel_description | 获取频道描述信息（需两次请求取完整数据） | channel.md | GET | low |
| web_v2_get_channel_id | 用频道 URL 获取频道 ID（Web V2） | channel.md | GET | low |
| web_v2_get_channel_url | 用频道 ID 获取频道 URL（Web V2） | channel.md | GET | low |
| web_v2_get_channel_videos | 获取频道视频列表（Web V2，结构化数据） | channel.md | GET | low |
| web_v2_get_channel_shorts | 获取频道短视频列表（Web V2） | channel.md | GET | low |
| web_v2_get_channel_community_posts | 获取频道社区帖子列表 | channel.md | GET | low |

### Comments 端点 (comments.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| web_v2_get_video_comments | 获取视频一级评论 | comments.md | GET | low |
| web_v2_get_video_comment_replies | 获取视频二级评论/回复 | comments.md | GET | low |
| web_v2_get_post_detail | 获取社区帖子详情 | comments.md | GET | low |
| web_v2_get_post_comments | 获取社区帖子评论 | comments.md | GET | low |
| web_v2_get_post_comment_replies | 获取社区帖子评论回复 | comments.md | GET | low |

### Search 端点 (search.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| web_search_video | 搜索视频（Web） | search.md | GET | low |
| web_search_channel | 搜索频道内视频（Web） | search.md | GET | low |
| web_v2_get_general_search | 综合搜索（原始数据） | search.md | GET | low |
| web_v2_get_general_search_v2 | 综合搜索 V2（结构化数据，推荐） | search.md | GET | low |
| web_v2_get_shorts_search | Shorts 搜索（原始数据） | search.md | GET | low |
| web_v2_get_shorts_search_v2 | Shorts 搜索 V2（结构化数据，推荐） | search.md | GET | low |
| web_v2_get_search_suggestions | 获取搜索推荐词 | search.md | GET | low |
| web_v2_search_channels | 搜索频道（Web V2） | search.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `video_id` — 视频 ID（11 位字母数字，如 `dQw4w9WgXcQ`）
- **可从这些端点产出（OUT）**：
  - `web_v2_get_general_search_v2` → `$.data.videos[].video_id`
  - `web_v2_get_shorts_search_v2` → `$.data.shorts[].video_id`
  - `web_search_video` → 搜索结果中的 video_id
  - `web_v2_get_channel_videos` → `$.data.videos[].video_id`
  - `web_v2_get_channel_shorts` → `$.data.shorts[].video_id`
  - `web_v2_get_related_videos` → `$.data.related_videos[].video_id`
  - `web_get_relate_video` → 推荐结果中的 video_id
  - `web_search_channel` → 搜索结果中的 video_id
- **可作为输入（IN）**：
  - `web_get_video_info` / `web_get_video_info_v2`
  - `web_v2_get_video_info` / `web_v2_get_video_info_v2`
  - `web_get_relate_video`
  - `web_v2_get_video_streams` / `web_v2_get_video_streams_v2`
  - `web_v2_get_signed_stream_url`
  - `web_v2_get_video_captions` / `web_v2_get_video_captions_v2`
  - `web_v2_get_related_videos`
  - `web_v2_get_video_comments`

### `channel_id` — 频道 ID（以 UC 开头，如 `UCXuqSBlHAE6Xw-yeJA0Tunw`）
- **可从这些端点产出（OUT）**：
  - `web_get_channel_id` → `$.data.channel_id`
  - `web_get_channel_id_v2` → `$.data.channel_id`
  - `web_v2_get_channel_id` → `$.data.channel_id`
  - `web_v2_get_general_search_v2` → `$.data.channels[].channel_id`
  - `web_v2_search_channels` → `$.data.channels[].channel_id`
  - `web_v2_get_video_info_v2` → `$.data.channel_id`
  - `web_v2_get_channel_description` → `$.data.channel_id`
- **可作为输入（IN）**：
  - `web_get_channel_info`
  - `web_get_channel_url` / `web_v2_get_channel_url`
  - `web_get_channel_videos_v2`
  - `web_get_channel_short_videos`
  - `web_v2_get_channel_description`
  - `web_v2_get_channel_videos`
  - `web_v2_get_channel_shorts`
  - `web_v2_get_channel_community_posts`
  - `web_search_channel`

### `post_id` — 社区帖子 ID（以 Ugk 开头）
- **可从这些端点产出（OUT）**：
  - `web_v2_get_channel_community_posts` → `$.data.posts[].post_id`
- **可作为输入（IN）**：
  - `web_v2_get_post_detail`
  - `web_v2_get_post_comments`

### `continuation_token` — 分页令牌（通用）
- **产出/输入**：所有支持分页的端点（同端点的下一次调用使用上次响应的 `continuation_token` / `nextToken`，并以 `has_more` 或响应中是否包含新 token 判定是否继续翻页）
- **关键约束**：`continuation_token` **禁止跨端点使用**，仅可用于产出它的同一端点

### `reply_continuation_token` — 评论回复令牌
- **产出**：
  - `web_v2_get_video_comments` → `$.data.comments[].reply_continuation_token`
  - `web_v2_get_post_comments` → `$.data.comments[].reply_continuation_token`
- **输入**：
  - `web_v2_get_video_comment_replies`（视频评论回复）
  - `web_v2_get_post_comment_replies`（帖子评论回复）
- **关键约束**：视频评论的 `reply_continuation_token` 只能用于 `web_v2_get_video_comment_replies`，帖子评论的只能用于 `web_v2_get_post_comment_replies`

### `itag` — 视频格式标识符
- **产出**：`web_v2_get_video_streams` → `$.data.formats[].itag` + `$.data.adaptive_formats[].itag`
- **输入**：`web_v2_get_signed_stream_url.itag`

### `subtitle_url` — 字幕 URL（Web 端专用）
- **产出**：`web_get_video_info` → 响应中的 subtitleUrl 字段
- **输入**：`web_get_video_subtitles.subtitle_url`

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
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线<br>• 资源（video_id/channel_id 等）不存在或已删除 |
| **429 Too Many Requests** | 请求速率超限 | • 请求速度过快，超过速率限制（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | • 上游异常，无法完成请求（5xx 通常归入此类，含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。自检通过后再走重试或 STOP。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错 | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试 1 次；仍失败 STOP | ≤1 次 | 查端点 reference IN 表 |
| **401** | API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 | **STOP**，提示用户检查或更换 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足（允许免费额度） | 告知用户当前免费额度已耗尽，可选择充值 | 0 | https://www.aconfig.cn |
| **402** | 余额不足（不接受免费额度） | 告知用户该端点为付费路由，必须充值 | 0 | https://www.aconfig.cn |
| **403** | 缺少路由访问权限 / API Token 权限不足 | **STOP**，提示用户当前 Token 无该端点权限，需联系平台 | 0 | https://www.aconfig.cn |
| **403** | 账户已禁用 | **STOP**，提示用户账户被禁用 | 0 | https://www.aconfig.cn |
| **403** | 邮箱未验证 | **STOP**，提示用户先到控制台验证邮箱 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（疑似 Agent 臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP，**禁止改路径段重试** | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在（video_id/channel_id 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在，**STOP** | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP，禁止改路径重试；若 SKILL 长期未更新，提示用户运行 §5 SKILL 更新检查 | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §5 |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障 | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0` 配额耗尽** | 业务层配额错 | 读 `message_zh` 告知，不重试 | 0 | https://www.aconfig.cn |
| **HTTP 200 + `code != 0` 其他** | 其他业务错误 | 读 `message_zh` 报告，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径（`/api/v1/youtube/web/<id>` 或 `/api/v1/youtube/web_v2/<id>`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 web→web_v2 / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `video_id` / `channel_id` / `post_id` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`sortBy` vs `sort_by`）、复数错（`videos` vs `video`）、缩写错（`vid` vs `video_id`）？
   - **特别注意**：Web 端和 Web V2 端参数名不同（如 Web 用 `lang`，Web V2 用 `language_code`；Web 用 `nextToken`，Web V2 用 `continuation_token`）
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `oneOf(video_id, video_url)` 类型是否做到"传且只传一个"？
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？数组是否被传成 JSON 字符串？
   - 是否符合 `pattern` / `enum` / `min` / `max` 等 Constraints？
4. **传参方式正确**
   - GET 端点：参数应放在 query string，不应放在 request body
   - 是否使用了不被该端点支持的 header / cookie？
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？
   - 这类参数即使被忽略也可能触发 400
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查；如仍无法定位 → STOP，向用户报告参数错误

---

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错 | 1 次（修正参数后） | 立即 | 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| **402 余额不足 / 付费路由** | 0 | — | STOP，告知用户充值或升级 |
| 403 权限/账户禁用/邮箱未验证 | 0 | — | STOP，按子场景给修复指引 |
| 404 / 410 路径错或资源不存在 | 0 | — | 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | 不换端点 |
| 5xx 上游故障 | 1 次 | 固定 3s | 走"端点替换矩阵" |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告，不重试 |

### 降级策略原则
1. **Web V2 优先降级到 Web**：Web V2 端点失败时，若存在对应 Web 端点，可降级使用（需告知用户返回结构可能不同）
2. **V2 优先降级到 V1**：如 `web_v2_get_general_search_v2` 失败 → 降级到 `web_v2_get_general_search`（数据未清洗）
3. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
4. **维度降级**：频道描述失败 → 改用 `web_get_channel_info` 取概要

### 链式调用容错原则
- **第 1 步失败** → 整条链 **STOP**
- **中间步失败** → 返回截止前已有的数据 + **显式告知**用户缺失了哪一段
- **最后步失败** → 返回前序数据 + 告知最终步未完成

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

> 当首选端点持续 5xx / 数据为空 / 验证失败时，按此表寻找语义相近的替代端点。
> **强约束**：
> - 替换前必须**显式告知**用户："由于 X 失败，已切换到 Y，数据完整度可能下降"
> - 替换次数 ≤ 1 次（禁止无限链式替换）

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| web_v2_get_video_info_v2 | web_v2_get_video_info | V2 返回空字段时（年龄限制等） | V1 字段更全但部分场景不稳定 |
| web_v2_get_video_info_v2 | web_get_video_info | Web V2 全部不可用时 | 返回结构不同，含流媒体数据 |
| web_v2_get_video_streams_v2 | web_v2_get_video_streams + web_v2_get_signed_stream_url | V2 不可用时 | 需两步法，先取 itag 再取 URL |
| web_v2_get_video_captions | web_v2_get_video_captions_v2 | 字幕列表为空时 | V2 为备用实现，覆盖更好 |
| web_v2_get_video_captions | web_get_video_subtitles | Web V2 不可用时 | 需先从 get_video_info 取 subtitle_url |
| web_v2_get_general_search_v2 | web_v2_get_general_search | V2 不可用时 | 返回原始数据，需自行解析 |
| web_v2_get_shorts_search_v2 | web_v2_get_shorts_search | V2 不可用时 | 返回原始数据，需自行解析 |
| web_v2_get_channel_description | web_get_channel_info | Web V2 不可用时 | 字段较少，无注册时间等高级信息 |
| web_v2_get_channel_videos | web_get_channel_videos_v2 | Web V2 不可用时 | 参数名不同（lang vs language_code） |
| web_v2_get_channel_id | web_get_channel_id_v2 | Web V2 不可用时 | 功能相同 |
| web_v2_get_channel_id | web_get_channel_id | 有频道名称但无 URL 时 | 仅支持名称查询，不支持 URL 格式 |
| web_v2_get_related_videos | web_get_relate_video | Web V2 不可用时 | 返回结构不同 |
| web_v2_get_video_comments | 无替代 | — | 评论无替代来源，失败直接 STOP |
| web_v2_get_video_comment_replies | 无替代 | — | 同上 |
| web_v2_get_post_detail | 无替代 | — | 帖子详情无替代 |
| web_v2_get_post_comments | 无替代 | — | 帖子评论无替代 |
| web_v2_get_post_comment_replies | 无替代 | — | 同上 |
| web_search_video | web_v2_get_general_search_v2 | Web 端不可用时 | V2 返回结构化数据，更推荐 |
| web_search_channel | web_v2_get_general_search_v2（type=channel） | Web 端不可用时 | 需在 V2 搜索结果中过滤频道 |
| web_v2_search_channels | web_v2_get_general_search_v2（type=channel） | 专用频道搜索不可用时 | 结果中需手动过滤频道类型 |
| web_get_trending_videos | 无替代 | — | 趋势视频无替代来源 |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。

---

## 6. SKILL 更新机制（版本检查 + ClawHub / SkillHub 更新）

> 完整流程见 [`update.md`](./update.md)。本节给出关键索引：

### 何时建议用户更新
- 合法路径（已通过 §3.1(A) 自检）持续返回 **404 / 410**
- 多个端点连续返回 410（路由批量下线）
- 上游响应字段结构与 reference OUT 表明显不一致
- 用户主动询问"版本/更新"
- 距上次成功调用已超过 30 天

### 何时**禁止**建议更新
- 收到 401（鉴权错）、402（余额）、403（权限）、网络/DNS 错——这些**不是** SKILL 版本问题
- §3.1(A) 自检**失败**——这是 Agent 臆造路径，不是 SKILL 过时

### 更新通道（按优先级）
1. **国内首选**：`skillhub upgrade maxhub-youtube`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-youtube
2. **国际主源**：`clawhub upgrade maxhub-youtube`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
