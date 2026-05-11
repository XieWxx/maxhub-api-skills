# 🎵 抖音数据采集与分析 回复模板

## Douyin Web

### 二次元作品推荐/Anime Video

`GET /api/v1/douyin/web/fetch_cartoon_aweme`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 二次元作品数据 |

---

### 使用Short ID获取用户信息/Get user information by Short ID

`GET /api/v1/douyin/web/fetch_user_profile_by_short_id`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 用户信息 |

---

### 使用UID获取用户信息/Get user information by UID

`GET /api/v1/douyin/web/fetch_user_profile_by_uid`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 用户信息 |

---

### 使用UID获取用户开播信息/Get user live information by UID

`GET /api/v1/douyin/web/fetch_user_live_info_by_uid`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 用户开播信息，包含room_id与live_status |

---

### 使用sec_user_id获取指定用户的信息/Get information of specified user by sec_user_id

`GET /api/v1/douyin/web/handler_user_profile`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 用户信息 |

---

> 该分类下还有 66 个API，详见 api-catalog.md

## Douyin App V3

### 批量获取视频信息 V1/Batch Get Video Information V1

`POST /api/v1/douyin/app/v3`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 作品数据 |

---

### 批量获取视频信息 V2/Batch Get Video Information V2

`POST /api/v1/douyin/app/v3`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 作品数据 |

---

### 批量获取视频的最高画质播放链接/Batch get the highest quality play URL of videos

`POST /api/v1/douyin/app/v3`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | total: 总数 |

---


### 根据分享口令获取分享信息/Get share info by share code

`GET /api/v1/douyin/app/v3`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 分享信息，包含分享人信息和文章ID等 |

---

> 该分类下还有 42 个API，详见 api-catalog.md

## Douyin Search

### 获取图像识别搜索/Fetch vision search (image-based search)

`POST /api/v1/douyin/search/fetch_vision_search`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |

---

### 获取图文搜索 V3/Fetch image-text search V3

`POST /api/v1/douyin/search/fetch_image_search_v3`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |

---

### 获取图片搜索/Fetch image search

`POST /api/v1/douyin/search/fetch_image_search`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |

---

### 获取多重搜索/Fetch multi-type search

`POST /api/v1/douyin/search/fetch_multi_search`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |

---

### 获取学校搜索/Fetch school search

`POST /api/v1/douyin/search/fetch_school_search`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |

---

> 该分类下还有 14 个API，详见 api-catalog.md

## Douyin Billboard

### 搜索用户名或抖音号/Fetch account search list

`GET /api/v1/douyin/billboard/fetch_hot_account_search_list`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 搜索结果 |

---

### 获取上升热点榜/Fetch rising hot list

`GET /api/v1/douyin/billboard/fetch_hot_rise_list`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 上升热点榜 |

---

### 获取中国城市列表/Fetch Chinese city list

`GET /api/v1/douyin/billboard/fetch_city_list`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 中国城市列表 |

---

### 获取低粉爆款榜/Fetch low fan explosion list

`POST /api/v1/douyin/billboard/fetch_hot_total_low_fan_list`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 低粉爆款榜 |

---

### 获取作品数据趋势/Fetch post data trend

`GET /api/v1/douyin/billboard/fetch_hot_item_trends_list`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 作品数据趋势 |

---

> 该分类下还有 26 个API，详见 api-catalog.md

## Douyin Creator

### 搜索用户/Search users

`GET /api/v1/douyin/creator/fetch_user_search`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 最多返回20个匹配的用户信息 |

---

### 获取作品弹幕列表/Get video danmaku list

`GET /api/v1/douyin/creator/fetch_video_danmaku_list`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 作品弹幕列表数据 |

---

### 获取创作者中心创作热点/Get creator hot spot billboard

`GET /api/v1/douyin/creator/fetch_creator_hot_spot_billboard`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 创作者热点榜单数据 |

---

### 获取创作者中心热门视频榜单/Get creator material center billboard

`GET /api/v1/douyin/creator/fetch_creator_material_center_billboard`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 创作者中心热门视频榜单数据 |

---

### 获取创作者中心配置/Get creator material center config

`GET /api/v1/douyin/creator/fetch_creator_material_center_config`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 创作者中心配置数据 |

---

> 该分类下还有 12 个API，详见 api-catalog.md

## Douyin Creator V2

### 导出投稿作品列表/Download item list

`POST /api/v1/douyin/creator_v2/fetch_item_list_download`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | **直接返回Excel文件流**，浏览器会自动下载 |

---

### 获取作品垂类标签/Fetch item analysis involved vertical

`POST /api/v1/douyin/creator_v2/fetch_item_analysis_involved_vertical`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |

---

### 获取作品弹幕分析/Fetch item bullet analysis

`POST /api/v1/douyin/creator_v2/fetch_item_danmaku_analysis`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |

---

### 获取作品总览数据/Fetch item overview data

`POST /api/v1/douyin/creator_v2/fetch_item_overview_data`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 作品总览数据，根据 fields 参数返回对应的字段内容 |

---

### 获取作品搜索关键词统计/Fetch item search keywords statistics

`POST /api/v1/douyin/creator_v2/fetch_item_search_keyword`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |

---

> 该分类下还有 9 个API，详见 api-catalog.md

## Douyin Index

### 互动趋势/Content interact trend

`POST /api/v1/douyin/index/fetch_content_interact_trend`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 按日聚合的互动数据：每日点赞总数、评论总数、分享总数、收藏总数等 |

---

### 关键词相关视频/Creative keyword related items

`POST /api/v1/douyin/index/fetch_content_creative_keyword_items`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 与该关键词相关的视频列表 |

---

### 内容发布趋势/Content publish trend

`GET /api/v1/douyin/index/fetch_content_publish_trend`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 按日聚合的发布量数据（日期 + 当日发布作品数） |

---

### 创作指南有效日期/Get content valid date

`GET /api/v1/douyin/index/fetch_content_valid_date`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 创作指南可查询的起止日期 |

---

### 创作时长分布/Content creative duration

`POST /api/v1/douyin/index/fetch_content_creative_duration`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 各时长区间（如 0-15 秒/15-60 秒/60-180 秒/大于 180 秒）的视频数量与占比 |

---

> 该分类下还有 39 个API，详见 api-catalog.md

## Douyin Xingtu

### 关键词搜索kol V1/Search Kol V1

`GET /api/v1/douyin/xingtu/search_kol_v1`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | kol列表 |

---

### 根据抖音sec_user_id获取游客星图kolid/Get XingTu kolid by Douyin sec_user_id

`GET /api/v1/douyin/xingtu/get_xingtu_kolid_by_sec_user_id`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 游客星图kolid |

---

### 根据抖音号获取游客星图kolid/Get XingTu kolid by Douyin unique_id

`GET /api/v1/douyin/xingtu/get_xingtu_kolid_by_unique_id`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 游客星图kolid |

---

### 根据抖音用户ID获取游客星图kolid/Get XingTu kolid by Douyin User ID

`GET /api/v1/douyin/xingtu/get_xingtu_kolid_by_uid`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 游客星图kolid |

---

### 获取kol内容表现V1/Get kol Rec Videos V1

`GET /api/v1/douyin/xingtu/kol_rec_videos_v1`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | kol内容表现 |

---

> 该分类下还有 17 个API，详见 api-catalog.md

## Douyin Xingtu V2

### 搜索MCN机构列表/Get Demander MCN List

`GET /api/v1/douyin/xingtu_v2/get_demander_mcn_list`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | MCN机构列表数据 |

---

### 获取优秀行业分类列表/Get Excellent Case Category List

`GET /api/v1/douyin/xingtu_v2/get_excellent_case_category_list`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 优秀行业分类列表数据 |

---

### 获取内容趋势指南/Get Content Trend Guide

`GET /api/v1/douyin/xingtu_v2/get_content_trend_guide`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 内容趋势指南数据 |

---

### 获取创作者传播价值/Get Author Spread Info

`GET /api/v1/douyin/xingtu_v2/get_author_spread_info`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 创作者传播价值数据 |

---

### 获取创作者位置信息/Get Author Local Info

`GET /api/v1/douyin/xingtu_v2/get_author_local_info`

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 发布时间 | 内容创建时间 |
| 数据说明 | 创作者位置信息数据 |

---

> 该分类下还有 16 个API，详见 api-catalog.md

## 错误回复

❌ **操作失败**

| 字段 | 内容 |
|:---|:---|
| 错误码 | {{code}} |
| 错误信息 | {{message}} |
| 解决方法 | {{solution}} |
