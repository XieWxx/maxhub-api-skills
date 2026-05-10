# 知乎数据采集与分析链式调用模式库

## 核心原则

1. **按需调用**：用户需求能用1个API解决就不要调用2个
2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数
3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多
4. **错误中断**：任何一步失败则停止，向用户说明原因

---

## 已知场景模式

### 模式1：搜索→回答/文章详情

**触发场景**：用户搜索某个主题/关键词后想看具体回答/文章内容

**调用步骤**：

1. `web/fetch_video_search_v3` — 搜索关键词获取回答/文章列表和ID（参数：keyword）
2. `web/fetch_column_article_detail` — 用回答/文章ID获取完整详情（参数：ID（从上一步获取））

**示例**：
```
用户: "搜索关于xxx的回答/文章"
→ Step1: web/fetch_video_search_v3?keyword=xxx
→ Step2: web/fetch_column_article_detail?id=<Step1返回的ID>
```

---

### 模式2：答主/作者查找→答主/作者详情→回答/文章列表

**触发场景**：用户想了解某个答主/作者

**调用步骤**：

1. `web/fetch_user_search_v3` — 搜索答主/作者名获取ID（参数：keyword）
2. `web/fetch_user_info` — 获取答主/作者完整资料（参数：用户ID（从上一步获取））
3. `web/fetch_user_articles` — 获取答主/作者回答/文章列表（参数：用户ID）

**示例**：
```
用户: "分析答主/作者@某某某的数据"
→ Step1: web/fetch_user_search_v3?keyword=某某某
→ Step2: web/fetch_user_info?id=<Step1返回>
→ Step3: web/fetch_user_articles?id=<同上>
```

---

### 模式3：热搜→搜索相关内容

**触发场景**：用户想了解当前热门话题

**调用步骤**：

1. `web/fetch_hot_list` — 获取热搜榜单（参数：无必填参数）
2. `web/fetch_article_search_v3` — 搜索感兴趣的热门话题（参数：keyword（从热搜选取））

**示例**：
```
用户: "现在什么最火"
→ Step1: web/fetch_hot_list
→ Step2: web/fetch_article_search_v3?keyword=<Step1热门话题>
```

---

### 模式4：回答/文章→评论→评论回复

**触发场景**：用户想看回答/文章的评论互动

**调用步骤**：

1. `web/fetch_column_article_detail` — 获取回答/文章基本信息（参数：article_id）
2. `web/fetch_column_comment_config` — 获取评论列表（参数：回答/文章ID）
3. `web/fetch_sub_comment_v5` — 获取评论回复（参数：comment_id（从评论列表获取））

**示例**：
```
用户: "这个回答/文章的评论数据"
→ Step1: web/fetch_column_article_detail?id=xxx
→ Step2: web/fetch_column_comment_config?id=xxx
→ Step3: web/fetch_sub_comment_v5?comment_id=<Step2评论ID>
```

---

### 模式5：搜索→回答/文章详情→评论

**触发场景**：用户搜索后想看回答/文章详情和评论

**调用步骤**：

1. `web/fetch_video_search_v3` — 搜索关键词获取回答/文章列表（参数：keyword）
2. `web/fetch_column_article_detail` — 获取回答/文章详情（参数：ID（从搜索结果获取））
3. `web/fetch_column_comment_config` — 获取评论（参数：回答/文章ID）

**示例**：
```
用户: "搜索xxx并看评论"
→ Step1: web/fetch_video_search_v3?keyword=xxx
→ Step2: web/fetch_column_article_detail?id=<Step1返回>
→ Step3: web/fetch_column_comment_config?id=<同上>
```

---

### 模式6：答主/作者详情→粉丝列表

**触发场景**：用户想看某个答主/作者的粉丝

**调用步骤**：

1. `web/fetch_user_info` — 获取答主/作者信息（参数：user_url_token）
2. `web/fetch_user_followers` — 获取粉丝列表（参数：用户ID）

**示例**：
```
用户: "这个答主/作者有多少粉丝"
→ Step1: web/fetch_user_info?id=xxx
→ Step2: web/fetch_user_followers?id=xxx
```

---

### 模式7：专栏文章列表→文章详情→评论

**触发场景**：用户想查看知乎专栏的文章

**调用步骤**：

1. `web/fetch_column_articles` — 获取专栏文章列表（参数：column_id）
2. `web/fetch_column_article_detail` — 获取文章详情（参数：article_id（从列表获取））
3. `web/fetch_column_comment_config` — 获取文章评论（参数：article_id）

**示例**：
```
用户: "查看这个知乎专栏的文章"
→ Step1: web/fetch_column_articles?column_id=xxx
→ Step2: web/fetch_column_article_detail?article_id=<Step1返回>
→ Step3: web/fetch_column_comment_config?article_id=<同上>
```

---

### 模式8：问题→回答列表→评论

**触发场景**：用户想看知乎问题的回答

**调用步骤**：

1. `web/fetch_question_answers` — 获取问题回答列表（参数：question_id）
2. `web/fetch_column_comment_config` — 获取回答评论（参数：answer_id（从回答列表获取））

**示例**：
```
用户: "知乎上关于xxx的问题"
→ Step1: web/fetch_question_answers?question_id=xxx
→ Step2: web/fetch_column_comment_config?answer_id=<Step1回答ID>
```

---

## 未知场景处理策略

当用户需求不在上述已知模式中时，按以下策略处理：

### 单API直接调用

**触发场景**：用户需求明确，单个API即可满足

**处理策略**：直接匹配最合适的API调用，无需链式

### 先搜索后详情

**触发场景**：用户提到某个回答/文章或答主/作者但不知道具体ID

**处理策略**：先用搜索类API获取ID，再用详情API获取完整数据

### 先列表后逐条

**触发场景**：用户需要某个答主/作者的回答/文章中每条的详细数据

**处理策略**：先获取答主/作者回答/文章列表，再对每条回答/文章调用详情API（注意控制数量，默认最多10条）

### 多维度组合分析

**触发场景**：用户需求跨多个数据维度（如同时需要用户数据、内容数据、互动数据）

**处理策略**：按维度分别调用对应API，将结果组合输出分析报告

### 热搜探索

**触发场景**：用户想发现热门内容但不知道具体关键词

**处理策略**：先获取热搜/榜单数据，再根据用户兴趣搜索相关回答/文章

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
  ├─ 是否需要批量数据？
  │    ├─ 是 → 先获取列表，再逐条获取详情（默认≤10条）
  │    └─ 否 → 单条获取
  └─ 想发现热门内容？
       └─ 先看热搜/榜单，再搜索感兴趣的回答/文章
```
