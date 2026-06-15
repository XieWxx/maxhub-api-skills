# 抖音数据助手

[English](README.md)

抖音全场景数据查询助手。覆盖视频、用户、搜索、热榜、创作者、星图达人、内容指数、直播、评论、工具等10大功能模块，共273个活跃端点。

## 功能

| 分类 | 端点 | 说明 |
|------|------|------|
| **视频** | 42 | 视频详情（单个/批量）、高清播放链接、统计数据、合集/短剧、音乐/话题详情、分享/短链/二维码、频道内容、相关推荐、ID提取 |
| **用户** | 24 | 用户信息（多方式查询）、粉丝/关注列表、用户作品、喜欢列表、收藏夹、合辑、批量查询、用户搜索 |
| **搜索** | 19 | 综合搜索、视频/用户/图片/直播/话题搜索、搜索建议、多重搜索、经验/音乐/讨论/学校/图像搜索 |
| **热榜** | 39 | 热榜分类、上升/同城/挑战热点榜、活动日历、观众画像、视频/话题/搜索热榜、热门内容词、首页推荐、视频频道 |
| **创作者** | 29 | 创作者活动、素材中心榜单、创作热点、话题/道具/音乐/挑战榜、课程、商单任务、行业分类、作品流量分析、观众画像、账号诊断、直播历史 |
| **星图KOL** | 43 | KOL ID查询、基本信息、观众/粉丝画像、服务报价、数据概览、KOL搜索、转化分析、星图指数、视频表现、热词分析、热榜、达人广场、MCN搜索、IP日历 |
| **抖音指数** | 44 | 关键词趋势、关联词、人群画像、达人分析、品牌指数/雷达图/趋势线/周期、话题搜索、创作指南、创作者/消费者画像、消费/互动趋势、趋势报告 |
| **评论** | 6 | 视频评论、评论回复、视频弹幕（App + Web） |
| **直播** | 14 | 直播流、弹幕、送礼排行、直播间商品、商品SKU/优惠券/评价、直播间ID转换 |
| **工具** | 13 | 设备注册、APP跳转链接、游客Cookie、Token生成（msToken/ttwid/verify_fp/s_v_web_id）、签名生成（X-Bogus/A-Bogus/弹幕xb） |

## 安装

```bash
npx clawhub install maxhub-douyin
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-douyin.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令（中文） | Example prompts (English) |
|------|-----------------|--------------------------|
| 视频 | 查抖音视频 aweme_id=... | Get Douyin video details aweme_id=... |
| 用户 | 查抖音用户 sec_user_id=... | Get Douyin user profile sec_user_id=... |
| 搜索 | 搜抖音 "美食" | Search Douyin for "food" |
| 热榜 | 查抖音热榜 | Show Douyin trending list |
| 创作者 | 查创作者后台作品数据 | Get Douyin creator item analytics |
| 星图KOL | 查星图达人 kolId=... | Get Douyin Xingtu KOL data kolId=... |
| 抖音指数 | 查抖音指数 "关键词"趋势 | Get Douyin index keyword trends |
| 评论 | 查抖音视频评论 | Get Douyin video comments |
| 直播 | 查抖音直播数据 | Get Douyin live stream data |
| 工具 | 生成抖音游客Cookie | Generate Douyin guest Cookie |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
