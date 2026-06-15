# LinkedIn 数据助手

[English](README.md)

LinkedIn 职场数据查询助手。覆盖用户资料、公司信息、职位搜索、帖子、评论、广告等全功能。通过 MaxHub API 提供 85 个端点，覆盖 4 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 用户 & 人脉 | `references/user.md` | 用户资料、帖子、联系信息、推荐信、工作经历、技能、教育、出版物、认证、荣誉、兴趣、反应、志愿者、粉丝/连接、人脉搜索 | 45 |
| 公司 | `references/company.md` | 公司资料、员工、帖子、职位、关联页面、竞争对手、相似公司、股价、CTA、员工分布、办公地点 | 20 |
| 职位 | `references/jobs.md` | 职位详情、职位搜索 | 4 |
| 内容 & 广告 | `references/content.md` | 帖子详情、评论回复、反应、转发、帖子搜索、话题动态、群组、广告 | 16 |

支持 Web 和 Web V2 双端 API。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-linkedin
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-linkedin.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 用户 & 人脉 | 搜索LinkedIn上的Python开发者, 查这个LinkedIn用户的详细资料和工作经历, search LinkedIn for marketing managers |
| 公司 | 查LinkedIn上微软的公司信息和员工分布, 搜索LinkedIn上的AI创业公司, get LinkedIn company competitors for... |
| 职位 | 搜索LinkedIn上的远程工作职位, 查这个LinkedIn职位的详情, search LinkedIn jobs for data scientist |
| 内容 & 广告 | 搜索LinkedIn上关于AI的帖子, 查这个LinkedIn帖子的评论和反应, search LinkedIn ads by keyword |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
