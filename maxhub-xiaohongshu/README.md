# Xiaohongshu Data Assistant

[中文文档](README_CN.md)

Xiaohongshu (小红书) data assistant with App/Web APIs for notes, users, search & discovery, products, and topics.

## Features

- **Notes & Comments** — note detail (image/video), comments, sub-comments
- **User Profile** — user info, posted notes, favorited notes
- **Search & Discovery** — search notes/users/images/products, trending, hot list, homepage feed
- **Products & Topics** — product detail, reviews, recommendations, topic info, topic feed, creator inspiration

## Install

```bash
npx clawhub install maxhub-xiaohongshu
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-xiaohongshu.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Notes & Comments | 笔记, 详情, comments |
| User Profile | 用户, 资料, profile |
| Search & Discovery | 搜索, 热榜, trending |
| Products & Topics | 商品, 话题, product |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
