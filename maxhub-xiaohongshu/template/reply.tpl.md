# 📕 小红书数据采集与分析 回复模板

## 数

### 获取笔记详情/Fetch note detail

`GET /api/v1/xiaohongshu/web_v3/fetch_note_detail`
必填参数：note_id, xsec_token

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

### 获取首页推荐/Fetch homepage feed

`GET /api/v1/xiaohongshu/web_v3/fetch_homefeed`
无必填参数

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

### 获取首页分类列表/Fetch homepage categories

`GET /api/v1/xiaohongshu/web_v3/fetch_homefeed_categories`
无必填参数

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

## 互

### 获取笔记评论/Fetch note comments

`GET /api/v1/xiaohongshu/web_v3/fetch_note_comments`
必填参数：note_id, xsec_token

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

### 获取子评论/Fetch sub comments

`GET /api/v1/xiaohongshu/web_v3/fetch_sub_comments`
必填参数：note_id, root_comment_id, xsec_token

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

### 获取笔记评论列表/Get note comments

`GET /api/v1/xiaohongshu/app_v2/get_note_comments`
无必填参数

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

## 搜

### 搜索笔记/Search notes

`GET /api/v1/xiaohongshu/web_v3/fetch_search_notes`
必填参数：keyword

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

### 搜索用户/Search users

`GET /api/v1/xiaohongshu/web_v3/fetch_search_users`
必填参数：keyword

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

### 获取搜索联想词/Fetch search suggestions

`GET /api/v1/xiaohongshu/web_v3/fetch_search_suggest`
无必填参数

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

## 创

### 获取创作者推荐灵感列表/Get creator inspiration feed

`GET /api/v1/xiaohongshu/app_v2/get_creator_inspiration_feed`
无必填参数

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

### 获取创作者热点灵感列表/Get creator hot inspiration

`GET /api/v1/xiaohongshu/app_v2/get_creator_hot_inspiration_feed`
无必填参数

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

## 内

### 提取分享链接信息/Extract share link info

`GET /api/v1/xiaohongshu/app/extract_share_info`
必填参数：share_link

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

### 从分享链接中提取用户ID和xsec_token/Extract user ID

`GET /api/v1/xiaohongshu/app/get_user_id_and_xsec_token`
必填参数：share_link

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

## 错误回复

❌ **操作失败**

| 字段 | 内容 |
|:---|:---|
| 错误码 | {{code}} |
| 错误信息 | {{message}} |
| 解决方法 | {{solution}} |

{{#retryable}}
💡 可以稍后重试（建议等待{{retryDelay}}秒）
{{/retryable}}
