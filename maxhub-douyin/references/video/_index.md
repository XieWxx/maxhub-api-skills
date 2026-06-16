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

## 子文件路由 (Sub-file Router)

| 子领域 | 文件 | 端点数 | 用户目标关键词 |
|--------|------|--------|----------|
| 视频详情+高清链接 | [./detail.md](./detail.md) | 11 | "看视频详情" / "下载高清" / "解析分享链接" |
| 批量+统计+分享 | [./batch-stats.md](./batch-stats.md) | 9 | "批量取视频" / "看播放量" / "生成短链接" |
| Feed+合集/短剧/音乐/话题/频道 | [./feed-collection.md](./feed-collection.md) | 20 | "看首页推荐" / "看合集" / "看短剧" / "浏览频道" |

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
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](../param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](../param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](../endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（aweme_id/sec_user_id/mix_id 等）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app/v3→web 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](../param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](../param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/复数错？
  - 必填项是否齐全？oneOf 是否做到"传且只传一个"？
  - 类型 / pattern / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）；不要自行重试

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
