# 微信数据采集与分析链式调用模式库

## 核心原则

1. **按需调用**：用户需求能用1个API解决就不要调用2个
2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数
3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多
4. **错误中断**：任何一步失败则停止，向用户说明原因

---

## 已知场景模式

### 模式1：搜索→文章/视频详情

**触发场景**：用户搜索某个主题/关键词后想看具体文章/视频内容

**调用步骤**：

1. `fetch_default_search` — 搜索关键词获取文章/视频列表和ID（参数：无必填参数）
2. `web/fetch_mp_article_detail_json` — 用文章/视频ID获取完整详情（参数：ID（从上一步获取））

**示例**：
```
用户: "搜索关于xxx的文章/视频"
→ Step1: fetch_default_search?keyword=xxx
→ Step2: web/fetch_mp_article_detail_json?id=<Step1返回的ID>
```

---

### 模式2：文章/视频→评论→评论回复

**触发场景**：用户想看文章/视频的评论互动

**调用步骤**：

1. `web/fetch_mp_article_detail_json` — 获取文章/视频基本信息（参数：url）
2. `web/fetch_mp_article_comment_list` — 获取评论列表（参数：文章/视频ID）
3. `web/fetch_mp_article_comment_reply_list` — 获取评论回复（参数：comment_id（从评论列表获取））

**示例**：
```
用户: "这个文章/视频的评论数据"
→ Step1: web/fetch_mp_article_detail_json?id=xxx
→ Step2: web/fetch_mp_article_comment_list?id=xxx
→ Step3: web/fetch_mp_article_comment_reply_list?comment_id=<Step2评论ID>
```

---

### 模式3：搜索→文章/视频详情→评论

**触发场景**：用户搜索后想看文章/视频详情和评论

**调用步骤**：

1. `fetch_default_search` — 搜索关键词获取文章/视频列表（参数：无必填参数）
2. `web/fetch_mp_article_detail_json` — 获取文章/视频详情（参数：ID（从搜索结果获取））
3. `web/fetch_mp_article_comment_list` — 获取评论（参数：文章/视频ID）

**示例**：
```
用户: "搜索xxx并看评论"
→ Step1: fetch_default_search?keyword=xxx
→ Step2: web/fetch_mp_article_detail_json?id=<Step1返回>
→ Step3: web/fetch_mp_article_comment_list?id=<同上>
```

---

### 模式4：公众号文章列表→文章详情

**触发场景**：用户想查看公众号的文章

**调用步骤**：

1. `web/fetch_mp_article_list` — 获取公众号文章列表（参数：ghid）
2. `web/fetch_mp_article_detail_json` — 获取文章详情（参数：url（从列表获取））

**示例**：
```
用户: "查看这个公众号的文章"
→ Step1: web/fetch_mp_article_list?ghid=xxx
→ Step2: web/fetch_mp_article_detail_json?url=<Step1文章链接>
```

---

### 模式5：文章详情→文章评论

**触发场景**：用户想看公众号文章的评论

**调用步骤**：

1. `web/fetch_mp_article_detail_json` — 获取文章详情（参数：url）
2. `web/fetch_mp_article_comment_list` — 获取文章评论（参数：url）

**示例**：
```
用户: "这篇文章的评论"
→ Step1: web/fetch_mp_article_detail_json?url=xxx
→ Step2: web/fetch_mp_article_comment_list?url=xxx
```

---

## 未知场景处理策略

当用户需求不在上述已知模式中时，按以下策略处理：

### 单API直接调用

**触发场景**：用户需求明确，单个API即可满足

**处理策略**：直接匹配最合适的API调用，无需链式

### 先搜索后详情

**触发场景**：用户提到某个文章/视频或公众号/视频号但不知道具体ID

**处理策略**：先用搜索类API获取ID，再用详情API获取完整数据

### 多维度组合分析

**触发场景**：用户需求跨多个数据维度（如同时需要用户数据、内容数据、互动数据）

**处理策略**：按维度分别调用对应API，将结果组合输出分析报告

---

## 链式调用决策树

```
用户需求
  │
  ├─ 是否知道具体ID？
  │    ├─ 是 → 直接调用详情API
  │    └─ 否 → 先搜索获取ID
  ├─ 是否需要多个数据维度？
  │    ├─ 是 → 按维度分别调用API，组合输出
  │    └─ 否 → 单API直接返回
  └─ 场景不明确？
       └─ 先用搜索API探索，再根据结果决定下一步
```
