# 微博数据采集与分析链式调用模式库

## 核心原则

1. **按需调用**：用户需求能用1个API解决就不要调用2个
2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数
3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多
4. **错误中断**：任何一步失败则停止，向用户说明原因

---

## 已知场景模式

### 模式1：搜索→微博详情

**触发场景**：用户搜索某个主题/关键词后想看具体微博内容

**调用步骤**：

1. `web_v2/fetch_video_search` — 搜索关键词获取微博列表和ID（参数：query）
2. `web/fetch_post_detail` — 用微博ID获取完整详情（参数：ID（从上一步获取））

**示例**：
```
用户: "搜索关于xxx的微博"
→ Step1: web_v2/fetch_video_search?keyword=xxx
→ Step2: web/fetch_post_detail?id=<Step1返回的ID>
```

---

### 模式2：博主/大V查找→博主/大V详情→微博列表

**触发场景**：用户想了解某个博主/大V

**调用步骤**：

1. `web_v2/search_user_posts` — 搜索博主/大V名获取ID（参数：uid）
2. `web/fetch_user_info` — 获取博主/大V完整资料（参数：用户ID（从上一步获取））
3. `web/fetch_user_posts` — 获取博主/大V微博列表（参数：用户ID）

**示例**：
```
用户: "分析博主/大V@某某某的数据"
→ Step1: web_v2/search_user_posts?keyword=某某某
→ Step2: web/fetch_user_info?id=<Step1返回>
→ Step3: web/fetch_user_posts?id=<同上>
```

---

### 模式3：热搜→搜索相关内容

**触发场景**：用户想了解当前热门话题

**调用步骤**：

1. `web/fetch_trend_top` — 获取热搜榜单（参数：containerid）
2. `web/fetch_search` — 搜索感兴趣的热门话题（参数：keyword（从热搜选取））

**示例**：
```
用户: "现在什么最火"
→ Step1: web/fetch_trend_top
→ Step2: web/fetch_search?keyword=<Step1热门话题>
```

---

### 模式4：微博→评论→评论回复

**触发场景**：用户想看微博的评论互动

**调用步骤**：

1. `web/fetch_post_detail` — 获取微博基本信息（参数：post_id）
2. `web/fetch_post_comments` — 获取评论列表（参数：微博ID）
3. `web/fetch_comment_replies` — 获取评论回复（参数：comment_id（从评论列表获取））

**示例**：
```
用户: "这个微博的评论数据"
→ Step1: web/fetch_post_detail?id=xxx
→ Step2: web/fetch_post_comments?id=xxx
→ Step3: web/fetch_comment_replies?comment_id=<Step2评论ID>
```

---

### 模式5：搜索→微博详情→评论

**触发场景**：用户搜索后想看微博详情和评论

**调用步骤**：

1. `web_v2/fetch_video_search` — 搜索关键词获取微博列表（参数：query）
2. `web/fetch_post_detail` — 获取微博详情（参数：ID（从搜索结果获取））
3. `web/fetch_post_comments` — 获取评论（参数：微博ID）

**示例**：
```
用户: "搜索xxx并看评论"
→ Step1: web_v2/fetch_video_search?keyword=xxx
→ Step2: web/fetch_post_detail?id=<Step1返回>
→ Step3: web/fetch_post_comments?id=<同上>
```

---

### 模式6：博主/大V详情→粉丝列表

**触发场景**：用户想看某个博主/大V的粉丝

**调用步骤**：

1. `web/fetch_user_info` — 获取博主/大V信息（参数：uid）
2. `web_v2/fetch_user_fans` — 获取粉丝列表（参数：用户ID）

**示例**：
```
用户: "这个博主/大V有多少粉丝"
→ Step1: web/fetch_user_info?id=xxx
→ Step2: web_v2/fetch_user_fans?id=xxx
```

---

## 未知场景处理策略

当用户需求不在上述已知模式中时，按以下策略处理：

### 单API直接调用

**触发场景**：用户需求明确，单个API即可满足

**处理策略**：直接匹配最合适的API调用，无需链式

### 先搜索后详情

**触发场景**：用户提到某个微博或博主/大V但不知道具体ID

**处理策略**：先用搜索类API获取ID，再用详情API获取完整数据

### 先列表后逐条

**触发场景**：用户需要某个博主/大V的微博中每条的详细数据

**处理策略**：先获取博主/大V微博列表，再对每条微博调用详情API（注意控制数量，默认最多10条）

### 多维度组合分析

**触发场景**：用户需求跨多个数据维度（如同时需要用户数据、内容数据、互动数据）

**处理策略**：按维度分别调用对应API，将结果组合输出分析报告

### 热搜探索

**触发场景**：用户想发现热门内容但不知道具体关键词

**处理策略**：先获取热搜/榜单数据，再根据用户兴趣搜索相关微博

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
       └─ 先看热搜/榜单，再搜索感兴趣的微博
```
