# 🤖 Reddit数据采集 回复模板

## 数

### 获取Reddit APP首页推荐内容/Fetch Reddit APP Home

`GET /api/v1/reddit/app/fetch_home_feed`
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

### 获取Reddit APP流行推荐内容/Fetch Reddit APP Popu

`GET /api/v1/reddit/app/fetch_popular_feed`
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

### 获取Reddit APP游戏推荐内容/Fetch Reddit APP Game

`GET /api/v1/reddit/app/fetch_games_feed`
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

### 获取Reddit APP帖子评论/Fetch Reddit APP Post C

`GET /api/v1/reddit/app/fetch_post_comments`
必填参数：post_id

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

### 获取Reddit APP评论回复（二级评论）/Fetch Reddit APP

`GET /api/v1/reddit/app/fetch_comment_replies`
必填参数：post_id, cursor

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

### 获取用户评论列表/Fetch User Comments

`GET /api/v1/reddit/app/fetch_user_comments`
必填参数：username

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

### 获取Reddit APP搜索自动补全建议/Fetch Reddit APP Se

`GET /api/v1/reddit/app/fetch_search_typeahead`
必填参数：query

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

### 获取Reddit APP动态搜索结果/Fetch Reddit APP Dyna

`GET /api/v1/reddit/app/fetch_dynamic_search`
必填参数：query

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

### 获取Reddit APP今日热门搜索/Fetch Reddit APP Tren

`GET /api/v1/reddit/app/fetch_trending_searches`
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
