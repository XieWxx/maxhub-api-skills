# Lemon8数据采集与分析链式调用模式库

## 核心原则

1. **按需调用**：用户需求能用1个API解决就不要调用2个
2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数
3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多
4. **错误中断**：任何一步失败则停止，向用户说明原因

---

## 已知场景模式

### 模式1：搜索→Post详情

**触发场景**：用户搜索某个主题/关键词后想看具体Post内容

**调用步骤**：

1. `app/fetch_search` — 搜索关键词获取Post列表和ID（参数：query）
2. `app/fetch_post_detail` — 用PostID获取完整详情（参数：ID（从上一步获取））

**示例**：
```
用户: "搜索关于xxx的Post"
→ Step1: app/fetch_search?keyword=xxx
→ Step2: app/fetch_post_detail?id=<Step1返回的ID>
```

---

### 模式2：热搜→话题Post

**触发场景**：用户想了解当前热门话题

**调用步骤**：

1. `app/fetch_hot_search_keywords` — 获取热搜榜单（参数：无必填参数）
2. `app/fetch_topic_post_list` — 获取热门话题下的Post（参数：话题ID（从热搜选取））

**示例**：
```
用户: "现在什么最火"
→ Step1: app/fetch_hot_search_keywords
→ Step2: app/fetch_topic_post_list?id=<Step1热门话题ID>
```

---

### 模式3：Post→Comment

**触发场景**：用户想看Post的Comment

**调用步骤**：

1. `app/fetch_post_detail` — 获取Post基本信息（参数：item_id）
2. `app/fetch_post_comment_list` — 获取Comment列表（参数：PostID）

**示例**：
```
用户: "这个Post的Comment"
→ Step1: app/fetch_post_detail?id=xxx
→ Step2: app/fetch_post_comment_list?id=xxx
```

---

### 模式4：搜索→Post详情→Comment

**触发场景**：用户搜索后想看Post详情和Comment

**调用步骤**：

1. `app/fetch_search` — 搜索关键词获取Post列表（参数：query）
2. `app/fetch_post_detail` — 获取Post详情（参数：ID（从搜索结果获取））
3. `app/fetch_post_comment_list` — 获取Comment（参数：PostID）

**示例**：
```
用户: "搜索xxx并看Comment"
→ Step1: app/fetch_search?keyword=xxx
→ Step2: app/fetch_post_detail?id=<Step1返回>
→ Step3: app/fetch_post_comment_list?id=<同上>
```

---

### 模式5：Creator详情→粉丝列表

**触发场景**：用户想看某个Creator的粉丝

**调用步骤**：

1. `app/fetch_user_profile` — 获取Creator信息（参数：user_id）
2. `app/fetch_user_follower_list` — 获取粉丝列表（参数：用户ID）

**示例**：
```
用户: "这个Creator有多少粉丝"
→ Step1: app/fetch_user_profile?id=xxx
→ Step2: app/fetch_user_follower_list?id=xxx
```

---

## 未知场景处理策略

当用户需求不在上述已知模式中时，按以下策略处理：

### 单API直接调用

**触发场景**：用户需求明确，单个API即可满足

**处理策略**：直接匹配最合适的API调用，无需链式

### 先搜索后详情

**触发场景**：用户提到某个Post或Creator但不知道具体ID

**处理策略**：先用搜索类API获取ID，再用详情API获取完整数据

### 多维度组合分析

**触发场景**：用户需求跨多个数据维度（如同时需要用户数据、内容数据、互动数据）

**处理策略**：按维度分别调用对应API，将结果组合输出分析报告

### 热搜探索

**触发场景**：用户想发现热门内容但不知道具体关键词

**处理策略**：先获取热搜/榜单数据，再根据用户兴趣搜索相关Post

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
  └─ 想发现热门内容？
       └─ 先看热搜/榜单，再搜索感兴趣的Post
```
