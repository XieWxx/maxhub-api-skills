# 📰 头条数据采集与分析 回复模板

## 数

### 获取指定文章的信息/Get information of specified a

`GET /api/v1/toutiao/web/get_article_info`
必填参数：aweme_id

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

### 获取指定视频的信息/Get information of specified v

`GET /api/v1/toutiao/web/get_video_info`
必填参数：aweme_id

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

### 获取指定文章的信息/Get information of specified a

`GET /api/v1/toutiao/app/get_article_info`
必填参数：group_id

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

### 获取指定作品的评论/Get comments of specified post

`GET /api/v1/toutiao/app/get_comments`
必填参数：group_id, offset

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
