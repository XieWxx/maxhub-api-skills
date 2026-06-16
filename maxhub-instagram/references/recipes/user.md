## Recipe: search_user_then_profile · 搜用户看主页

> ✋ 用户语义命中：「搜用户」「找博主」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 用户名/昵称 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | cross_ref:search.md#v3_search_users | keyword → query | `$.data.users[].pk` → user_id | STOP，告知未找到 |
| 2 | v3_get_user_profile | user_id → user_id | — | 返回搜索概要 |

### Output
- 用户资料（必有）
- 搜索候选列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知用户名未命中

---

## Recipe: search_user_then_posts · 搜用户看帖子

> ✋ 用户语义命中：「搜用户帖子」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 用户名/昵称 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | cross_ref:search.md#v3_search_users | keyword → query | `$.data.users[].username` → username | STOP |
| 2 | v3_get_user_posts | username → username | — | 返回搜索概要 + "帖子暂不可取" |

### Output
- 用户帖子列表（必有）
- 搜索候选列表（可选）

### Fallback
全部失败 → 告知用户名未命中

---

## Recipe: username_to_profile · 用户名查主页

> ✋ 用户语义命中：「用户名查用户」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | yes | string | Instagram 用户名 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_user_id_by_username | username → username | `$.data.user_id` → user_id | STOP，告知用户名未命中 |
| 2 | v3_get_user_profile | user_id → user_id | — | 返回 user_id |

### Output
- 用户资料（必有）
- User ID（可选）

### Fallback
全部失败 → 告知用户名未命中，建议搜索

---

## Recipe: user_profile_then_posts · 用户资料加帖子

> ✋ 用户语义命中：「用户帖子」「主页帖子」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | yes | string | Instagram 用户名 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_user_profile | username → username | username 复用 | STOP |
| 2 | v3_get_user_posts | username → username | — | 返回资料 + "帖子暂不可取" |

### Output
- 用户资料（必有）
- 帖子列表（可选）

### Fallback
全部失败 → 告知用户不存在

---

## Recipe: user_profile_then_reels · 用户资料加Reels

> ✋ 用户语义命中：「用户Reels」「主页Reels」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | yes | string | Instagram 用户名 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_user_profile | username → username | username 复用 | STOP |
| 2 | v3_get_user_reels | username → username | — | 返回资料 + "Reels暂不可取" |

### Output
- 用户资料（必有）
- Reels 列表（可选）

### Fallback
全部失败 → 告知用户不存在

---

## Recipe: user_highlights_then_stories · 精选看故事

> ✋ 用户语义命中：「精选故事」「Highlights」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | yes | string | Instagram 用户名 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_user_highlights | username → username | `$.data.edges[].node.id` → highlight_id | 返回"无精选" |
| 2 | v3_get_highlight_stories | highlight_id → highlight_id（加 highlight: 前缀） | — | 返回精选列表概要 |

### Output
- 精选故事详情（必有）
- 精选列表（可选）

### Fallback
全部失败 → 告知精选数据不可取

---

## Recipe: user_profile_then_followers · 用户资料加粉丝

> ✋ 用户语义命中：「粉丝列表」「关注粉丝」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | yes | string | Instagram 用户名 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_user_profile | username → username | username 复用 | STOP |
| 2 | v3_get_user_followers | username → username | — | 返回资料 + "粉丝列表暂不可取" |

### Output
- 用户资料（必有）
- 粉丝列表（可选）

### Fallback
全部失败 → 告知用户不存在
