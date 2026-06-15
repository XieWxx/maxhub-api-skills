# Douyin Video / 抖音视频

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

视频详情（单个/批量/分享链接）、高清播放链接、视频统计、分享/短链接/二维码、合集/短剧详情与列表、音乐详情与视频列表、话题详情与视频列表、相关推荐、频道/垂类内容 Feed、弹幕、挑战赛作品。**aweme_id 与 sec_user_id 多在本文件首步产出**，是评论、用户、搜索等链式调用的常见起点。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。

---

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_v3_fetch_one_video | ⭐⭐⭐ 首选 | 用 aweme_id 取单个视频详情（**链式起点**） | GET | /api/v1/douyin/app/v3/fetch_one_video | low |
| app_v3_fetch_one_video_v3 | ⭐⭐⭐ 首选 | 用 aweme_id 取视频/文章详情（无版权限制） | GET | /api/v1/douyin/app/v3/fetch_one_video_v3 | low |
| app_v3_fetch_one_video_v2 | ⭐ 降级 | V2 版本，V1 返回空时尝试 | GET | /api/v1/douyin/app/v3/fetch_one_video_v2 | low |
| web_fetch_one_video | ⭐⭐ 条件 | Web 版视频详情（含锚点信息） | GET | /api/v1/douyin/web/fetch_one_video | low |
| web_fetch_one_video_v2 | ⭐ 降级 | Web V2 版本 | GET | /api/v1/douyin/web/fetch_one_video_v2 | low |
| app_v3_fetch_one_video_by_share_url | ⭐⭐ 条件 | 用分享链接取视频详情（App V3） | GET | /api/v1/douyin/app/v3/fetch_one_video_by_share_url | low |
| web_fetch_one_video_by_share_url | ⭐ 降级 | 用分享链接取视频详情（Web，画质高但字段少） | GET | /api/v1/douyin/web/fetch_one_video_by_share_url | low |
| app_v3_fetch_video_high_quality_play_url | ⭐⭐⭐ 首选 | 取最高画质播放链接（aweme_id/share_url 二选一） | GET | /api/v1/douyin/app/v3/fetch_video_high_quality_play_url | low |
| web_fetch_video_high_quality_play_url | ⭐⭐ 条件 | Web 版最高画质播放链接 | GET | /api/v1/douyin/web/fetch_video_high_quality_play_url | low |
| app_v3_fetch_multi_video_high_quality_play_url | ⭐⭐ 条件 | 批量取最高画质播放链接（App V3） | POST | /api/v1/douyin/app/v3/fetch_multi_video_high_quality_play_url | **high** |
| web_fetch_multi_video_high_quality_play_url | ⭐ 降级 | 批量取最高画质播放链接（Web） | POST | /api/v1/douyin/web/fetch_multi_video_high_quality_play_url | **high** |
| app_v3_fetch_multi_video | ⭐⭐ 条件 | 批量获取视频详情 V1（最多 10 个） | POST | /api/v1/douyin/app/v3/fetch_multi_video | **high** |
| app_v3_fetch_multi_video_v2 | ⭐⭐⭐ 首选 | 批量获取视频详情 V2（最多 50 个） | POST | /api/v1/douyin/app/v3/fetch_multi_video_v2 | **high** |
| web_fetch_multi_video | ⭐ 降级 | 批量获取视频详情（Web） | POST | /api/v1/douyin/web/fetch_multi_video | **high** |
| app_v3_fetch_video_statistics | ⭐⭐⭐ 首选 | 取视频统计数据（含播放数，最多 2 个） | GET | /api/v1/douyin/app/v3/fetch_video_statistics | low |
| app_v3_fetch_multi_video_statistics | ⭐⭐ 条件 | 批量取视频统计数据（最多 50 个） | GET | /api/v1/douyin/app/v3/fetch_multi_video_statistics | low |
| app_v3_add_video_play_count | ⭐ 特殊 | 增加视频播放量（副作用写入，需确认） | GET | /api/v1/douyin/app/v3/add_video_play_count | **high** |
| app_v3_fetch_share_info_by_share_code | ⭐⭐ 条件 | 用分享口令取分享信息 | GET | /api/v1/douyin/app/v3/fetch_share_info_by_share_code | low |
| app_v3_generate_douyin_short_url | ⭐⭐ 条件 | 生成抖音短链接 | GET | /api/v1/douyin/app/v3/generate_douyin_short_url | low |
| app_v3_generate_douyin_video_share_qrcode | ⭐⭐ 条件 | 生成视频分享二维码 | GET | /api/v1/douyin/app/v3/generate_douyin_video_share_qrcode | low |
| web_fetch_home_feed | ⭐⭐ 条件 | 取首页推荐 Feed（作品冷启动入口） | POST | /api/v1/douyin/web/fetch_home_feed | **high** |
| web_fetch_related_posts | ⭐⭐ 条件 | 取相关推荐视频 | GET | /api/v1/douyin/web/fetch_related_posts | low |
| web_fetch_one_video_danmaku | ⭐⭐ 条件 | 取视频弹幕数据 | GET | /api/v1/douyin/web/fetch_one_video_danmaku | low |
| web_fetch_video_channel_result | ⭐⭐ 条件 | 取频道内容 | GET | /api/v1/douyin/web/fetch_video_channel_result | low |
| web_fetch_challenge_posts | ⭐⭐ 条件 | 取挑战赛视频列表 | POST | /api/v1/douyin/web/fetch_challenge_posts | **high** |
| app_v3_fetch_video_mix_detail | ⭐⭐ 条件 | 取合集详情 | GET | /api/v1/douyin/app/v3/fetch_video_mix_detail | low |
| app_v3_fetch_video_mix_post_list | ⭐⭐ 条件 | 取合集视频列表 | GET | /api/v1/douyin/app/v3/fetch_video_mix_post_list | low |
| app_v3_fetch_user_series_list | ⭐⭐ 条件 | 取用户短剧列表 | GET | /api/v1/douyin/app/v3/fetch_user_series_list | low |
| app_v3_fetch_series_detail | ⭐⭐ 条件 | 取短剧详情 | GET | /api/v1/douyin/app/v3/fetch_series_detail | low |
| app_v3_fetch_series_video_list | ⭐⭐ 条件 | 取短剧视频列表 | GET | /api/v1/douyin/app/v3/fetch_series_video_list | low |
| app_v3_fetch_music_detail | ⭐⭐ 条件 | 取音乐详情 | GET | /api/v1/douyin/app/v3/fetch_music_detail | low |
| app_v3_fetch_music_video_list | ⭐⭐ 条件 | 取音乐关联视频列表 | GET | /api/v1/douyin/app/v3/fetch_music_video_list | low |
| app_v3_fetch_hashtag_detail | ⭐⭐ 条件 | 取话题详情 | GET | /api/v1/douyin/app/v3/fetch_hashtag_detail | low |
| app_v3_fetch_hashtag_video_list | ⭐⭐ 条件 | 取话题视频列表 | GET | /api/v1/douyin/app/v3/fetch_hashtag_video_list | low |
| web_fetch_series_aweme | ⭐⭐ 条件 | 取短剧频道内容 | GET | /api/v1/douyin/web/fetch_series_aweme | low |
| web_fetch_knowledge_aweme | ⭐⭐ 条件 | 取知识频道内容 | GET | /api/v1/douyin/web/fetch_knowledge_aweme | low |
| web_fetch_game_aweme | ⭐⭐ 条件 | 取游戏频道内容 | GET | /api/v1/douyin/web/fetch_game_aweme | low |
| web_fetch_cartoon_aweme | ⭐⭐ 条件 | 取动漫频道内容 | GET | /api/v1/douyin/web/fetch_cartoon_aweme | low |
| web_fetch_music_aweme | ⭐⭐ 条件 | 取音乐频道内容 | GET | /api/v1/douyin/web/fetch_music_aweme | low |
| web_fetch_food_aweme | ⭐⭐ 条件 | 取美食频道内容 | GET | /api/v1/douyin/web/fetch_food_aweme | low |

---

## 链式调用图谱 (Chain Recipes)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看视频 + 高清链接 | app_v3_fetch_one_video → app_v3_fetch_video_high_quality_play_url | `$.data.aweme_id` → `aweme_id` | 第 1 步失败：STOP；第 2 步失败：返回视频详情 + "高清链接暂不可取" |
| 看视频 + 统计 | app_v3_fetch_one_video → app_v3_fetch_video_statistics | `$.data.aweme_id` → `aweme_ids` | 第 2 步失败：返回视频详情 + "统计数据暂不可取" |
| 看视频 + 评论 | app_v3_fetch_one_video → 跳转 `comments.md` | `$.data.aweme_id` → `aweme_id` | 跨文件链路，详见 comments.md |
| 看视频 + 相关推荐 | app_v3_fetch_one_video → web_fetch_related_posts | `$.data.aweme_id` → `aweme_id` | 第 2 步空数据：返回视频详情 + "暂无相关推荐" |
| 看视频 + 弹幕 | web_fetch_one_video → web_fetch_one_video_danmaku | `$.data.aweme_id` → `item_id` | 第 2 步失败：返回视频详情 + "弹幕暂不可取" |
| 分享链接 → 视频详情 + 高清 | app_v3_fetch_one_video_by_share_url → app_v3_fetch_video_high_quality_play_url | `$.data.aweme_id` → `aweme_id` | 第 1 步失败：STOP |
| Feed → 视频详情 | web_fetch_home_feed → app_v3_fetch_one_video | `$.data.aweme_list[].aweme_id` → `aweme_id` | 批量取首条详情 |
| 合集详情 + 视频列表 | app_v3_fetch_video_mix_detail → app_v3_fetch_video_mix_post_list | `$.data.mix_id` → `mix_id` | 第 1 步失败：STOP |
| 短剧详情 + 视频列表 | app_v3_fetch_series_detail → app_v3_fetch_series_video_list | `$.data.series_id` → `series_id` | 第 1 步失败：STOP |
| 音乐详情 + 视频列表 | app_v3_fetch_music_detail → app_v3_fetch_music_video_list | `$.data.music_id` → `music_id` | 第 1 步失败：STOP |
| 话题详情 + 视频列表 | app_v3_fetch_hashtag_detail → app_v3_fetch_hashtag_video_list | `$.data.ch_id` → `ch_id` | 第 1 步失败：STOP |
| 频道 → 视频详情 | web_fetch_video_channel_result → app_v3_fetch_one_video | `$.data.aweme_list[].aweme_id` → `aweme_id` | 批量取首条详情 |
| 看视频 + 作者主页 | app_v3_fetch_one_video → 跳转 `user.md` | `$.data.author.sec_uid` → `sec_user_id` | 跨文件链路，详见 user.md |
| 批量视频详情 + 高清链接 | app_v3_fetch_multi_video_v2 → app_v3_fetch_multi_video_high_quality_play_url | `$.data[].aweme_id` 拼接 → `aweme_ids` | 第 2 步失败：返回批量详情 + "高清链接暂不可取" |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`user.md` 的 `app_v3_fetch_user_post_videos` / `web_fetch_user_post_videos` 输出 `$.data.aweme_list[].aweme_id` → 本文件多个端点的 `aweme_id`
- **流入本文件**：`search.md` 的 `search_fetch_video_search_v1/v2` 输出 `$.data.data[].aweme_id` → 本文件多个端点的 `aweme_id`
- **流入本文件**：`tools.md` 的 `web_get_aweme_id` 输出 `$.data.aweme_id` → 本文件多个端点的 `aweme_id`
- **流入本文件**：`user.md` 的 `app_v3_fetch_user_series_list` 需要 `sec_user_id` / `user_id` → 本文件 `app_v3_fetch_user_series_list`
- **流出本文件**：`$.data.aweme_id` → `comments.md` 全部评论端点的 `aweme_id`
- **流出本文件**：`$.data.author.sec_uid` → `user.md` 全部 user 系端点的 `sec_user_id`
- **流出本文件**：`$.data.music_id` → 本文件 `app_v3_fetch_music_detail` / `app_v3_fetch_music_video_list`
- **流出本文件**：`$.data.mix_id` → 本文件 `app_v3_fetch_video_mix_detail` / `app_v3_fetch_video_mix_post_list`

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（aweme_id/sec_user_id/mix_id 等）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app/v3→web 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](./param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/复数错？
  - 必填项是否齐全？oneOf 是否做到"传且只传一个"？
  - 类型 / pattern / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）；不要自行重试

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按 `delay = min(8s, 2^attempt) * (0.5 + random*0.5)`；最多重试 2 次
- **禁止**：❌ 立即重试 ❌ 换端点（换端点不能解决限流）

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

### 抖音视频特有：响应状态码语义
- 响应中 `status_code` 值：8 = 海外版权限制/视频不存在/已删除, 5 = 私人内容, 10 = 部分可见
- 遇到上述状态码 → **STOP**，向用户报告具体原因，**禁止**换端点重试

---

## 端点详情

---

### app_v3_fetch_one_video — 获取单个视频详情（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
用 aweme_id 获取单个视频完整详情，支持图文、视频等。**链式调用的常见起点**——大多数 aweme_id 与 sec_user_id 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 aweme_id（纯数字，如 `7448118827402972455`）
- ✅ 链式起点：取 aweme_id 或 sec_user_id
- ✅ 需要完整视频元数据（标题、描述、作者、统计等）
- ❌ 用户提供分享链接 → 用 `app_v3_fetch_one_video_by_share_url`
- ❌ 想看评论 → 直接用 `comments.md` 的 `app_v3_fetch_video_comments`
- ❌ 想要高清播放链接 → 用 `app_v3_fetch_video_high_quality_play_url`
- ❌ 接口返回空 → 尝试 `web_fetch_one_video`（App V3 和 Web 数据源不同）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID，如 `7448118827402972455` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | app_v3_fetch_video_high_quality_play_url / comments.md 全部端点 / app_v3_fetch_video_statistics |
| author.sec_uid | `$.data.author.sec_uid` | 作者加密 ID | user.md 全部 user 系端点 |
| author.uid | `$.data.author.uid` | 作者数字 ID | user.md / xingtu.md |
| music_id | `$.data.music.id` | 背景音乐 ID | app_v3_fetch_music_detail / app_v3_fetch_music_video_list |
| mix_id | `$.data.mix_info.mix_id` | 合集 ID | app_v3_fetch_video_mix_detail / app_v3_fetch_video_mix_post_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aweme_id 不存在 | STOP | 0 | 无替代 |
| status_code=8 | 版权限制/已删除 | STOP，告知用户 | 0 | 尝试 `app_v3_fetch_one_video_v3`（无版权限制版本） |
| status_code=5 | 私人内容 | STOP，告知用户 | 0 | 无替代 |
| 空响应 | App V3 数据源无数据 | 换 Web 版 | ≤1 次 | **替换**：`web_fetch_one_video`（同参数 aweme_id） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_one_video` |

---

### app_v3_fetch_one_video_v2 — 获取单个视频详情 V2（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_one_video_v2`
**Method:** GET · **Risk:** low

#### 用途
V2 版本视频详情接口，返回字段与 V1 略有差异。

#### 何时使用 / 不使用
- ✅ V1 返回空或异常时作为降级
- ❌ 首选 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | 同 app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_one_video_v2` |

---

### app_v3_fetch_one_video_v3 — 获取单个视频详情 V3（无版权限制）

**Full path:** `/api/v1/douyin/app/v3/fetch_one_video_v3`
**Method:** GET · **Risk:** low

#### 用途
V3 版本，解决了版权限制问题。支持视频和文章类型。

#### 何时使用 / 不使用
- ✅ V1 返回 status_code=8（版权限制）时
- ✅ 需要获取文章类型内容
- ❌ 首选 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品或文章 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | 同 app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在 | STOP | 0 | 无替代 |

---

### web_fetch_one_video — 获取单个视频详情（Web）

**Full path:** `/api/v1/douyin/web/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
Web 版视频详情接口，支持锚点信息。若此接口失效，请使用 `web_fetch_one_video_v2` 或 App 版本。

#### 何时使用 / 不使用
- ✅ App V3 版本返回空时的降级选择
- ✅ 需要 `need_anchor_info` 锚点信息
- ❌ 首选 → 用 `app_v3_fetch_one_video`（App V3 数据更完整）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |
| need_anchor_info | boolean | no | default: false | 是否需要锚点信息 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | 同 app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_one_video` |

---

### web_fetch_one_video_v2 — 获取单个视频详情 V2（Web）

**Full path:** `/api/v1/douyin/web/fetch_one_video_v2`
**Method:** GET · **Risk:** low

#### 用途
Web V2 版本视频详情接口。

#### 何时使用 / 不使用
- ✅ `web_fetch_one_video` 失效时的降级
- ❌ 首选 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | 同 app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_one_video_v2` |

---

### app_v3_fetch_one_video_by_share_url — 用分享链接取视频详情（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_one_video_by_share_url`
**Method:** GET · **Risk:** low

#### 用途
通过抖音分享链接（短链接或长链接）获取视频详情。**当用户只提供分享链接时的首选入口**。

#### 何时使用 / 不使用
- ✅ 用户提供分享链接（如 `https://v.douyin.com/e3x2fjE/`）
- ❌ 用户已有 aweme_id → 直接用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_url | string | yes | 合法的抖音分享链接 | 分享链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | app_v3_fetch_one_video / app_v3_fetch_video_high_quality_play_url |
| author.sec_uid | `$.data.author.sec_uid` | 作者加密 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | share_url 格式无效 | 校正 URL | ≤1 次 | — |
| 404 | 链接已失效 | STOP | 0 | 无替代 |

---

### web_fetch_one_video_by_share_url — 用分享链接取视频详情（Web）

**Full path:** `/api/v1/douyin/web/fetch_one_video_by_share_url`
**Method:** GET · **Risk:** low

#### 用途
Web 版分享链接解析。视频画质比 App 版高，但响应字段较少。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ✅ 用户需要更高画质
- ❌ 首选 → 用 `app_v3_fetch_one_video_by_share_url`（字段更完整）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_url | string | yes | 合法的抖音分享链接 | 分享链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_one_video_by_share_url` |

---

### app_v3_fetch_video_high_quality_play_url — 取最高画质播放链接（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_video_high_quality_play_url`
**Method:** GET · **Risk:** low

#### 用途
获取视频的最高画质（原始上传画质）播放链接，非常适合获取高清无水印视频链接。

#### 何时使用 / 不使用
- ✅ 用户明确要"高清"/"无水印"/"下载"视频
- ✅ 链式中间步：从视频详情取高清链接
- ❌ 只想看视频详情 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | oneOf(aweme_id, share_url) | 纯数字字符串 | 作品 ID（优先使用） |
| share_url | string | oneOf(aweme_id, share_url) | 合法的抖音链接 | 分享链接 |
| region | string | no | ISO 国家代码 | 请求出口地区（CN/US/HK），国内用户建议传 CN 获取国内 CDN |

> **二选一逻辑**：aweme_id 与 share_url 必须传且只传一个。优先使用 aweme_id。同时传 → 以 aweme_id 为准；都不传 → 400。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_id | `$.data.video_id` | 视频 ID | 直接交付用户 |
| original_video_url | `$.data.original_video_url` | 最高画质播放链接 | 直接交付用户 |
| video_data | `$.data.video_data` | 视频元数据 | 参考信息 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | aweme_id/share_url 都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 视频不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_video_high_quality_play_url` |

---

### web_fetch_video_high_quality_play_url — 取最高画质播放链接（Web）

**Full path:** `/api/v1/douyin/web/fetch_video_high_quality_play_url`
**Method:** GET · **Risk:** low

#### 用途
Web 版最高画质播放链接接口。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_video_high_quality_play_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | oneOf(aweme_id, share_url) | 纯数字字符串 | 作品 ID |
| share_url | string | oneOf(aweme_id, share_url) | 合法的抖音链接 | 分享链接 |
| region | string | no | ISO 国家代码 | 请求出口地区 |

> **二选一逻辑**：aweme_id 与 share_url 必须传且只传一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| original_video_url | `$.data.original_video_url` | 最高画质播放链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_video_high_quality_play_url` |

---

### app_v3_fetch_multi_video_high_quality_play_url — 批量取最高画质播放链接（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_multi_video_high_quality_play_url`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
批量获取视频最高画质播放链接，最多支持 50 个视频。

#### 何时使用 / 不使用
- ✅ 用户需要批量下载多个高清视频
- ❌ 单个视频 → 用 `app_v3_fetch_video_high_quality_play_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | string | yes | 逗号分隔，最多 50 个 | 作品 ID 列表，如 `"7512756548356492544,7448118827402972455"` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].video_id | `$.data.videos[].video_id` | 视频 ID | 直接交付用户 |
| videos[].original_video_url | `$.data.videos[].original_video_url` | 最高画质链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_multi_video_high_quality_play_url` |

---

### web_fetch_multi_video_high_quality_play_url — 批量取最高画质播放链接（Web）

**Full path:** `/api/v1/douyin/web/fetch_multi_video_high_quality_play_url`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
Web 版批量最高画质播放链接。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_multi_video_high_quality_play_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | string | yes | 逗号分隔，最多 50 个 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].original_video_url | `$.data.videos[].original_video_url` | 最高画质链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_multi_video_high_quality_play_url` |

---

### app_v3_fetch_multi_video — 批量获取视频详情 V1（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_multi_video`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
批量获取视频详情，最多支持 10 个。

#### 何时使用 / 不使用
- ✅ 需要批量获取少量视频详情（≤10）
- ❌ 超过 10 个 → 用 `app_v3_fetch_multi_video_v2`（最多 50 个）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | array | yes | 最多 10 个元素 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].aweme_id | `$.data[].aweme_id` | 作品 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_multi_video_v2` |

---

### app_v3_fetch_multi_video_v2 — 批量获取视频详情 V2（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_multi_video_v2`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
批量获取视频详情 V2 版本，最多支持 50 个。**批量查询首选**。

#### 何时使用 / 不使用
- ✅ 批量获取视频详情（≤50 个）
- ❌ 单个视频 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | array | yes | 最多 50 个元素 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].aweme_id | `$.data[].aweme_id` | 作品 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_multi_video` |

---

### web_fetch_multi_video — 批量获取视频详情（Web）

**Full path:** `/api/v1/douyin/web/fetch_multi_video`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
Web 版批量获取视频详情，最多支持 50 个。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_multi_video_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | array | yes | 最多 50 个元素 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].aweme_id | `$.data[].aweme_id` | 作品 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_multi_video_v2` |

---

### app_v3_fetch_video_statistics — 取视频统计数据

**Full path:** `/api/v1/douyin/app/v3/fetch_video_statistics`
**Method:** GET · **Risk:** low

#### 用途
获取视频统计数据（点赞数、下载数、播放数、分享数）。**大多数接口已不返回播放数，只能通过此接口获取**。

#### 何时使用 / 不使用
- ✅ 需要视频播放数
- ✅ 需要精确的互动统计数据
- ❌ 超过 2 个视频 → 用 `app_v3_fetch_multi_video_statistics`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | string | yes | 逗号分隔，最多 2 个 | 作品 ID，如 `7448118827402972455,7126745726494821640` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| digg_count | `$.data.digg_count` | 点赞数 | 直接交付用户 |
| play_count | `$.data.play_count` | 播放数 | 直接交付用户 |
| share_count | `$.data.share_count` | 分享数 | 直接交付用户 |
| download_count | `$.data.download_count` | 下载数 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_multi_video_statistics — 批量取视频统计数据

**Full path:** `/api/v1/douyin/app/v3/fetch_multi_video_statistics`
**Method:** GET · **Risk:** low

#### 用途
批量获取视频统计数据，最多支持 50 个视频。

#### 何时使用 / 不使用
- ✅ 需要批量获取统计数据（≤50 个）
- ❌ 仅 1-2 个 → 用 `app_v3_fetch_video_statistics`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | string | yes | 逗号分隔，最多 50 个 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].play_count | `$.data[].play_count` | 播放数 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### app_v3_add_video_play_count — 增加视频播放量

**Full path:** `/api/v1/douyin/app/v3/add_video_play_count`
**Method:** GET · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
增加视频播放量。单一作品每次调用增加 1 次播放数，请求约 1000 次后会被抖音限制。**副作用写入操作，必须获得用户明确确认**。

#### 何时使用 / 不使用
- ✅ 用户明确要求增加某视频播放量（需确认）
- ❌ 仅查看播放量 → 用 `app_v3_fetch_video_statistics`
- ❌ 未获得用户确认 → **禁止调用**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_type | integer | yes | 0=视频, 1=图文 | 作品类型 |
| item_id | string | yes | 纯数字字符串 | 作品 ID |
| cookie | string | no | — | 敏感登录凭据；仅在用户明确授权时使用 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 仅返回时间戳和状态码 | 无链式下游 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 429 | 被抖音限制 | STOP，告知用户 | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### app_v3_fetch_share_info_by_share_code — 用分享口令取分享信息

**Full path:** `/api/v1/douyin/app/v3/fetch_share_info_by_share_code`
**Method:** GET · **Risk:** low

#### 用途
通过抖音分享口令（如 `8:/ h@O.kP 05/21 ... 长按复制打开抖音`）获取分享信息。

#### 何时使用 / 不使用
- ✅ 用户提供分享口令（非链接）
- ❌ 用户提供分享链接 → 用 `app_v3_fetch_one_video_by_share_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_code | string | yes | — | 分享口令文本 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | app_v3_fetch_one_video |
| sec_uid | `$.data.sec_uid` | 分享人 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 口令格式无效 | 校正后重试 | ≤1 次 | — |

---

### app_v3_generate_douyin_short_url — 生成抖音短链接

**Full path:** `/api/v1/douyin/app/v3/generate_douyin_short_url`
**Method:** GET · **Risk:** low

#### 用途
将抖音长链接转换为短链接。

#### 何时使用 / 不使用
- ✅ 用户需要生成抖音短链接
- ❌ 需要 Web 版短链接 → 用 `tools.md` 的 `web_handler_shorten_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 合法的抖音链接 | 待转换的长链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| short_url | `$.data.short_url` | 短链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | URL 格式无效 | 校正后重试 | ≤1 次 | — |

---

### app_v3_generate_douyin_video_share_qrcode — 生成视频分享二维码

**Full path:** `/api/v1/douyin/app/v3/generate_douyin_video_share_qrcode`
**Method:** GET · **Risk:** low

#### 用途
生成视频分享二维码。

#### 何时使用 / 不使用
- ✅ 用户需要视频分享二维码
- ❌ 需要短链接 → 用 `app_v3_generate_douyin_short_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| object_id | string | yes | 纯数字字符串 | 作品 ID 或作者 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| qrcode_url | `$.data.qrcode_url` | 二维码图片链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | object_id 无效 | STOP | 0 | 无替代 |

---

### web_fetch_home_feed — 取首页推荐 Feed

**Full path:** `/api/v1/douyin/web/fetch_home_feed`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
获取首页推荐 Feed 流。**作品冷启动入口**——用户没有具体 aweme_id 时，可从此端点采集 aweme_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"抖音有什么热门"等无明确目标作品的场景
- ✅ 链式起点：批量取 aweme_id 后并行调用详情端点
- ❌ 用户已给 aweme_id → 直接 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | — | 请求体参数由 API 内部定义，无需额外传参 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 推荐作品 ID | 本文件多端点 |
| aweme_list[].author.sec_uid | `$.data.aweme_list[].author.sec_uid` | 作者 ID | user.md |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（feed 是最顶层入口） |

---

### web_fetch_related_posts — 取相关推荐视频

**Full path:** `/api/v1/douyin/web/fetch_related_posts`
**Method:** GET · **Risk:** low

#### 用途
获取指定视频的相关推荐视频列表。

#### 何时使用 / 不使用
- ✅ 用户想看"和这个视频类似的视频"
- ❌ 想看视频本身详情 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| count | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 推荐作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### web_fetch_one_video_danmaku — 取视频弹幕数据

**Full path:** `/api/v1/douyin/web/fetch_one_video_danmaku`
**Method:** GET · **Risk:** low

#### 用途
获取视频弹幕数据（按时间段）。

#### 何时使用 / 不使用
- ✅ 用户需要弹幕数据
- ❌ 想看视频详情 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字字符串 | 作品 ID（即 aweme_id） |
| duration | integer | yes | 正整数 | 视频时长（秒） |
| end_time | integer | yes | 正整数 | 结束时间（秒） |
| start_time | integer | yes | ≥0 | 开始时间（秒） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 弹幕数据列表 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或无效 | 校正后重试 | ≤1 次 | — |

---

### web_fetch_video_channel_result — 取频道内容

**Full path:** `/api/v1/douyin/web/fetch_video_channel_result`
**Method:** GET · **Risk:** low

#### 用途
按频道标签获取视频内容列表。

#### 何时使用 / 不使用
- ✅ 用户想浏览特定频道/垂类内容
- ❌ 想看首页推荐 → 用 `web_fetch_home_feed`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | — | 频道标签 ID |
| count | integer | no | default: 20 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | tag_id 无效 | STOP | 0 | 无替代 |

---

### web_fetch_challenge_posts — 取挑战赛视频列表

**Full path:** `/api/v1/douyin/web/fetch_challenge_posts`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
获取指定挑战赛（话题）下的视频列表。

#### 何时使用 / 不使用
- ✅ 用户想看某个挑战赛的视频
- ❌ 想看话题详情 → 用 `app_v3_fetch_hashtag_detail`
- ❌ 想看话题视频列表（GET 版本）→ 用 `app_v3_fetch_hashtag_video_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| challenge_id | string | yes (body) | — | 话题 ID |
| sort_type | integer | no (body) | 0=综合, 1=最热, 2=最新 | 排序方式 |
| cursor | integer | no (body) | default: 0 | 游标 |
| count | integer | no (body) | default: 20 | 数量 |
| cookie | string | no (body) | — | 用户自行提供的 Cookie |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | challenge_id 无效 | STOP | 0 | 替换：`app_v3_fetch_hashtag_video_list`（ch_id） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_hashtag_video_list` |

---

### app_v3_fetch_video_mix_detail — 取合集详情

**Full path:** `/api/v1/douyin/app/v3/fetch_video_mix_detail`
**Method:** GET · **Risk:** low

#### 用途
获取视频合集详情数据。

#### 何时使用 / 不使用
- ✅ 用户想看某个合集的详情
- ✅ 链式起点：取 mix_id 后调用 `app_v3_fetch_video_mix_post_list`
- ❌ 想看合集视频列表 → 直接用 `app_v3_fetch_video_mix_post_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mix_id | string | yes | 纯数字字符串 | 合集 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| mix_id | `$.data.mix_id` | 合集 ID | app_v3_fetch_video_mix_post_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 合集不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_video_mix_post_list — 取合集视频列表

**Full path:** `/api/v1/douyin/app/v3/fetch_video_mix_post_list`
**Method:** GET · **Risk:** low

#### 用途
获取合集下的视频列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已知 mix_id，想看合集内视频
- ❌ 不知 mix_id → 先调用 `app_v3_fetch_video_mix_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mix_id | string | yes | 纯数字字符串 | 合集 ID |
| cursor | integer | no | default: 0 | 游标 |
| count | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 合集不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_user_series_list — 取用户短剧列表

**Full path:** `/api/v1/douyin/app/v3/fetch_user_series_list`
**Method:** GET · **Risk:** low

#### 用途
获取用户的短剧合集列表。

#### 何时使用 / 不使用
- ✅ 用户想看某作者的短剧列表
- ❌ 想看短剧详情 → 用 `app_v3_fetch_series_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, sec_user_id) | 纯数字字符串 | 用户 ID |
| sec_user_id | string | oneOf(user_id, sec_user_id) | Base64 格式 | 用户加密 ID |
| cursor | integer | no | default: 0 | 游标 |

> **二选一逻辑**：user_id 与 sec_user_id 至少传一个。优先使用 sec_user_id。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| series_list[].series_id | `$.data.series_list[].series_id` | 短剧 ID | app_v3_fetch_series_detail / app_v3_fetch_series_video_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 和 sec_user_id 都未传 | 修正后重试 | ≤1 次 | — |

---

### app_v3_fetch_series_detail — 取短剧详情

**Full path:** `/api/v1/douyin/app/v3/fetch_series_detail`
**Method:** GET · **Risk:** low

#### 用途
获取短剧详情信息（名称、描述、封面、作者、总集数、更新状态、播放量、收藏量等）。

#### 何时使用 / 不使用
- ✅ 已知 series_id，想看短剧详情
- ✅ 链式起点：取 series_id 后调用 `app_v3_fetch_series_video_list`
- ❌ 想看短剧视频列表 → 直接用 `app_v3_fetch_series_video_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| series_id | string | yes | 纯数字字符串 | 短剧 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| series_id | `$.data.series_id` | 短剧 ID | app_v3_fetch_series_video_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 短剧不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_series_video_list — 取短剧视频列表

**Full path:** `/api/v1/douyin/app/v3/fetch_series_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取短剧的视频列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已知 series_id，想看短剧内的视频
- ❌ 不知 series_id → 先调用 `app_v3_fetch_series_detail` 或 `app_v3_fetch_user_series_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| series_id | string | yes | 纯数字字符串 | 短剧 ID |
| cursor | integer | no | default: 0 | 游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 短剧不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_music_detail — 取音乐详情

**Full path:** `/api/v1/douyin/app/v3/fetch_music_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定音乐的详情数据。

#### 何时使用 / 不使用
- ✅ 已知 music_id，想看音乐详情
- ✅ 链式起点：取 music_id 后调用 `app_v3_fetch_music_video_list`
- ❌ 想看音乐关联视频 → 直接用 `app_v3_fetch_music_video_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| music_id | string | yes | 纯数字字符串 | 音乐 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| music_id | `$.data.music_id` | 音乐 ID | app_v3_fetch_music_video_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 音乐不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_music_video_list — 取音乐关联视频列表

**Full path:** `/api/v1/douyin/app/v3/fetch_music_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取使用指定音乐的视频列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已知 music_id，想看使用该音乐的视频
- ❌ 不知 music_id → 先调用 `app_v3_fetch_music_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| music_id | string | yes | 纯数字字符串 | 音乐 ID |
| cursor | integer | no | default: 0 | 游标 |
| count | integer | no | default: 10 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 音乐不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_hashtag_detail — 取话题详情

**Full path:** `/api/v1/douyin/app/v3/fetch_hashtag_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题（Hashtag）的详情数据。

#### 何时使用 / 不使用
- ✅ 已知 ch_id，想看话题详情
- ✅ 链式起点：取 ch_id 后调用 `app_v3_fetch_hashtag_video_list`
- ❌ 想看话题视频列表 → 直接用 `app_v3_fetch_hashtag_video_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| ch_id | integer | yes | 正整数 | 话题 ID，如 `1575791821492238` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| ch_id | `$.data.ch_id` | 话题 ID | app_v3_fetch_hashtag_video_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_hashtag_video_list — 取话题视频列表

**Full path:** `/api/v1/douyin/app/v3/fetch_hashtag_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题下的视频列表（含分页和排序）。

#### 何时使用 / 不使用
- ✅ 已知 ch_id，想看话题下的视频
- ❌ 不知 ch_id → 先调用 `app_v3_fetch_hashtag_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| ch_id | string | yes | — | 话题 ID |
| cursor | integer | no | default: 0 | 游标 |
| sort_type | integer | no | 0=综合, 1=最多点赞, 2=最新发布 | 排序方式 |
| count | integer | no | default: 10 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | 无替代 |

---

### web_fetch_series_aweme — 取短剧频道内容

**Full path:** `/api/v1/douyin/web/fetch_series_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取短剧频道内容，支持多种短剧类型筛选。

#### 何时使用 / 不使用
- ✅ 用户想浏览短剧频道
- ❌ 想看某个具体短剧 → 用 `app_v3_fetch_series_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| offset | integer | yes | ≥0 | 页码 |
| count | integer | yes | 正整数 | 每页数量 |
| content_type | integer | yes | 0=热榜, 101=甜宠, 102=搞笑, 104=正能量等 17 种 | 短剧类型 |
| cookie | string | no | — | 敏感登录凭据；仅在用户明确授权时使用 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | content_type 无效 | 校正后重试 | ≤1 次 | — |

---

### web_fetch_knowledge_aweme — 取知识频道内容

**Full path:** `/api/v1/douyin/web/fetch_knowledge_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取知识频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览知识类视频
- ❌ 搜索特定知识内容 → 用 `search.md` 的搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_fetch_game_aweme — 取游戏频道内容

**Full path:** `/api/v1/douyin/web/fetch_game_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取游戏频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览游戏类视频

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_fetch_cartoon_aweme — 取动漫频道内容

**Full path:** `/api/v1/douyin/web/fetch_cartoon_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取二次元/动漫频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览动漫类视频

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_fetch_music_aweme — 取音乐频道内容

**Full path:** `/api/v1/douyin/web/fetch_music_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取音乐频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览音乐类视频

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_fetch_food_aweme — 取美食频道内容

**Full path:** `/api/v1/douyin/web/fetch_food_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取美食频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览美食类视频

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
