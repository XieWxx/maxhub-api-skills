# Instagram 数据助手

Instagram 数据查询 Skill，通过 MaxHub API 接入 Instagram 平台，覆盖 V1/V2/V3 三大版本接口。全面支持帖子（Post）、Reels、Stories、Highlights、用户资料、粉丝/关注、Hashtag、Location、评论与回复、综合搜索等数据采集场景，共 **87 个端点**。专注服务海外网红营销、跨境品牌监控、社媒数据爬取、用户增长分析与内容选题等业务。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 帖子数据
- 帖子详情查询（短码/媒体 ID/分享链接三入口）
- 点赞用户/被标记用户/音乐元数据
- oEmbed 嵌入
- 短码↔媒体 ID 互转

### Reels 与 Stories
- 用户全部 Reels 列表
- 推荐 Reels 流
- 当日 Stories
- Highlights 精选合集与明细
- 音乐相关帖子流

### 评论与回复
- 一级评论（游标翻页）
- 二级回复
- 单条/批量评论翻译

### 用户画像
- 完整/简要资料卡
- 全部帖子/Reels/被标记帖子/转发记录
- 粉丝/关注列表
- About 信息/曾用名/相似推荐
- 用户名↔ID 互转

### 搜索能力
- 用户搜索
- 综合搜索
- Reels/音乐搜索
- Hashtag/Location 搜索
- Explore 探索页

### 地点与话题图谱
- Hashtag 帖子流
- Location 详情/帖子/附近地点
- 经纬度坐标搜索
- 城市/地区列表

## 安装

```bash
npx clawhub install maxhub-instagram
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 帖子 | 帮我查这个 Instagram 帖子的详情和互动数据 |
| Reels | 帮我分析这个账号的 Reels 表现 |
| 用户 | 帮我查这个 Instagram 网红的粉丝画像 |
| 搜索 | 帮我搜索 Instagram 上关于"fashion"的热门帖子 |
| Hashtag | 帮我查这个 Hashtag 下的热门帖子 |
| Stories | 帮我查这个账号的 Highlights 精选 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
