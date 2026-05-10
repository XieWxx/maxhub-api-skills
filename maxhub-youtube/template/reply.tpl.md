# ▶️ YouTube数据采集与分析 回复模板

## YouTube Web

### YouTube Shorts短视频搜索/YouTube Shorts search

`GET /api/v1/youtube/web/get_shorts_search`

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

### 从频道ID获取频道URL/Get channel URL from channel ID

`GET /api/v1/youtube/web/get_channel_url`

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
| 数据说明 | channel_id: 频道ID |

---

### 从频道URL获取频道ID V2/Get channel ID from URL V2

`GET /api/v1/youtube/web/get_channel_id_v2`

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
| 数据说明 | channel_id: 频道ID（如：UCeu6U67OzJhV1KwBansH3Dg） |

---

### 搜索视频/Search video

`GET /api/v1/youtube/web/search_video`

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
| 数据说明 | 搜索结果。 |

---

### 搜索频道/Search channel

`GET /api/v1/youtube/web/search_channel`

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
| 数据说明 | 搜索结果。 |

---

> 该分类下还有 16 个API，详见 api-catalog.md

## 错误回复

❌ **操作失败**

| 字段 | 内容 |
|:---|:---|
| 错误码 | {{code}} |
| 错误信息 | {{message}} |
| 解决方法 | {{solution}} |
