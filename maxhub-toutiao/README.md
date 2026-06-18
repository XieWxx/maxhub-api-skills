# 今日头条数据助手

今日头条数据查询 Skill，通过 MaxHub API 接入字节跳动旗下资讯聚合平台今日头条。覆盖 App 端文章详情/视频详情/评论列表/用户资料/用户 ID 解析，以及 Web 端文章详情/视频详情两类入口，共 **7 个端点**。专注服务于头条内容采集、用户画像研究、文章/视频爬取与跨端数据对齐场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 文章与视频双形态（5 端点）
- 拉取头条文章详情：完整正文、配图、作者与发布时间
- 拉取头条视频详情：视频元数据、封面与互动统计
- 同一篇内容支持文章与视频两种调用入口，覆盖图文与视频双场景
- 同时支持 App 端（group_id）与 Web 端（aweme_id）两种数据入口
- App 端与 Web 端可双向校对同一篇内容的元数据，提升采集可靠性
- 跨端字段互补，规避单端数据缺失或字段空洞的风险

### 评论链路
- 拉取一篇头条文章或视频下的一级评论列表
- 支持游标翻页，可持续翻页直至覆盖全部评论
- 还原读者的真实反馈与争议焦点，辅助舆情研判

### 用户全景画像（2 端点）
- 读取头条号作者的资料、签名、认证身份与粉丝量
- 通过用户主页 URL 反查用户唯一标识，打通"链接 → 资料"的解析链路
- 适合 MCN 与品牌方批量梳理头条号矩阵与作者画像

### App 与 Web 双端覆盖
- 同时支持 App 端与 Web 端两种数据入口，按场景灵活选择
- 内置 App 与 Web 端点替换矩阵，单端不可用时自动降级兜底
- App 端 group_id 与 Web 端 aweme_id 主键互斥，不可混用

## 安装

```bash
npx clawhub install maxhub-toutiao
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 文章 | 帮我查这篇头条文章的详情 |
| 视频 | 帮我查这个头条视频的信息和播放数据 |
| 评论 | 帮我拉取这篇文章的全部评论 |
| 用户 | 帮我查这个头条号的基本信息和粉丝量 |
| URL 解析 | 帮我把这个头条用户主页链接转成用户 ID |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
