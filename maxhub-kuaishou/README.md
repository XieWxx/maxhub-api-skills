# 快手数据助手

快手数据查询 Skill，通过 MaxHub API 接入快手平台 App 端与 Web 端双链路。覆盖短视频详情、批量查询、链接解析、用户资料、投稿与收藏、视频评论与子回复、综合搜索、热榜矩阵、直播信息与回放等全部能力，共 **38 个端点**。专注服务快手内容创作者、直播带货分析师、KOL 投放运营、短剧追踪团队与本地生活商家。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 视频数据
- 单条/批量视频详情查询（App/Web 双端）
- 支持 photo_id、URL、分享文案三种入口
- 分享口令反解、分享 URL 查视频
- App/Web 短链生成

### 用户画像
- 用户资料卡查询
- 投稿列表与热门作品
- 公开收藏列表（App/Web 双端）
- 分享链接反查用户 ID

### 评论与回复
- 一级评论（游标翻页）
- 二级回复链路（App/Web 双端）

### 热榜矩阵
- 热榜分类列表与详情
- 热搜人物榜
- Web 端独立热榜
- 话题 Tag 搜索与 Tag 视频流
- 推荐 Feed

### 直播能力
- 直播间实时状态
- 直播总榜/购物榜/品牌榜/音乐榜
- 历史直播回放

### 搜索能力
- 综合搜索
- 视频/用户/图集/直播/音乐/Tag 垂直搜索
- 按时间/时长/性别过滤

## 安装

```bash
npx clawhub install maxhub-kuaishou
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 视频 | 帮我查这个快手视频的详情和播放数据 |
| 用户 | 帮我分析这个快手账号的粉丝画像 |
| 搜索 | 帮我搜索快手上关于"美食"的热门视频 |
| 热榜 | 帮我看看今天快手热榜 |
| 评论 | 帮我拉取这个视频的评论 |
| 直播 | 帮我查这个直播间的实时数据 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
