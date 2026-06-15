# Twitter/X 数据助手

[English](README.md)

Twitter/X 数据查询助手。覆盖推文详情、用户资料、搜索、评论、趋势、关注、粉丝、媒体等全功能。通过 MaxHub API 提供 12 个端点，覆盖 2 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 用户 | `references/user.md` | 用户资料、用户推文、回复、媒体、关注、粉丝 | 6 |
| 内容 | `references/content.md` | 推文详情、评论、搜索时间线、趋势、转推列表 | 6 |

支持 Web API 端点。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-twitter
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-twitter.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 用户 | 查推特用户 @elonmusk 的粉丝和关注, Twitter用户资料 |
| 内容 | 查推文详情和评论, 搜索推特 |
| 趋势 | 查Twitter趋势, twitter trending |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
