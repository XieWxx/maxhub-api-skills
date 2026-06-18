# TikTok 数据助手

TikTok 海外短视频数据查询与分析 Skill，通过 MaxHub API 接入 TikTok 全平台公开数据。覆盖视频详情、用户画像、搜索趋势、评论直播、广告分析、创作者后台、TikTok Shop 电商、虚假流量分析、签名加密工具等九大领域共 **174 个端点**。专注服务 TikTok 出海创作者、跨境电商运营、海外营销广告优化师与数据分析团队。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 视频数据
- 视频详情查询（多入口），支持批量查询
- 探索流/首页推荐流
- 合辑作品查询
- 分享链接解析与 App 直跳

### 用户数据
- 用户主页全量信息（App/Web 双端）
- 用户名/唯一 ID/加密 ID 互转
- 国家归属与相似用户推荐
- 发布/转发/点赞/收藏作品列表
- 粉丝/关注列表（含关键词搜索）
- 音乐使用列表、直播详情、主页二维码、带货信息

### 搜索能力
- 综合搜索、视频/用户/音乐/话题/直播/地点/图片搜索
- 音乐详情与排行榜
- 话题详情与创作者搜索洞察
- 商品搜索、热搜词与联想、翻译、短链解析

### 评论与互动
- 一级评论（App/Web 多入口）
- 二级回复
- 直播间标识提取

### 直播数据
- 直播间详情/排行榜/日榜
- 在线状态检测
- 挂车商品查询
- IM 弹幕流与签名
- 礼物列表

### 数据分析
- 视频核心指标
- 虚假流量检测
- 评论关键词词云
- 创作者里程碑

### 创作者后台
- 账号健康/违规记录
- 洞察总览
- 直播/视频/商品分析
- 橱窗商品
- 视频深度统计/带货转化/观众画像

### 广告分析
- 广告详情/搜索/热门精选
- 关键帧/百分位/互动分析
- 相似推荐广告
- 趋势话题

### TikTok Shop 电商
- 商品详情/评价
- 商家商品
- 商品搜索/分类/热卖
- 店铺信息/布局/商品

### 工具与加密
- msToken/ttwid/webid/设备指纹
- XBogus/XGnarly 签名
- 加密解密、设备注册、游客 Cookie

## 安装

```bash
npx clawhub install maxhub-tiktok
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 视频 | 帮我查这个 TikTok 视频的详情和播放数据 |
| 用户 | 帮我分析这个 TikTok 账号的粉丝画像 |
| 搜索 | 帮我搜索 TikTok 上关于"AI"的热门视频 |
| 直播 | 帮我查这个 TikTok 直播间的实时数据 |
| 电商 | 帮我查这个 TikTok Shop 商品的热卖数据 |
| 广告 | 帮我分析这个 TikTok 广告的投放效果 |
| 创作者 | 帮我查这个创作者的账号健康度 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
