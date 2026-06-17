# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-douyin` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

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

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 app/v3 改成 web 试试"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **写入操作禁止替代**：POST 端点（如批量查询、搜索）失败时，禁止用 GET 端点"模拟"或"伪造"批量结果；必须 STOP 并让用户重新确认参数。
4. **写入端点 5xx 重试 ≤ 1 次**：避免重复扣配额。读端点可重试 1 次。
5. **找不到能力必须 STOP 并告知用户**：用户请求抖音不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **cookie 参数仅限用户明确授权**：含 `cookie` 参数的端点（如 `web_fetch_user_post_videos`、`web_fetch_series_aweme` 等），必须在用户明确授权后才可传递，禁止 Agent 自行构造或缓存 cookie。
7. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
8. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
9. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
10. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。

---

## 0.1 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布/删除视频 | 无内容写入端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 仅支持读关注/粉丝列表 |
| 发送私信 | `open_douyin_app_to_send_private_message` 仅打开 App 跳转，非 API 发送 |
| 修改用户资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播推流 / WebSocket 长连接 | `douyin_live_room` 返回弹幕数据，非实时流 |
| 视频下载到本地磁盘 | 仅提供下载链接，不执行下载动作 |
| 生成/训练 AI 视频 | 本 skill 是数据查询工具，非创作工具 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在抖音官方 App 中操作"，**禁止**用 fetch_one_video / search 等端点伪造结果。

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
| `uid` / `user_id` | 用户数字 ID | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |
| `cursor` / `max_cursor` | 分页游标（通用） | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |
| `room_id` / `webcast_id` | 直播间 ID | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |
| `tag_id` / `category_id` | 垂类/分类 ID | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |






## 0.4 📍 endpoints_whitelist.yaml 域内导航 (Loading Map)

> 此 yaml 共 **2260 行**。**禁止全文加载**——按下表用 `sed -n` 精确加载所需 domain 段。
> Agent 调用前用 `grep '<endpoint_id>' references/endpoints_whitelist.yaml` 一次确认 id 存在即可，无需读完整文件。

| 域 (Domain) | 端点数 | 行号区间 | 加载命令 |
|------------|-------|---------|---------|
| `App V3 API (video.md / user.md / comments.md / trending.md / tools.md)` | 39 | 29–335 | `sed -n '29,335p' references/endpoints_whitelist.yaml` |
| `Web API (video.md / user.md / comments.md / live.md / trending.md / tools.md)` | 66 | 336–908 | `sed -n '336,908p' references/endpoints_whitelist.yaml` |
| `Search API (search.md)` | 19 | 909–1080 | `sed -n '909,1080p' references/endpoints_whitelist.yaml` |
| `Billboard API (trending.md)` | 31 | 1081–1322 | `sed -n '1081,1322p' references/endpoints_whitelist.yaml` |
| `Creator API (creator.md)` | 17 | 1323–1442 | `sed -n '1323,1442p' references/endpoints_whitelist.yaml` |
| `Creator V2 API (creator.md)` | 14 | 1443–1569 | `sed -n '1443,1569p' references/endpoints_whitelist.yaml` |
| `Index API (content.md)` | 44 | 1570–1942 | `sed -n '1570,1942p' references/endpoints_whitelist.yaml` |
| `Xingtu API (xingtu.md)` | 22 | 1943–2097 | `sed -n '1943,2097p' references/endpoints_whitelist.yaml` |
| `Xingtu V2 API (xingtu.md)` | 21 | 2098–2251 | `sed -n '2098,2251p' references/endpoints_whitelist.yaml` |
| `Pre-call verification protocol` | 0 | 2252–2259 | `sed -n '2252,2259p' references/endpoints_whitelist.yaml` |

## 1. 端点路由索引 (Endpoint Routing Index)

> 共 9 个 API 子模块，150+ 端点。按 reference 文件分组。

### video/_index.md — 视频相关（含子文件 detail.md / batch-stats.md / feed-collection.md）

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_v3_fetch_one_video | 用 aweme_id 取单个视频详情（App V3） | video/_index.md | GET | low |
| app_v3_fetch_one_video_v2 | 用 aweme_id 取单个视频详情 V2（App V3） | video/_index.md | GET | low |
| app_v3_fetch_one_video_v3 | 用 aweme_id 取视频/文章详情 V3（无版权限制） | video/_index.md | GET | low |
| app_v3_fetch_share_info_by_share_code | 用分享口令取分享信息 | video/_index.md | GET | low |
| app_v3_fetch_multi_video | 批量获取视频详情（App V3） | video/_index.md | POST | **high** |
| app_v3_fetch_multi_video_v2 | 批量获取视频详情 V2（App V3） | video/_index.md | POST | **high** |
| app_v3_fetch_one_video_by_share_url | 用分享链接取视频详情（App V3） | video/_index.md | GET | low |
| app_v3_fetch_video_high_quality_play_url | 取高清播放链接（App V3，aweme_id/share_url 二选一） | video/_index.md | GET | low |
| app_v3_fetch_multi_video_high_quality_play_url | 批量取高清播放链接（App V3） | video/_index.md | POST | **high** |
| app_v3_fetch_video_statistics | 取视频统计数据 | video/_index.md | GET | low |
| app_v3_fetch_multi_video_statistics | 批量取视频统计数据 | video/_index.md | GET | low |
| app_v3_add_video_play_count | 增加视频播放量（副作用写入） | video/_index.md | GET | **high** |
| web_fetch_one_video | 用 aweme_id 取单个视频详情（Web） | video/_index.md | GET | low |
| web_fetch_one_video_v2 | 用 aweme_id 取单个视频详情 V2（Web） | video/_index.md | GET | low |
| web_fetch_one_video_by_share_url | 用分享链接取视频详情（Web） | video/_index.md | GET | low |
| web_fetch_video_high_quality_play_url | 取高清播放链接（Web，aweme_id/share_url 二选一） | video/_index.md | GET | low |
| web_fetch_multi_video_high_quality_play_url | 批量取高清播放链接（Web） | video/_index.md | POST | **high** |
| web_fetch_multi_video | 批量获取视频详情（Web） | video/_index.md | POST | **high** |
| web_fetch_one_video_danmaku | 取视频弹幕数据 | video/_index.md | GET | low |
| web_fetch_home_feed | 取首页推荐 Feed | video/_index.md | POST | **high** |
| web_fetch_related_posts | 取相关推荐视频 | video/_index.md | GET | low |
| app_v3_fetch_video_mix_detail | 取合集详情 | video/_index.md | GET | low |
| app_v3_fetch_video_mix_post_list | 取合集视频列表 | video/_index.md | GET | low |
| app_v3_fetch_user_series_list | 取用户短剧列表 | video/_index.md | GET | low |
| app_v3_fetch_series_video_list | 取短剧视频列表 | video/_index.md | GET | low |
| app_v3_fetch_series_detail | 取短剧详情 | video/_index.md | GET | low |
| app_v3_fetch_music_detail | 取音乐详情 | video/_index.md | GET | low |
| app_v3_fetch_music_video_list | 取音乐关联视频列表 | video/_index.md | GET | low |
| app_v3_fetch_hashtag_detail | 取话题详情 | video/_index.md | GET | low |
| app_v3_fetch_hashtag_video_list | 取话题视频列表 | video/_index.md | GET | low |
| app_v3_generate_douyin_short_url | 生成抖音短链接 | video/_index.md | GET | low |
| app_v3_generate_douyin_video_share_qrcode | 生成视频分享二维码 | video/_index.md | GET | low |
| web_fetch_series_aweme | 取短剧频道内容 | video/_index.md | GET | low |
| web_fetch_knowledge_aweme | 取知识频道内容 | video/_index.md | GET | low |
| web_fetch_game_aweme | 取游戏频道内容 | video/_index.md | GET | low |
| web_fetch_cartoon_aweme | 取动漫频道内容 | video/_index.md | GET | low |
| web_fetch_music_aweme | 取音乐频道内容 | video/_index.md | GET | low |
| web_fetch_food_aweme | 取美食频道内容 | video/_index.md | GET | low |
| web_fetch_video_channel_result | 取频道内容 | video/_index.md | GET | low |
| web_fetch_challenge_posts | 取挑战赛视频列表 | video/_index.md | POST | **high** |

### user.md — 用户相关

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_v3_handler_user_profile | 用 sec_user_id 取用户信息（App V3） | user.md | GET | low |
| app_v3_fetch_user_fans_list | 取用户粉丝列表（App V3） | user.md | GET | low |
| app_v3_fetch_user_post_videos | 取用户主页作品（App V3） | user.md | GET | low |
| app_v3_fetch_user_like_videos | 取用户喜欢视频（App V3） | user.md | GET | low |
| web_handler_user_profile | 用 sec_user_id 取用户信息（Web） | user.md | GET | low |
| web_handler_user_profile_v2 | 用 unique_id（抖音号）取用户信息 | user.md | GET | low |
| web_handler_user_profile_v3 | 用 uid 取用户信息 | user.md | GET | low |
| web_handler_user_profile_v4 | 用 sec_user_id 取用户信息 V4 | user.md | GET | low |
| web_fetch_user_profile_by_uid | 用 uid 取用户资料 | user.md | GET | low |
| web_fetch_user_profile_by_short_id | 用 short_id 取用户资料 | user.md | GET | low |
| web_encrypt_uid_to_sec_user_id | uid 加密为 sec_user_id | user.md | GET | low |
| web_fetch_batch_user_profile_v1 | 批量取用户资料 V1 | user.md | GET | low |
| web_fetch_batch_user_profile_v2 | 批量取用户资料 V2 | user.md | GET | low |
| web_fetch_user_fans_list | 取用户粉丝列表（Web） | user.md | GET | low |
| web_fetch_user_following_list | 取用户关注列表（Web） | user.md | GET | low |
| web_fetch_user_post_videos | 取用户主页作品（Web，需 cookie） | user.md | GET | low |
| web_fetch_user_like_videos | 取用户喜欢视频（Web） | user.md | POST | **high** |
| web_fetch_user_collection_videos | 取用户收藏视频 | user.md | POST | **high** |
| web_fetch_user_collects | 取用户收藏夹列表 | user.md | POST | **high** |
| web_fetch_user_collects_videos | 取收藏夹内视频 | user.md | GET | low |
| web_fetch_user_mix_videos | 取用户合辑视频 | user.md | GET | low |

### comments.md — 评论相关

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_v3_fetch_video_comments | 取视频评论列表（App V3） | comments.md | GET | low |
| app_v3_fetch_video_comment_replies | 取评论回复列表（App V3） | comments.md | GET | low |
| web_fetch_video_comments | 取视频评论列表（Web） | comments.md | GET | low |
| web_fetch_video_comment_replies | 取评论回复列表（Web） | comments.md | GET | low |
| creator_fetch_video_danmaku_list | 取视频弹幕列表（创作者中心） | comments.md | GET | low |

### search.md — 搜索相关

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| search_fetch_general_search_v1 | 综合搜索 V1 | search.md | POST | **high** |
| search_fetch_general_search_v2 | 综合搜索 V2 | search.md | POST | **high** |
| search_fetch_search_suggest | 搜索建议 | search.md | POST | **high** |
| search_fetch_video_search_v1 | 视频搜索 V1 | search.md | POST | **high** |
| search_fetch_video_search_v2 | 视频搜索 V2 | search.md | POST | **high** |
| search_fetch_multi_search | 多类型搜索 | search.md | POST | **high** |
| search_fetch_user_search | 用户搜索 | search.md | POST | **high** |
| search_fetch_user_search_v2 | 用户搜索 V2 | search.md | POST | **high** |
| search_fetch_image_search | 图片搜索 | search.md | POST | **high** |
| search_fetch_image_search_v3 | 图片搜索 V3 | search.md | POST | **high** |
| search_fetch_live_search_v1 | 直播搜索 | search.md | POST | **high** |
| search_fetch_challenge_search_v1 | 话题搜索 V1 | search.md | POST | **high** |
| search_fetch_challenge_search_v2 | 话题搜索 V2 | search.md | POST | **high** |
| search_fetch_challenge_suggest | 话题搜索建议 | search.md | POST | **high** |
| search_fetch_experience_search | 经验搜索 | search.md | POST | **high** |
| search_fetch_music_search | 音乐搜索 | search.md | POST | **high** |
| search_fetch_discuss_search | 讨论搜索 | search.md | POST | **high** |
| search_fetch_school_search | 学校搜索 | search.md | POST | **high** |
| search_fetch_vision_search | 图像识别搜索 | search.md | POST | **high** |

### creator.md — 创作者中心

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| creator_fetch_creator_activity_list | 取创作者活动列表 | creator.md | GET | low |
| creator_fetch_creator_activity_detail | 取创作者活动详情 | creator.md | GET | low |
| creator_fetch_creator_material_center_config | 取素材中心配置 | creator.md | GET | low |
| creator_fetch_creator_material_center_billboard | 取素材中心榜单 | creator.md | GET | low |
| creator_fetch_creator_material_center_related | 取素材中心关联内容 | creator.md | GET | low |
| creator_fetch_creator_hot_spot_billboard | 取创作者热点榜 | creator.md | GET | low |
| creator_fetch_creator_hot_topic_billboard | 取创作者话题榜 | creator.md | GET | low |
| creator_fetch_creator_hot_props_billboard | 取创作者道具榜 | creator.md | GET | low |
| creator_fetch_creator_hot_challenge_billboard | 取创作者挑战榜 | creator.md | GET | low |
| creator_fetch_creator_hot_music_billboard | 取创作者音乐榜 | creator.md | GET | low |
| creator_fetch_creator_hot_course | 取创作者热门课程 | creator.md | GET | low |
| creator_fetch_creator_content_category | 取内容分类 | creator.md | GET | low |
| creator_fetch_creator_content_course | 取分类课程 | creator.md | GET | low |
| creator_fetch_user_search | 创作者中心用户搜索 | creator.md | GET | low |
| creator_fetch_mission_task_list | 取商单任务列表 | creator.md | GET | low |
| creator_fetch_industry_category_config | 取行业分类配置 | creator.md | GET | low |
| creator_v2_fetch_item_overview_data | 取作品概览数据 | creator.md | POST | **high** |
| creator_v2_fetch_item_play_source | 取作品播放来源 | creator.md | POST | **high** |
| creator_v2_fetch_item_search_keyword | 取作品搜索关键词 | creator.md | POST | **high** |
| creator_v2_fetch_item_watch_trend | 取作品观看趋势 | creator.md | POST | **high** |
| creator_v2_fetch_item_danmaku_analysis | 取作品弹幕分析 | creator.md | POST | **high** |
| creator_v2_fetch_item_audience_portrait | 取作品观众画像 | creator.md | POST | **high** |
| creator_v2_fetch_item_audience_others | 取作品观众其他数据 | creator.md | POST | **high** |
| creator_v2_fetch_item_analysis_involved_vertical | 取作品垂类分析 | creator.md | POST | **high** |
| creator_v2_fetch_item_analysis_overview | 取作品分析概览 | creator.md | POST | **high** |
| creator_v2_fetch_item_analysis_item_performance | 取作品表现分析 | creator.md | POST | **high** |
| creator_v2_fetch_item_list | 取作品列表 | creator.md | POST | **high** |
| creator_v2_fetch_item_list_download | 下载作品列表 | creator.md | POST | **high** |
| creator_v2_fetch_live_room_history_list | 取直播间历史列表 | creator.md | POST | **high** |
| creator_v2_fetch_author_diagnosis | 取账号诊断 | creator.md | POST | **high** |

### live.md — 直播相关

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| web_fetch_user_live_videos | 用 webcast_id 取直播回放 | live.md | GET | low |
| web_fetch_user_live_videos_by_sec_uid | 用 sec_uid 取直播回放 | live.md | GET | low |
| web_fetch_user_live_videos_by_room_id_v2 | 用 room_id 取直播回放 V2 | live.md | GET | low |
| web_fetch_live_gift_ranking | 取直播送礼排行 | live.md | GET | low |
| web_fetch_live_room_product_result | 取直播间商品列表 | live.md | GET | low |
| web_fetch_product_sku_list | 取商品 SKU 列表 | live.md | GET | low |
| web_fetch_product_coupon | 取商品优惠券 | live.md | GET | low |
| web_fetch_product_review_score | 取商品评价评分 | live.md | GET | low |
| web_fetch_product_review_list | 取商品评价列表 | live.md | GET | low |
| web_douyin_live_room | 取直播间弹幕数据 | live.md | GET | low |
| web_fetch_live_im_fetch | 取直播 IM 消息 | live.md | GET | low |
| web_webcast_id_2_room_id | webcast_id 转 room_id | live.md | GET | low |
| web_fetch_user_live_info_by_uid | 用 uid 取直播信息 | live.md | GET | low |

### trending/_index.md — 热榜/趋势（含子文件 hot-search.md / billboard-events.md / account-content.md）

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_v3_fetch_hot_search_list | 取热搜榜单（App V3） | trending/_index.md | GET | low |
| app_v3_fetch_live_hot_search_list | 取直播热搜榜 | trending/_index.md | GET | low |
| app_v3_fetch_music_hot_search_list | 取音乐热搜榜 | trending/_index.md | GET | low |
| app_v3_fetch_brand_hot_search_list | 取品牌热搜榜 | trending/_index.md | GET | low |
| app_v3_fetch_brand_hot_search_list_detail | 取品牌热搜榜详情 | trending/_index.md | GET | low |
| web_fetch_hot_search_result | 取热搜结果（Web） | trending/_index.md | GET | low |
| billboard_fetch_city_list | 取城市列表 | trending/_index.md | GET | low |
| billboard_fetch_content_tag | 取内容标签 | trending/_index.md | GET | low |
| billboard_fetch_hot_category_list | 取热点分类榜单 | trending/_index.md | GET | low |
| billboard_fetch_hot_rise_list | 取热点上升榜 | trending/_index.md | GET | low |
| billboard_fetch_hot_city_list | 取热点城市榜 | trending/_index.md | GET | low |
| billboard_fetch_hot_challenge_list | 取热点挑战榜 | trending/_index.md | GET | low |
| billboard_fetch_hot_total_list | 取热点总榜 | trending/_index.md | GET | low |
| billboard_fetch_hot_calendar_list | 取热点日历 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_calendar_detail | 取热点日历详情 | trending/_index.md | GET | low |
| billboard_fetch_hot_user_portrait_list | 取热点观众画像 | trending/_index.md | GET | low |
| billboard_fetch_hot_comment_word_list | 取热点评论词云 | trending/_index.md | GET | low |
| billboard_fetch_hot_item_trends_list | 取热点作品趋势 | trending/_index.md | GET | low |
| billboard_fetch_hot_account_list | 取热门账号列表 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_account_search_list | 搜索热门账号 | trending/_index.md | GET | low |
| billboard_fetch_hot_account_trends_list | 取热门账号趋势 | trending/_index.md | GET | low |
| billboard_fetch_hot_account_item_analysis_list | 取热门账号作品分析 | trending/_index.md | GET | low |
| billboard_fetch_hot_account_fans_portrait_list | 取热门账号粉丝画像 | trending/_index.md | GET | low |
| billboard_fetch_hot_account_fans_interest_account_list | 取粉丝兴趣账号 | trending/_index.md | GET | low |
| billboard_fetch_hot_account_fans_interest_topic_list | 取粉丝兴趣话题 | trending/_index.md | GET | low |
| billboard_fetch_hot_account_fans_interest_search_list | 取粉丝兴趣搜索 | trending/_index.md | GET | low |
| billboard_fetch_hot_total_video_list | 取视频榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_low_fan_list | 取低粉爆款榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_high_play_list | 取高播放榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_high_like_list | 取高点赞榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_high_fan_list | 取高粉丝榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_topic_list | 取话题榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_high_topic_list | 取高话题榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_search_list | 取搜索榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_high_search_list | 取高搜索榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_hot_word_list | 取热词榜 | trending/_index.md | POST | **high** |
| billboard_fetch_hot_total_hot_word_detail_list | 取热词详情 | trending/_index.md | GET | low |

### tools.md — 工具类

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_v3_register_device | 注册设备 | tools.md | GET | **high** |
| app_v3_open_douyin_app_to_video_detail | 打开 App 跳转视频 | tools.md | GET | low |
| app_v3_open_douyin_app_to_user_profile | 打开 App 跳转用户 | tools.md | GET | low |
| app_v3_open_douyin_app_to_keyword_search | 打开 App 跳转搜索 | tools.md | GET | low |
| app_v3_open_douyin_app_to_send_private_message | 打开 App 跳转私信 | tools.md | GET | **high** |
| web_fetch_douyin_web_guest_cookie | 获取 Web 访客 Cookie | tools.md | GET | low |
| web_generate_real_msToken | 生成 msToken | tools.md | GET | low |
| web_generate_ttwid | 生成 ttwid | tools.md | GET | low |
| web_generate_verify_fp | 生成 verify_fp | tools.md | GET | low |
| web_generate_s_v_web_id | 生成 s_v_web_id | tools.md | GET | low |
| web_generate_wss_xb_signature | 生成弹幕 WSS 签名 | tools.md | GET | low |
| web_generate_x_bogus | 生成 X-Bogus 签名 | tools.md | POST | **high** |
| web_generate_a_bogus | 生成 A-Bogus 签名 | tools.md | POST | **high** |
| web_get_sec_user_id | 从 URL 提取 sec_user_id | tools.md | GET | low |
| web_get_all_sec_user_id | 批量提取 sec_user_id | tools.md | POST | **high** |
| web_get_aweme_id | 从 URL 提取 aweme_id | tools.md | GET | low |
| web_get_all_aweme_id | 批量提取 aweme_id | tools.md | POST | **high** |
| web_get_webcast_id | 从 URL 提取 webcast_id | tools.md | GET | low |
| web_get_all_webcast_id | 批量提取 webcast_id | tools.md | POST | **high** |
| web_handler_shorten_url | 短链接转换 | tools.md | GET | low |
| web_fetch_query_user | 查询用户信息（POST） | tools.md | POST | **high** |

### content/_index.md — 抖音指数（含子文件 tools.md / keyword.md / daren.md / brand-topic.md / creative-insight.md）

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| index_fetch_all_valid_date | 取所有有效日期 | content/_index.md | GET | low |
| index_fetch_valid_date_for_relation | 取关联分析有效日期 | content/_index.md | GET | low |
| index_fetch_all_area | 取所有地区列表 | content/_index.md | GET | low |
| index_fetch_current_hot_topic | 取实时热点排行 | content/_index.md | GET | low |
| index_fetch_hot_words | 取热门关键词 | content/_index.md | GET | low |
| index_fetch_keyword_valid_date | 取关键词有效日期 | content/_index.md | POST | **high** |
| index_fetch_multi_keyword_hot_trend | 取多关键词热度趋势 | content/_index.md | POST | **high** |
| index_fetch_multi_keyword_interpretation | 取多关键词解读 | content/_index.md | POST | **high** |
| index_fetch_relation_word | 取关联词 | content/_index.md | POST | **high** |
| index_fetch_portrait | 取人群画像 | content/_index.md | POST | **high** |
| index_fetch_get_user_sub_word | 取用户订阅词 | content/_index.md | POST | **high** |
| index_fetch_encrypt_user_id | 加密用户 ID | content/_index.md | GET | low |
| index_fetch_daren_sug_great_user_list | 取达人推荐列表 | content/_index.md | POST | **high** |
| index_fetch_daren_compare_users_stable | 取达人对比数据 | content/_index.md | POST | **high** |
| index_fetch_daren_similar_users | 取相似达人 | content/_index.md | POST | **high** |
| index_fetch_daren_great_user_top_video | 取达人热门视频 | content/_index.md | POST | **high** |
| index_fetch_daren_great_item_mile_info | 取达人作品里程碑 | content/_index.md | POST | **high** |
| index_fetch_daren_great_user_fans_info | 取达人粉丝信息 | content/_index.md | POST | **high** |
| index_fetch_item_filter_options | 取内容筛选选项 | content/_index.md | GET | low |
| index_fetch_item_sug | 取内容搜索建议 | content/_index.md | POST | **high** |
| index_fetch_item_query | 取内容搜索结果 | content/_index.md | POST | **high** |
| index_fetch_brand_suggest | 取品牌搜索建议 | content/_index.md | POST | **high** |
| index_fetch_brand_valid_info | 取品牌有效信息 | content/_index.md | POST | **high** |
| index_fetch_brand_radar_chart | 取品牌雷达图 | content/_index.md | POST | **high** |
| index_fetch_brand_lines | 取品牌趋势线 | content/_index.md | POST | **high** |
| index_fetch_brand_cycles | 取品牌周期数据 | content/_index.md | POST | **high** |
| index_fetch_brand_initiative_rank_weekly | 取品牌主动排名周榜 | content/_index.md | POST | **high** |
| index_fetch_topic_suggest | 取话题搜索建议 | content/_index.md | POST | **high** |
| index_fetch_topic_query | 取话题搜索结果 | content/_index.md | POST | **high** |
| index_fetch_content_valid_date | 取内容有效日期 | content/_index.md | GET | low |
| index_fetch_brand_hot_videos_time_scope | 取品牌热门视频时间范围 | content/_index.md | POST | **high** |
| index_fetch_content_creative_keywords | 取内容创作关键词 | content/_index.md | POST | **high** |
| index_fetch_content_creative_keyword_items | 取内容创作关键词作品 | content/_index.md | POST | **high** |
| index_fetch_content_creative_topic | 取内容创作话题 | content/_index.md | POST | **high** |
| index_fetch_content_publish_trend | 取内容发布趋势 | content/_index.md | GET | low |
| index_fetch_content_creative_duration | 取内容创作时长分布 | content/_index.md | POST | **high** |
| index_fetch_content_author_portrait | 取内容创作者画像 | content/_index.md | POST | **high** |
| index_fetch_content_consumer_portrait | 取内容消费者画像 | content/_index.md | POST | **high** |
| index_fetch_content_interact_trend | 取内容互动趋势 | content/_index.md | POST | **high** |
| index_fetch_content_consume_trend | 取内容消费趋势 | content/_index.md | POST | **high** |
| index_fetch_insight_recommend | 取洞察推荐 | content/_index.md | GET | low |
| index_fetch_report_search | 取报告搜索 | content/_index.md | POST | **high** |
| index_fetch_report_detail | 取报告详情 | content/_index.md | GET | low |
| index_fetch_insight_get_rec | 取洞察推荐详情 | content/_index.md | GET | low |

### xingtu/_index.md — 星图相关（含子文件 kol-resolver.md / kol-info-v1.md / search-rank.md / v2-business.md）

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| xingtu_get_sign_image | 获取签名图片 | xingtu/_index.md | GET | low |
| xingtu_get_xingtu_kolid_by_uid | 用 uid 查 kolId | xingtu/_index.md | GET | low |
| xingtu_get_xingtu_kolid_by_sec_user_id | 用 sec_user_id 查 kolId | xingtu/_index.md | GET | low |
| xingtu_get_xingtu_kolid_by_unique_id | 用 unique_id 查 kolId | xingtu/_index.md | GET | low |
| xingtu_kol_base_info_v1 | 取 KOL 基本信息 | xingtu/_index.md | GET | low |
| xingtu_kol_audience_portrait_v1 | 取 KOL 观众画像 | xingtu/_index.md | GET | low |
| xingtu_kol_fans_portrait_v1 | 取 KOL 粉丝画像 | xingtu/_index.md | GET | low |
| xingtu_kol_service_price_v1 | 取 KOL 服务报价 | xingtu/_index.md | GET | low |
| xingtu_kol_data_overview_v1 | 取 KOL 数据概览 | xingtu/_index.md | GET | low |
| xingtu_search_kol_v1 | 搜索 KOL V1 | xingtu/_index.md | GET | low |
| xingtu_search_kol_v2 | 搜索 KOL V2（含筛选） | xingtu/_index.md | GET | low |
| xingtu_kol_conversion_ability_analysis_v1 | 取 KOL 转化能力分析 | xingtu/_index.md | GET | low |
| xingtu_kol_video_performance_v1 | 取 KOL 视频表现 | xingtu/_index.md | GET | low |
| xingtu_kol_xingtu_index_v1 | 取 KOL 星图指数 | xingtu/_index.md | GET | low |
| xingtu_kol_convert_video_display_v1 | 取 KOL 转化视频展示 | xingtu/_index.md | GET | low |
| xingtu_kol_link_struct_v1 | 取 KOL 链接结构 | xingtu/_index.md | GET | low |
| xingtu_kol_touch_distribution_v1 | 取 KOL 触达分布 | xingtu/_index.md | GET | low |
| xingtu_kol_cp_info_v1 | 取 KOL CP 信息 | xingtu/_index.md | GET | low |
| xingtu_kol_rec_videos_v1 | 取 KOL 推荐视频 | xingtu/_index.md | GET | low |
| xingtu_kol_daily_fans_v1 | 取 KOL 每日粉丝 | xingtu/_index.md | GET | low |
| xingtu_author_hot_comment_tokens_v1 | 取作者热评词 | xingtu/_index.md | GET | low |
| xingtu_author_content_hot_comment_keywords_v1 | 取作者内容热评关键词 | xingtu/_index.md | GET | low |
| xingtu_v2_get_ranking_list_catalog | 取排行榜目录 | xingtu/_index.md | GET | low |
| xingtu_v2_get_ranking_list_data | 取排行榜数据 | xingtu/_index.md | GET | low |
| xingtu_v2_get_playlet_actor_rank_catalog | 取短剧演员排行目录 | xingtu/_index.md | POST | **high** |
| xingtu_v2_get_playlet_actor_rank_list | 取短剧演员排行列表 | xingtu/_index.md | GET | low |
| xingtu_v2_get_author_market_fields | 取创作者市场字段 | xingtu/_index.md | GET | low |
| xingtu_v2_get_author_base_info | 取创作者基本信息（V2） | xingtu/_index.md | GET | low |
| xingtu_v2_get_author_business_card_info | 取创作者商业卡片 | xingtu/_index.md | GET | low |
| xingtu_v2_get_author_local_info | 取创作者本地信息 | xingtu/_index.md | GET | low |
| xingtu_v2_get_author_show_items | 取创作者展示作品 | xingtu/_index.md | GET | low |
| xingtu_v2_get_author_hot_comment_tokens | 取创作者热评词（V2） | xingtu/_index.md | GET | low |
| xingtu_v2_get_author_content_hot_keywords | 取创作者内容热词（V2） | xingtu/_index.md | GET | low |
| xingtu_v2_get_recommend_for_star_authors | 取星推创作者 | xingtu/_index.md | POST | **high** |
| xingtu_v2_get_excellent_case_category_list | 取优秀案例分类 | xingtu/_index.md | GET | low |
| xingtu_v2_get_author_spread_info | 取创作者传播信息 | xingtu/_index.md | GET | low |
| xingtu_v2_get_user_profile_qrcode | 取用户资料二维码 | xingtu/_index.md | GET | low |
| xingtu_v2_get_content_trend_guide | 取内容趋势指南 | xingtu/_index.md | GET | low |
| xingtu_v2_get_ip_activity_industry_list | 取 IP 活动行业列表 | xingtu/_index.md | GET | low |
| xingtu_v2_get_ip_activity_list | 取 IP 活动列表 | xingtu/_index.md | POST | **high** |
| xingtu_v2_get_ip_activity_detail | 取 IP 活动详情 | xingtu/_index.md | GET | low |
| xingtu_v2_get_resource_list | 取资源列表 | xingtu/_index.md | GET | low |
| xingtu_v2_get_demander_mcn_list | 取需求方 MCN 列表 | xingtu/_index.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名。

### `aweme_id` — 作品 ID（纯数字，如 `7448118827402972455`）
- **可从这些端点产出（OUT）**：
  - `app_v3_fetch_one_video` → `$.data.aweme_id`
  - `web_fetch_one_video` → `$.data.aweme_id`
  - `app_v3_fetch_user_post_videos` → `$.data.aweme_list[].aweme_id` / `$.data.aweme_list[].statistics.aweme_id`
  - `web_fetch_user_post_videos` → 同上
  - `web_fetch_home_feed` → `$.data.aweme_list[].aweme_id`
  - `web_fetch_related_posts` → `$.data.aweme_list[].aweme_id`
  - `search_fetch_video_search_v1` / `search_fetch_video_search_v2` → `$.data.data[].aweme_id`
  - `web_get_aweme_id` → `$.data.aweme_id`（从 URL 提取）
  - `app_v3_fetch_hashtag_video_list` → `$.data.aweme_list[].aweme_id`
  - `app_v3_fetch_music_video_list` → `$.data.aweme_list[].aweme_id`
  - 各频道端点（series/knowledge/game/cartoon/music/food_aweme）→ `$.data.aweme_list[].aweme_id`
- **可作为输入（IN）**：
  - `app_v3_fetch_one_video` / `app_v3_fetch_one_video_v2` / `app_v3_fetch_one_video_v3`
  - `web_fetch_one_video` / `web_fetch_one_video_v2`
  - `app_v3_fetch_video_high_quality_play_url`（与 share_url 二选一）
  - `web_fetch_video_high_quality_play_url`（与 share_url 二选一）
  - `app_v3_fetch_video_statistics` / `app_v3_fetch_multi_video_statistics`（逗号分隔多个）
  - `app_v3_fetch_video_comments` / `web_fetch_video_comments`
  - `app_v3_add_video_play_count`（作为 item_id）
  - `app_v3_generate_douyin_video_share_qrcode`（作为 object_id）
  - `app_v3_open_douyin_app_to_video_detail`

### `sec_user_id` — 用户加密 ID（Base64 格式长字符串）
- **可从这些端点产出（OUT）**：
  - `app_v3_handler_user_profile` → `$.data.user.sec_uid`
  - `web_handler_user_profile` → `$.data.user.sec_uid`
  - `web_handler_user_profile_v4` → `$.data.user.sec_uid`
  - `web_fetch_user_profile_by_uid` → `$.data.user.sec_uid`
  - `web_encrypt_uid_to_sec_user_id` → `$.data.sec_user_id`
  - `web_get_sec_user_id` → `$.data.sec_user_id`（从 URL 提取）
  - `search_fetch_user_search` / `search_fetch_user_search_v2` → `$.data.data[].sec_uid`
  - `creator_fetch_user_search` → `$.data.sec_uid`
  - `web_fetch_user_fans_list` → `$.data.follow_list[].sec_uid`
  - `web_fetch_user_following_list` → `$.data.follow_list[].sec_uid`
- **可作为输入（IN）**：
  - `app_v3_handler_user_profile` / `web_handler_user_profile` / `web_handler_user_profile_v4`
  - `app_v3_fetch_user_post_videos` / `web_fetch_user_post_videos`
  - `app_v3_fetch_user_like_videos`
  - `app_v3_fetch_user_fans_list` / `web_fetch_user_fans_list`
  - `web_fetch_user_like_videos` / `web_fetch_user_collection_videos` / `web_fetch_user_collects`
  - `web_fetch_user_live_videos_by_sec_uid`
  - `web_fetch_product_coupon`
  - `xingtu_get_xingtu_kolid_by_sec_user_id`
  - `xingtu_v2_get_user_profile_qrcode`（与 core_user_id 二选一）

### `uid` / `user_id` — 用户数字 ID
- **可从这些端点产出（OUT）**：
  - `app_v3_handler_user_profile` → `$.data.user.uid`
  - `web_fetch_user_profile_by_uid` → `$.data.user.uid`
  - `index_fetch_encrypt_user_id` → `$.data.encrypt_user_id`（加密后的 uid）
  - `web_encrypt_uid_to_sec_user_id` → 输入 uid 输出 sec_user_id
- **可作为输入（IN）**：
  - `web_fetch_user_profile_by_uid`
  - `web_handler_user_profile_v3`（uid 即 short_id）
  - `web_encrypt_uid_to_sec_user_id`
  - `web_fetch_user_live_info_by_uid`
  - `app_v3_open_douyin_app_to_user_profile`（uid + sec_uid 同时需要）
  - `index_fetch_encrypt_user_id`
  - `xingtu_get_xingtu_kolid_by_uid`

### `unique_id` — 抖音号
- **产出**：`web_handler_user_profile` → `$.data.user.unique_id`
- **输入**：`web_handler_user_profile_v2`（用抖音号查用户）
- **输入**：`xingtu_get_xingtu_kolid_by_unique_id`

### `comment_id` — 评论 ID
- **产出**：`app_v3_fetch_video_comments` / `web_fetch_video_comments` → `$.data.comments[].cid`
- **输入**：`app_v3_fetch_video_comment_replies` / `web_fetch_video_comment_replies`

### `cursor` / `max_cursor` — 分页游标（通用）
- **产出/输入**：所有支持分页的端点（同端点的下一次调用使用上次响应的 `$.data.cursor` 或 `$.data.max_cursor`，并以 `$.data.has_more` 判定是否继续翻页）

### `kolId` — 星图 KOL ID
- **可从这些端点产出（OUT）**：
  - `xingtu_get_xingtu_kolid_by_uid` → `$.data.kolId`
  - `xingtu_get_xingtu_kolid_by_sec_user_id` → `$.data.kolId`
  - `xingtu_get_xingtu_kolid_by_unique_id` → `$.data.kolId`
  - `xingtu_search_kol_v1` → `$.data.data[].kolId`
  - `xingtu_search_kol_v2` → `$.data.data[].kolId`
- **可作为输入（IN）**：所有 `xingtu_kol_*` 端点

### `o_author_id` — 星图 V2 创作者 ID
- **可从这些端点产出（OUT）**：
  - `xingtu_v2_get_author_base_info` → `$.data.o_author_id`
  - `xingtu_search_kol_v1` / `xingtu_search_kol_v2` → `$.data.data[].o_author_id`
- **可作为输入（IN）**：
  - `xingtu_v2_get_author_base_info` / `xingtu_v2_get_author_business_card_info`
  - `xingtu_v2_get_author_local_info` / `xingtu_v2_get_author_show_items`
  - `xingtu_v2_get_author_spread_info`

### `room_id` / `webcast_id` — 直播间 ID
- **产出**：`web_webcast_id_2_room_id` → `$.data.room_id`
- **产出**：`web_fetch_user_live_info_by_uid` → `$.data.room_id`
- **输入**：`web_fetch_user_live_videos_by_room_id_v2`（room_id）
- **输入**：`web_fetch_user_live_videos`（webcast_id）
- **输入**：`web_fetch_live_gift_ranking` / `web_fetch_live_room_product_result`（room_id）
- **输入**：`web_douyin_live_room` / `web_fetch_live_im_fetch`（room_id）

### `keyword` — 搜索关键词
- **输入**：所有 search 端点、`index_fetch_multi_keyword_hot_trend` 等、`xingtu_search_kol_v1/v2`
- **产出**：`index_fetch_content_creative_keywords` → `$.data.keywords[]`（可作为下游 keyword）

### `tag_id` / `category_id` — 垂类/分类 ID
- **产出**：`index_fetch_item_filter_options` → `$.data.category_list[].id`
- **产出**：`creator_fetch_creator_content_category` → `$.data.category_list[].id`
- **输入**：`index_fetch_item_query`（category_id）、`index_fetch_content_creative_keywords` 等（tag_id）
- **输入**：`creator_fetch_creator_content_course`（category_id）

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

> 以下为 MaxHub API 平台官方 HTTP 状态码定义。**Agent 必须**按此表语义判定错误类型，不要自行解读。

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400 Bad Request** | 请求格式错误或参数不正确 | 参数缺失 / 类型错 / 格式不符 / 互斥参数同时传 |
| **401 Unauthorized** | API 令牌身份无效 | API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 |
| **402 Payment Required** | 余额不足 / 付费路由 | 余额不足（允许/不允许免费额度） |
| **403 Forbidden** | 已认证但无权限 | 缺少路由权限 / 账户禁用 / 邮箱未验证 / Token 权限不足 |
| **404 Not Found** | 路由数据未找到 | 路径不在白名单 / 上游已下线 / 资源不存在 |
| **429 Too Many Requests** | 请求速率超限 | 读 `Retry-After` 头退避 |
| **500 Internal Server Error** | 服务器内部错误 | 上游异常（含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错（读端点） | **先做 §3.1(B)** → 修正参数后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **400** | 参数错（**写端点**） | **先做 §3.1(B)** → 让用户重新确认参数 | 0 | 查端点 reference IN 表 |
| **401** | API 令牌无效/缺失/过期 | **STOP**，提示用户检查 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足 | **STOP**，告知用户充值 | 0 | https://www.aconfig.cn |
| **403** | 权限不足/账户禁用/邮箱未验证 | **STOP**，按子场景告知用户 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（臆造） | **先做 §3.1(A)** → 自检失败 STOP | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在 | **先做 §3.1(A)** → 通过后告知用户 | 0 | — |
| **410** | 上游已下线 | **先做 §3.1(A)** → 通过后 STOP；长期未更新提示用户走 [`update.md`](./update.md) | 0 | — |
| **422** | 参数校验失败 | **先做 §3.1(B)** → 修正后重试 1 次；写端点不重试 | 读≤1 / 写=0 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 退避；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障（读端点） | 等 3 秒重试 1 次；仍失败走替换矩阵 | ≤1 次 | — |
| **500/502/503/504** | 上游故障（**写端点**） | 等 3 秒重试 1 次封顶 | ≤1 次 | — |
| **网络超时 / DNS** | 网络异常 | **STOP** | 0 | — |
| **HTTP 200 + `code != 0`** | 业务错误 | 读 `message_zh` 报告，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 不在清单中 → Agent 臆造路径，**STOP**，禁止任何"改 app/v3→web / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `aweme_id` / `sec_user_id` / `comment_id` / `kolId` 等是否真实来自之前某个端点的**响应字段**？
   - 如果是 Agent 自己生成/编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对** — 是否逐字符等于 IN 表中的 name？无大小写/缩写/复数错？
2. **必填项齐全** — 所有标 `yes` 的参数是否都已传？`oneOf` 类型是否做到"传且只传一个"？
3. **类型与格式严格匹配** — string 是否被错传成 number？日期格式是否为 YYYYMMDD？
4. **传参方式正确** — GET 端点参数放 query string；POST 端点参数放 body（JSON 序列化）
5. **没有臆造参数** — 是否传入了 IN 表中**未列出**的参数？
6. **若以上全通过** → 才可以按 `message_zh` 进一步排查；仍无法定位 → STOP

---

### 重试策略矩阵

| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400/422 参数错（读端点） | 1 次（修正参数后） | 立即 | 不换端点 |
| 400/422 参数错（**写端点**） | **0 次** | — | 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| 402 余额不足 | 0 | — | STOP |
| 403 权限/账户禁用 | 0 | — | STOP |
| 404/410 路径错或资源不存在 | 0 | — | 不改路径，可走替换矩阵 |
| 429 限流 | 2 次 | `min(8s, 2^n) * (0.5 + random*0.5)` | 不换端点 |
| 5xx 上游错（读端点） | 1 次 | 固定 3s | 走替换矩阵 |
| 5xx 上游错（**写端点**） | **1 次封顶** | 固定 3s | 不换端点 |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告 |

### 降级策略原则

1. **数据源降级**：App V3 端点失败 → Web 端点取相同数据（必须显式告知用户）
2. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
3. **维度降级**：V2 版本失败 → V1 版本取基础数据

### 链式调用容错原则

- **第 1 步失败** → 整条链 **STOP**
- **中间步失败** → 返回截止前已有的数据 + **显式告知**用户缺失了哪一段
- **最后步失败** → 返回前序数据 + 告知最终步未完成

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

> 当首选端点持续 5xx / 数据为空时，按此表寻找语义相近的替代端点。
> **强约束**：
> - 替换前必须**显式告知**用户
> - 替换次数 ≤ 1 次
> - 写入端点**无替代**，失败必须 STOP

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| app_v3_fetch_one_video | web_fetch_one_video | App V3 失败时切 Web | Web 版字段可能略有不同 |
| app_v3_fetch_one_video | app_v3_fetch_one_video_v3 | 版权限制时用 V3 | V3 解决版权限制问题 |
| web_fetch_one_video | web_fetch_one_video_v2 | V1 失效时用 V2 | 字段基本一致 |
| app_v3_fetch_user_post_videos | web_fetch_user_post_videos | App V3 失败时切 Web | Web 版需 cookie |
| app_v3_handler_user_profile | web_handler_user_profile | App V3 失败时切 Web | — |
| web_handler_user_profile_v2 | web_handler_user_profile（先通过 search 获取 sec_user_id） | unique_id 查询失败 | 多一步搜索 |
| app_v3_fetch_video_comments | web_fetch_video_comments | App V3 失败时切 Web | — |
| app_v3_fetch_video_comment_replies | web_fetch_video_comment_replies | App V3 失败时切 Web | — |
| web_fetch_video_high_quality_play_url | app_v3_fetch_one_video（取视频链接） | 高清链接失败 | 可能非高清/带水印 |
| search_fetch_video_search_v1 | search_fetch_video_search_v2 | V1 失败时用 V2 | — |
| search_fetch_general_search_v1 | search_fetch_general_search_v2 | V1 失败时用 V2 | — |
| xingtu_search_kol_v1 | xingtu_search_kol_v2 | V1 失败时用 V2 | V2 支持更多筛选 |
| xingtu_kol_* (V1) | xingtu_v2_get_author_* (V2) | V1 失败时切 V2 | V2 字段更丰富，但需 o_author_id |
| index_fetch_daren_* | xingtu_kol_* | 指数达人数据失败切星图 | 数据来源不同，字段差异大 |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。
> 
> **特别注意**：抖音 API 有 9 个子模块（app/v3 / web / search / billboard / creator / creator_v2 / index / xingtu / xingtu_v2），路径段不可跨模块替换。例如 `/api/v1/douyin/app/v3/fetch_one_video` 失败时，**禁止**自行改为 `/api/v1/douyin/web/fetch_one_video` 再试——这是两个不同端点，需按"端点替换矩阵"显式切换。

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
1. **国内首选**：`skillhub upgrade maxhub-douyin`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-douyin
2. **国际主源**：`clawhub upgrade maxhub-douyin`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）
