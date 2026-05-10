# B站数据采集与分析链式调用模式库

## 核心原则

1. **按需调用**：用户需求能用1个API解决就不要调用2个
2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数
3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多
4. **错误中断**：任何一步失败则停止，向用户说明原因

---

## 已知场景模式

### 模式1：搜索→视频/投稿详情

**触发场景**：用户搜索某个主题/关键词后想看具体视频/投稿内容

**调用步骤**：

1. `web/fetch_general_search` — 搜索关键词获取视频/投稿列表和ID（参数：keyword, order, page, page_size）
2. `web/fetch_one_video` — 用视频/投稿ID获取完整详情（参数：ID（从上一步获取））

**示例**：
```
用户: "搜索关于xxx的视频/投稿"
→ Step1: web/fetch_general_search?keyword=xxx
→ Step2: web/fetch_one_video?id=<Step1返回的ID>
```

---

### 模式2：热搜→搜索相关内容

**触发场景**：用户想了解当前热门话题

**调用步骤**：

1. `web/fetch_hot_search` — 获取热搜榜单（参数：limit）
2. `web/fetch_general_search` — 搜索感兴趣的热门话题（参数：keyword（从热搜选取））

**示例**：
```
用户: "现在什么最火"
→ Step1: web/fetch_hot_search
→ Step2: web/fetch_general_search?keyword=<Step1热门话题>
```

---

### 模式3：视频/投稿→评论/弹幕→评论/弹幕回复

**触发场景**：用户想看视频/投稿的评论/弹幕互动

**调用步骤**：

1. `web/fetch_one_video` — 获取视频/投稿基本信息（参数：bv_id）
2. `web/fetch_video_comments` — 获取评论/弹幕列表（参数：视频/投稿ID）
3. `web/fetch_comment_reply` — 获取评论/弹幕回复（参数：comment_id（从评论/弹幕列表获取））

**示例**：
```
用户: "这个视频/投稿的评论/弹幕数据"
→ Step1: web/fetch_one_video?id=xxx
→ Step2: web/fetch_video_comments?id=xxx
→ Step3: web/fetch_comment_reply?comment_id=<Step2评论/弹幕ID>
```

---

### 模式4：搜索→视频/投稿详情→评论/弹幕

**触发场景**：用户搜索后想看视频/投稿详情和评论/弹幕

**调用步骤**：

1. `web/fetch_general_search` — 搜索关键词获取视频/投稿列表（参数：keyword, order, page, page_size）
2. `web/fetch_one_video` — 获取视频/投稿详情（参数：ID（从搜索结果获取））
3. `web/fetch_video_comments` — 获取评论/弹幕（参数：视频/投稿ID）

**示例**：
```
用户: "搜索xxx并看评论/弹幕"
→ Step1: web/fetch_general_search?keyword=xxx
→ Step2: web/fetch_one_video?id=<Step1返回>
→ Step3: web/fetch_video_comments?id=<同上>
```

---

## 未知场景处理策略

当用户需求不在上述已知模式中时，按以下策略处理：

### 单API直接调用

**触发场景**：用户需求明确，单个API即可满足

**处理策略**：直接匹配最合适的API调用，无需链式

### 先搜索后详情

**触发场景**：用户提到某个视频/投稿或UP主但不知道具体ID

**处理策略**：先用搜索类API获取ID，再用详情API获取完整数据

### 先列表后逐条

**触发场景**：用户需要某个UP主的视频/投稿中每条的详细数据

**处理策略**：先获取UP主视频/投稿列表，再对每条视频/投稿调用详情API（注意控制数量，默认最多10条）

### 多维度组合分析

**触发场景**：用户需求跨多个数据维度（如同时需要用户数据、内容数据、互动数据）

**处理策略**：按维度分别调用对应API，将结果组合输出分析报告

### 热搜探索

**触发场景**：用户想发现热门内容但不知道具体关键词

**处理策略**：先获取热搜/榜单数据，再根据用户兴趣搜索相关视频/投稿

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
       └─ 先看热搜/榜单，再搜索感兴趣的视频/投稿
```
