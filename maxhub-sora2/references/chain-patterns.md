# Sora2内容浏览与分析链式调用模式库

## 核心原则

1. **按需调用**：用户需求能用1个API解决就不要调用2个
2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数
3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多
4. **错误中断**：任何一步失败则停止，向用户说明原因

---

## 已知场景模式

### 模式1：热搜→搜索相关内容

**触发场景**：用户想了解当前热门话题

**调用步骤**：

1. `get_cameo_leaderboard` — 获取热搜榜单（参数：无必填参数）
2. `search_users` — 搜索感兴趣的热门话题（参数：keyword（从热搜选取））

**示例**：
```
用户: "现在什么最火"
→ Step1: get_cameo_leaderboard
→ Step2: search_users?keyword=<Step1热门话题>
```

---

### 模式2：Post/Video→Comment→Comment回复

**触发场景**：用户想看Post/Video的Comment互动

**调用步骤**：

1. `get_post_detail` — 获取Post/Video基本信息（参数：无必填参数）
2. `get_post_comments` — 获取Comment列表（参数：Post/VideoID）
3. `get_comment_replies` — 获取Comment回复（参数：comment_id（从Comment列表获取））

**示例**：
```
用户: "这个Post/Video的Comment数据"
→ Step1: get_post_detail?id=xxx
→ Step2: get_post_comments?id=xxx
→ Step3: get_comment_replies?comment_id=<Step2CommentID>
```

---

### 模式3：Creator详情→粉丝列表

**触发场景**：用户想看某个Creator的粉丝

**调用步骤**：

1. `get_user_profile` — 获取Creator信息（参数：user_id）
2. `get_user_followers` — 获取粉丝列表（参数：用户ID）

**示例**：
```
用户: "这个Creator有多少粉丝"
→ Step1: get_user_profile?id=xxx
→ Step2: get_user_followers?id=xxx
```

---

### 模式4：搜索创作者→创作者详情→作品列表

**触发场景**：用户想了解Sora2上的创作者

**调用步骤**：

1. `search_users` — 搜索创作者用户名（参数：username）
2. `get_user_profile` — 获取创作者详情（参数：user_id（从搜索结果获取））
3. `get_user_posts` — 获取创作者作品列表（参数：user_id）

**示例**：
```
用户: "Sora2上有个创作者叫xxx"
→ Step1: search_users?username=xxx
→ Step2: get_user_profile?user_id=<Step1返回>
→ Step3: get_user_posts?user_id=<同上>
```

---

### 模式5：作品详情→作品评论

**触发场景**：用户想看Sora2作品的评论

**调用步骤**：

1. `get_post_detail` — 获取作品详情（参数：无必填参数）
2. `get_post_comments` — 获取作品评论（参数：post_id）

**示例**：
```
用户: "这个Sora2作品的评论"
→ Step1: get_post_detail?id=xxx
→ Step2: get_post_comments?post_id=xxx
```

---

## 未知场景处理策略

当用户需求不在上述已知模式中时，按以下策略处理：

### 单API直接调用

**触发场景**：用户需求明确，单个API即可满足

**处理策略**：直接匹配最合适的API调用，无需链式

### 先搜索后详情

**触发场景**：用户提到某个Post/Video或Creator但不知道具体ID

**处理策略**：先用搜索类API获取ID，再用详情API获取完整数据

### 先列表后逐条

**触发场景**：用户需要某个Creator的Post/Video中每条的详细数据

**处理策略**：先获取CreatorPost/Video列表，再对每条Post/Video调用详情API（注意控制数量，默认最多10条）

### 多维度组合分析

**触发场景**：用户需求跨多个数据维度（如同时需要用户数据、内容数据、互动数据）

**处理策略**：按维度分别调用对应API，将结果组合输出分析报告

### 热搜探索

**触发场景**：用户想发现热门内容但不知道具体关键词

**处理策略**：先获取热搜/榜单数据，再根据用户兴趣搜索相关Post/Video

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
       └─ 先看热搜/榜单，再搜索感兴趣的Post/Video
```
