# YouTube 数据助手

YouTube 数据查询 Skill，通过 MaxHub API 接入 YouTube 平台 Web / Web V2 双版本接口。覆盖视频详情、播放流（Streams）、字幕（Captions）、推荐与趋势、频道资料、频道视频与 Shorts、社区帖子、视频评论与回复、综合搜索与建议词等全部能力，共 **37 个端点**。专注服务 YouTube 内容创作者、跨境短视频研究、频道竞品分析与字幕翻译爬取业务。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 视频数据
- 视频详情查询（ID/URL 双入口）
- 播放流获取（多分辨率/多编码）
- 签名播放 URL
- 相关推荐列表

### 字幕能力
- 一键获取字幕（V2）
- 传统字幕 URL 流程（V1 兜底）
- 多语言字幕支持
- JSON/VTT 多格式输出
- 双接口自动降级

### 频道画像
- 频道完整资料查询
- 长视频列表（翻页）
- Shorts 列表
- 社区帖子
- 频道描述详情
- 频道 ID 与 URL 互转（@handle/自定义路径↔标准频道 ID）

### 评论与回复
- 一级评论（排序/翻页）
- 二级回复
- 社区帖子详情/评论/回复
- 游标翻页

### 搜索能力
- 综合搜索
- Shorts 搜索
- 频道搜索
- 搜索建议词
- 按时间/时长/特征过滤

### 趋势与推荐
- 按地区/分区趋势视频榜
- 相关推荐视频

## 安装

```bash
npx clawhub install maxhub-youtube
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 视频 | 帮我查这个 YouTube 视频的详情和字幕 |
| 频道 | 帮我分析这个 YouTube 频道的视频表现 |
| 搜索 | 帮我搜索 YouTube 上关于"AI"的热门视频 |
| 趋势 | 帮我看看美国地区 YouTube 趋势榜 |
| 评论 | 帮我拉取这个视频的评论 |
| Shorts | 帮我查这个频道的 Shorts 视频列表 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
