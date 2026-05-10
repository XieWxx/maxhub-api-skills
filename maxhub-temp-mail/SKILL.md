---
name: maxhub-temp-mail
description: 临时邮箱服务。当用户提到临时邮箱、temp mail、隐私邮箱等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "临时邮箱|temp mail|隐私邮箱|一次性邮箱|临时email"
categories:
  - tools
  - privacy
  - email
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "📧"
    homepage: https://www.aconfig.cn
    config:
      default_page_size:
        type: number
        default: 20
        description: "默认每页返回条数"
      max_chain_depth:
        type: number
        default: 3
        description: "链式调用最大深度"
      cost_alert_threshold:
        type: number
        default: 20
        description: "连续调用超过此数值时提醒费用"
  homepage: https://www.aconfig.cn
  repository: https://github.com/XieWxx/maxhub-api-skills
  tags:
    - 临时邮箱
    - temp mail
    - 隐私邮箱
    - 一次性邮箱
    - 临时email
---

# 📧 临时邮箱服务

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 创建临时邮箱

**你说：** `帮我创建一个临时邮箱`

**我返回：** 返回邮箱地址和Token，可用于接收邮件

### 查看收件箱

**你说：** `查看我的临时邮箱有没有收到邮件`

**我返回：** 返回邮件列表，包含发件人、主题、内容

> 💡 只要用自然语言描述你的需求，我会自动选择最合适的API来获取数据！

---

## 🔑 认证方式

本 Skill 需要通过 MaxHub API Key 进行认证：

1. 访问 [MaxHub API](https://www.aconfig.cn) 注册账号
2. 在用户中心创建 API Key
3. 将 API Key 配置到环境变量 `MAXHUB_API_KEY`

> 新用户注册即赠送 ¥0.10 体验金

---

## 📋 API 能力概览

共 **3** 个 API，覆盖以下能力：

### Temp Mail（3个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `/api/v1/temp_mail/v1/get_email_by_id` | GET | - | 通过邮件ID获取邮件数据 |
| `/api/v1/temp_mail/v1/get_emails_inbox` | GET | - | 获取邮件列表 |
| `/api/v1/temp_mail/v1/get_temp_email_address` | GET | - | 获取一个临时邮箱地址 |

---

## ⚠️ 常见错误

| 错误码 | 原因 | 解决方法 |
|:---|:---|:---|
| 401 | API Key无效或未配置 | 访问 https://www.aconfig.cn 创建API Key |
| 402 | 账户余额不足 | 访问 https://www.aconfig.cn 充值 |
| 429 | 请求频率超限 | 等待30秒后重试 |
| 404 | API端点不存在 | 检查API路径是否正确 |

---

## 🔒 安全声明

- 本 Skill **仅** 获取平台已公开的信息
- API Key 通过环境变量安全传递，**不会** 被存储或转发
- 所有请求均通过 HTTPS 加密传输
- 本 Skill **不会** 读取浏览器 Cookie 或其他敏感信息
