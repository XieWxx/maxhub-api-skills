# 西瓜视频数据助手

西瓜视频数据查询 Skill，通过 MaxHub API 接入字节跳动旗下中视频平台西瓜视频。覆盖视频详情（v1+v2）、视频播放地址、视频评论列表、视频综合搜索、用户资料、用户作品列表等核心能力，共 **7 个端点**。专注服务西瓜视频内容采集、用户研究、中视频内容分析与跨平台数据对齐场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 视频详情双版本
- 完整详情查询（v1+v2 双版本）
- 双版本交叉校对，提升数据可靠性
- 自动降级兜底，单版本不可用时切换

### 播放地址直取
- 单接口获取无水印播放地址

### 评论分页链路
- 全部评论列表查询
- 偏移量翻页，可持续获取

### 视频综合搜索
- 关键词检索
- 按发布时间/热度排序
- 按时长上下限过滤

### 用户全景画像
- 创作者资料/签名/认证/粉丝数据
- 全部作品列表（翻页）

## 安装

```bash
npx clawhub install maxhub-xigua
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 视频 | 帮我查这个西瓜视频的详情和播放地址 |
| 搜索 | 帮我搜索西瓜视频上关于"科技"的热门视频 |
| 评论 | 帮我拉取这个视频的全部评论 |
| 用户 | 帮我查这个西瓜视频创作者的基本信息 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
