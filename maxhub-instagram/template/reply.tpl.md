# 📸 Instagram数据采集 回复模板

## Instagram V1

### Media ID转Shortcode/Convert media ID to shortcode

`GET /api/v1/instagram/v1/media_id_to_shortcode`

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
| 数据说明 | `status`: 转换状态 |

---

### Shortcode转Media ID/Convert shortcode to media ID

`GET /api/v1/instagram/v1/shortcode_to_media_id`

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
| 数据说明 | `status`: 转换状态 |

---

### 搜索用户/话题/地点/Search users/hashtags/places

`GET /api/v1/instagram/v1/fetch_search`

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
| 数据说明 | `users`: 用户列表 |

---

### 根据用户ID获取用户数据V2/Get user data by user ID V2

`GET /api/v1/instagram/v1/fetch_user_info_by_id_v2`

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
| 数据说明 | 用户信息对象，包含bio_links、hd_profile_pic_url_info等更多字段 |

---

### 根据用户ID获取用户数据/Get user data by user ID

`GET /api/v1/instagram/v1/fetch_user_info_by_id`

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
| 数据说明 | 用户信息对象，包含时间线媒体、高清头像等完整数据 |

---

> 该分类下还有 24 个API，详见 api-catalog.md

## Instagram V2

### Media ID转Shortcode/Convert media ID to shortcode

`GET /api/v1/instagram/v2/media_id_to_shortcode`

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
| 数据说明 | `status`: 转换状态 |

---

### Shortcode转Media ID/Convert shortcode to media ID

`GET /api/v1/instagram/v2/shortcode_to_media_id`

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
| 数据说明 | `status`: 转换状态 |

---

### 搜索Reels/Search reels

`GET /api/v1/instagram/v2/search_reels`

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
| 数据说明 | `data.items`: Reels列表 |

---

### 搜索地点/Search locations

`GET /api/v1/instagram/v2/search_locations`

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
| 数据说明 | `data.items`: 地点列表，包含名称、地址、坐标等 |

---

### 搜索用户/Search users

`GET /api/v1/instagram/v2/search_users`

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
| 数据说明 | `data.items`: 用户列表 |

---

> 该分类下还有 22 个API，详见 api-catalog.md

## Instagram V3

### 从URL提取短码/Extract shortcode from URL

`GET /api/v1/instagram/v3/extract_shortcode`

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

### 媒体ID转短码/Convert media ID to shortcode

`GET /api/v1/instagram/v3/media_id_to_shortcode`

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
| 数据说明 | `data.media_id`: 原始媒体ID |

---

### 批量翻译评论/Bulk translate comments

`GET /api/v1/instagram/v3/bulk_translate_comments`

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
| 数据说明 | `data.comment_translations`: 翻译结果映射 |

---

### 搜索地点/Search places

`GET /api/v1/instagram/v3/search_places`

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
| 数据说明 | `data.places`: 地点搜索结果列表 |

---

### 搜索用户/Search users

`GET /api/v1/instagram/v3/search_users`

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
| 数据说明 | `data.users`: 用户搜索结果列表 |

---

> 该分类下还有 27 个API，详见 api-catalog.md

## 错误回复

❌ **操作失败**

| 字段 | 内容 |
|:---|:---|
| 错误码 | {{code}} |
| 错误信息 | {{message}} |
| 解决方法 | {{solution}} |
