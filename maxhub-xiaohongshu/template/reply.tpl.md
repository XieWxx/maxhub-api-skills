# 小红书数据采集与分析数据回复模板

## 用户信息回复

**{{nickname}}** {{#isVerified}}✅ 已认证{{/isVerified}}

| 属性 | 信息 |
|:---|:---|
{{#userFields}}
| {{label}} | {{value}} |
{{/userFields}}

---

## 内容/视频信息回复

**{{title}}**

| 属性 | 数据 |
|:---|:---|
{{#contentFields}}
| {{label}} | {{value}} |
{{/contentFields}}

---

## 搜索结果回复

🔍 **小红书数据采集与分析搜索结果**

{{#results}}
- **{{title}}** — {{author}} · 👍 {{likeCount}} · 💬 {{commentCount}}
{{/results}}

---

## 错误回复

❌ **操作失败**

**错误信息：** {{message}}

**解决方法：** {{solution}}
