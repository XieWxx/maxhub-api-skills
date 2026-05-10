# 小红书数据采集与分析链式调用模式库

## 核心原则

1. **按需调用**：用户需求能用1个API解决就不要调用2个
2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数
3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多
4. **错误中断**：任何一步失败则停止，向用户说明原因

---

## 已知场景模式

### 模式1：搜索→笔记详情

**触发场景**：用户搜索某个主题/关键词后想看具体笔记内容

**调用步骤**：

1. `web_v3/fetch_search_notes` — 搜索关键词获取笔记列表和ID（参数：keyword）
2. `web_v3/fetch_note_detail` — 用笔记ID获取完整详情（参数：ID（从上一步获取））

**示例**：
```
用户: "搜索关于xxx的笔记"
→ Step1: web_v3/fetch_search_notes?keyword=xxx
→ Step2: web_v3/fetch_note_detail?id=<Step1返回的ID>
```

---

### 模式2：博主/达人查找→博主/达人详情→笔记列表

**触发场景**：用户想了解某个博主/达人

**调用步骤**：

1. `web_v3/fetch_search_users` — 搜索博主/达人名获取ID（参数：keyword）
2. `web_v3/fetch_user_info` — 获取博主/达人完整资料（参数：用户ID（从上一步获取））
3. `web_v3/fetch_user_notes` — 获取博主/达人笔记列表（参数：用户ID）

**示例**：
```
用户: "分析博主/达人@某某某的数据"
→ Step1: web_v3/fetch_search_users?keyword=某某某
→ Step2: web_v3/fetch_user_info?id=<Step1返回>
→ Step3: web_v3/fetch_user_notes?id=<同上>
```

---

### 模式3：热搜→话题笔记

**触发场景**：用户想了解当前热门话题

**调用步骤**：

1. `web_v2/fetch_hot_list` — 获取热搜榜单（参数：无必填参数）
2. `app_v2/get_topic_feed` — 获取热门话题下的笔记（参数：话题ID（从热搜选取））

**示例**：
```
用户: "现在什么最火"
→ Step1: web_v2/fetch_hot_list
→ Step2: app_v2/get_topic_feed?id=<Step1热门话题ID>
```

---

### 模式4：笔记→评论→评论回复

**触发场景**：用户想看笔记的评论互动

**调用步骤**：

1. `web_v3/fetch_note_detail` — 获取笔记基本信息（参数：note_id, xsec_token）
2. `web_v3/fetch_note_comments` — 获取评论列表（参数：笔记ID）
3. `web_v3/fetch_sub_comments` — 获取评论回复（参数：comment_id（从评论列表获取））

**示例**：
```
用户: "这个笔记的评论数据"
→ Step1: web_v3/fetch_note_detail?id=xxx
→ Step2: web_v3/fetch_note_comments?id=xxx
→ Step3: web_v3/fetch_sub_comments?comment_id=<Step2评论ID>
```

---

### 模式5：搜索→笔记详情→评论

**触发场景**：用户搜索后想看笔记详情和评论

**调用步骤**：

1. `web_v3/fetch_search_notes` — 搜索关键词获取笔记列表（参数：keyword）
2. `web_v3/fetch_note_detail` — 获取笔记详情（参数：ID（从搜索结果获取））
3. `web_v3/fetch_note_comments` — 获取评论（参数：笔记ID）

**示例**：
```
用户: "搜索xxx并看评论"
→ Step1: web_v3/fetch_search_notes?keyword=xxx
→ Step2: web_v3/fetch_note_detail?id=<Step1返回>
→ Step3: web_v3/fetch_note_comments?id=<同上>
```

---

### 模式6：博主/达人详情→粉丝列表

**触发场景**：用户想看某个博主/达人的粉丝

**调用步骤**：

1. `web_v3/fetch_user_info` — 获取博主/达人信息（参数：user_id）
2. `web_v2/fetch_follower_list` — 获取粉丝列表（参数：用户ID）

**示例**：
```
用户: "这个博主/达人有多少粉丝"
→ Step1: web_v3/fetch_user_info?id=xxx
→ Step2: web_v2/fetch_follower_list?id=xxx
```

---

## 未知场景处理策略

当用户需求不在上述已知模式中时，按以下策略处理：

### 单API直接调用

**触发场景**：用户需求明确，单个API即可满足

**处理策略**：直接匹配最合适的API调用，无需链式

### 先搜索后详情

**触发场景**：用户提到某个笔记或博主/达人但不知道具体ID

**处理策略**：先用搜索类API获取ID，再用详情API获取完整数据

### 先列表后逐条

**触发场景**：用户需要某个博主/达人的笔记中每条的详细数据

**处理策略**：先获取博主/达人笔记列表，再对每条笔记调用详情API（注意控制数量，默认最多10条）

### 多维度组合分析

**触发场景**：用户需求跨多个数据维度（如同时需要用户数据、内容数据、互动数据）

**处理策略**：按维度分别调用对应API，将结果组合输出分析报告

### 热搜探索

**触发场景**：用户想发现热门内容但不知道具体关键词

**处理策略**：先获取热搜/榜单数据，再根据用户兴趣搜索相关笔记

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
       └─ 先看热搜/榜单，再搜索感兴趣的笔记
```
