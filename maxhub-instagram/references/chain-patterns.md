# Instagram数据采集与分析链式调用模式库

## 核心原则

1. **按需调用**：用户需求能用1个API解决就不要调用2个
2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数
3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多
4. **错误中断**：任何一步失败则停止，向用户说明原因

---

## 已知场景模式

### 模式1：搜索→Post/Reel详情

**触发场景**：用户搜索某个主题/关键词后想看具体Post/Reel内容

**调用步骤**：

1. `v1/fetch_search` — 搜索关键词获取Post/Reel列表和ID（参数：query）
2. `v1/fetch_post_by_url` — 用Post/ReelID获取完整详情（参数：ID（从上一步获取））

**示例**：
```
用户: "搜索关于xxx的Post/Reel"
→ Step1: v1/fetch_search?keyword=xxx
→ Step2: v1/fetch_post_by_url?id=<Step1返回的ID>
```

---

### 模式2：User/Profile查找→User/Profile详情→Post/Reel列表

**触发场景**：用户想了解某个User/Profile

**调用步骤**：

1. `v2/search_users` — 搜索User/Profile名获取ID（参数：keyword）
2. `v1/user_id_to_username` — 获取User/Profile完整资料（参数：用户ID（从上一步获取））
3. `v1/fetch_user_posts` — 获取User/ProfilePost/Reel列表（参数：用户ID）

**示例**：
```
用户: "分析User/Profile@某某某的数据"
→ Step1: v2/search_users?keyword=某某某
→ Step2: v1/user_id_to_username?id=<Step1返回>
→ Step3: v1/fetch_user_posts?id=<同上>
```

---

### 模式3：Post/Reel→Comment→Comment回复

**触发场景**：用户想看Post/Reel的Comment互动

**调用步骤**：

1. `v1/fetch_post_by_url` — 获取Post/Reel基本信息（参数：post_url）
2. `v3/translate_comment` — 获取Comment列表（参数：Post/ReelID）
3. `v1/fetch_post_comments_v2` — 获取Comment回复（参数：comment_id（从Comment列表获取））

**示例**：
```
用户: "这个Post/Reel的Comment数据"
→ Step1: v1/fetch_post_by_url?id=xxx
→ Step2: v3/translate_comment?id=xxx
→ Step3: v1/fetch_post_comments_v2?comment_id=<Step2CommentID>
```

---

### 模式4：搜索→Post/Reel详情→Comment

**触发场景**：用户搜索后想看Post/Reel详情和Comment

**调用步骤**：

1. `v1/fetch_search` — 搜索关键词获取Post/Reel列表（参数：query）
2. `v1/fetch_post_by_url` — 获取Post/Reel详情（参数：ID（从搜索结果获取））
3. `v3/translate_comment` — 获取Comment（参数：Post/ReelID）

**示例**：
```
用户: "搜索xxx并看Comment"
→ Step1: v1/fetch_search?keyword=xxx
→ Step2: v1/fetch_post_by_url?id=<Step1返回>
→ Step3: v3/translate_comment?id=<同上>
```

---

### 模式5：User/Profile详情→粉丝列表

**触发场景**：用户想看某个User/Profile的粉丝

**调用步骤**：

1. `v1/user_id_to_username` — 获取User/Profile信息（参数：user_id）
2. `v2/fetch_user_followers` — 获取粉丝列表（参数：用户ID）

**示例**：
```
用户: "这个User/Profile有多少粉丝"
→ Step1: v1/user_id_to_username?id=xxx
→ Step2: v2/fetch_user_followers?id=xxx
```

---

## 未知场景处理策略

当用户需求不在上述已知模式中时，按以下策略处理：

### 单API直接调用

**触发场景**：用户需求明确，单个API即可满足

**处理策略**：直接匹配最合适的API调用，无需链式

### 先搜索后详情

**触发场景**：用户提到某个Post/Reel或User/Profile但不知道具体ID

**处理策略**：先用搜索类API获取ID，再用详情API获取完整数据

### 先列表后逐条

**触发场景**：用户需要某个User/Profile的Post/Reel中每条的详细数据

**处理策略**：先获取User/ProfilePost/Reel列表，再对每条Post/Reel调用详情API（注意控制数量，默认最多10条）

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
  ├─ 是否需要批量数据？
  │    ├─ 是 → 先获取列表，再逐条获取详情（默认≤10条）
  │    └─ 否 → 单条获取
  └─ 场景不明确？
       └─ 先用搜索API探索，再根据结果决定下一步
```
