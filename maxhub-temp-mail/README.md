# 临时邮箱助手

临时邮箱（一次性邮箱）Skill，通过 MaxHub API 提供生成临时邮件地址、查询收件箱与读取邮件详情三件套能力，共 **3 个端点**。专注服务自动化测试、网站注册验证码接收、隐私保护与匿名注册场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 临时邮箱即开即用
- 一键生成新邮箱地址 + 专属访问凭据

### 收件箱实时查询
- 全部邮件列表（发件人/主题/时间）
- 轮询等待验证码

### 邮件详情读取
- 完整正文/HTML/附件元数据

### Token 权限隔离
- 每个邮箱独立凭据
- 跨邮箱不可访问
- 过期自动失效

## 安装

```bash
npx clawhub install maxhub-temp-mail
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 生成邮箱 | 帮我生成一个临时邮箱 |
| 查收件箱 | 帮我查这个临时邮箱的收件箱 |
| 读邮件 | 帮我读取这封邮件的正文内容 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
