# 抖音数据回复模板

## 用户信息回复

**{{nickname}}** {{#isVerified}}✅ 已认证{{/isVerified}}

| 属性 | 信息 |
|:---|:---|
| 抖音号 | {{uniqueId}} |
| UID | {{uid}} |
| 签名 | {{signature}} |
| IP属地 | {{ipLocation}} |
| 粉丝数 | **{{followerCount}}** |
| 关注数 | {{followingCount}} |
| 获赞数 | {{totalFavorited}} |
| 作品数 | {{awemeCount}} |

---

## 视频信息回复

**{{title}}**

| 属性 | 数据 |
|:---|:---|
| 作者 | {{author.nickname}} |
| 播放量 | **{{statistics.playCount}}** |
| 点赞数 | {{statistics.diggCount}} |
| 评论数 | {{statistics.commentCount}} |
| 分享数 | {{statistics.shareCount}} |
| 收藏数 | {{statistics.collectCount}} |
| 时长 | {{duration}} |
| 发布时间 | {{createTime}} |

{{#tags}}
🏷️ 标签：{{tags}}
{{/tags}}

---

## 热搜榜回复

🔥 **抖音热搜榜**

| 排名 | 话题 | 热度 | 标签 |
|:---|:---|:---|:---|
{{#hotList}}
| {{rank}} | {{title}} | {{hotValue}} | {{tag}} |
{{/hotList}}

---

## 评论列表回复

💬 **视频评论**（共{{total}}条）

{{#comments}}
- **{{author}}**（👍 {{diggCount}}）：{{text}}
  📍 {{ipLocation}} · 🕐 {{createTime}} · 💬 {{replyCount}}条回复
{{/comments}}

---

## 直播信息回复

🔴 **{{title}}**

| 属性 | 信息 |
|:---|:---|
| 主播 | {{owner.nickname}} |
| 状态 | {{status}} |
| 观看人数 | **{{userCount}}** |
| 点赞数 | {{likeCount}} |

---

## 错误回复

❌ **操作失败**

**错误信息：** {{message}}

**解决方法：** {{solution}}

{{#retryable}}
💡 可以稍后重试（建议等待{{retryDelay}}秒）
{{/retryable}}
