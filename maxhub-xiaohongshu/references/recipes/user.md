## Recipe: search_user_then_profile · 搜索用户看主页

> ✋ 用户语义命中：「搜用户」「找博主」「用户主页」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 用户名/昵称 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | search_users | keyword → keyword | `$.data.users[].user_id` → user_id | STOP，告知未找到 |
| 2 | get_user_info | user_id → user_id | — | 返回搜索概要 |

### Output
- 用户资料（必有）
- 搜索候选列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知用户名未命中

---

## Recipe: user_profile_then_notes · 用户资料加笔记

> ✋ 用户语义命中：「用户笔记」「主页笔记」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | yes | string | 24 位 hex |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_user_info | user_id → user_id | `$.data.data.user_id` → user_id | STOP |
| 2 | get_user_posted_notes | user_id → user_id | — | 返回资料 + "笔记列表暂不可取" |

### Output
- 用户资料（必有）
- 笔记列表（可选）

### Fallback
全部失败 → 告知用户不存在

---

## Recipe: user_profile_then_faved · 用户资料加收藏

> ✋ 用户语义命中：「用户收藏」「收藏列表」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | yes | string | 24 位 hex |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_user_info | user_id → user_id | `$.data.data.user_id` → user_id | STOP |
| 2 | get_user_faved_notes | user_id → user_id | — | 返回资料 + "收藏暂不可取" |

### Output
- 用户资料（必有）
- 收藏列表（可选，仅公开收藏）

### Fallback
全部失败 → 告知用户不存在

---

## Recipe: share_link_to_user · 分享链接看用户

> ✋ 用户语义命中：「用户分享链接」「打开用户链接」
> 估算：1 次调用 · ~1K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| share_text | yes | string | xhslink.com 链接 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_user_info | share_text → share_text | — | STOP |

### Output
- 用户资料（必有）

### Fallback
全部失败 → 告知链接无效
