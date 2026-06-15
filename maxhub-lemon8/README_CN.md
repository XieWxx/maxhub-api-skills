# Lemon8 数据助手

[English](README.md)

Lemon8 内容数据查询助手。通过 MaxHub API 提供 16 个端点，覆盖 2 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 用户 | `references/user.md` | 用户信息、粉丝列表、关注列表、ID提取 | 5 |
| 内容 | `references/content.md` | 帖子详情、评论、发现页、话题、搜索、ID提取 | 11 |

参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-lemon8
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-lemon8.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 用户 | 查柠檬8用户信息，查这个lemon8用户的粉丝和关注 |
| 内容 | 查柠檬8帖子详情，在柠檬8搜索美妆，查lemon8发现页，查lemon8话题帖子 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
