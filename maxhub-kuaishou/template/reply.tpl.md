# 🎬 快手数据采集与分析 回复模板

## 数

### 获取单个作品数据 V1/Get single video data V1

`GET /api/v1/kuaishou/web/fetch_one_video`
必填参数：share_text

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

### 获取单个作品数据 V2/Get single video data V2

`GET /api/v1/kuaishou/web/fetch_one_video_v2`
必填参数：photo_id

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

### 链接获取作品数据/Fetch single video by URL

`GET /api/v1/kuaishou/web/fetch_one_video_by_url`
必填参数：url

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

### 获取作品一级评论/Fetch video comments

`GET /api/v1/kuaishou/web/fetch_one_video_comment`
必填参数：photo_id

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

### 获取作品二级评论/Fetch video sub comments

`GET /api/v1/kuaishou/web/fetch_one_video_sub_comment`
必填参数：photo_id, root_comment_id

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

### 获取单个作品评论数据/Get single video comment data

`GET /api/v1/kuaishou/app/fetch_one_video_comment`
必填参数：photo_id

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

## 工

### 生成分享短连接/Generate share short URL

`GET /api/v1/kuaishou/web/generate_share_short_url`
必填参数：photo_id

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

### 生成快手分享链接/Generate Kuaishou share link

`GET /api/v1/kuaishou/app/generate_kuaishou_share_link`
必填参数：shareObjectId

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

### 快手批量视频查询接口/Kuaishou batch video query AP

`GET /api/v1/kuaishou/app/fetch_videos_batch`
必填参数：photo_ids

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

### 综合搜索/Comprehensive search

`GET /api/v1/kuaishou/app/search_comprehensive`
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

### 搜索视频V2/Search video V2

`GET /api/v1/kuaishou/app/search_video_v2`
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
