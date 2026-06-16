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
| 1 | cross_ref:search.md#app_search_user_v2 | keyword → keyword | `$.data.users[].user_id` → user_id | STOP，告知未找到 |
| 2 | app_fetch_one_user_v2 | user_id → user_id | — | 返回搜索概要 |

### Output
- 用户资料（必有）
- 搜索候选列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知用户名未命中

---

## Recipe: share_link_to_user_profile · 分享链接看用户

> ✋ 用户语义命中：「用户链接」「主页链接」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| share_link | yes | string | 快手用户分享链接 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | web_fetch_get_user_id | share_link → share_link | `$.data.user_id` → user_id | STOP，告知链接无效 |
| 2 | web_fetch_user_info | user_id → user_id | — | 返回 user_id |

### Output
- 用户资料（必有）
- User ID（可选）

### Fallback
全部失败 → 告知链接无效

---

## Recipe: user_profile_then_posts · 用户资料加视频

> ✋ 用户语义命中：「用户视频」「主页视频」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | yes | string | 纯数字用户 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_one_user_v2 | user_id → user_id | `$.data.user_id` → user_id | STOP |
| 2 | app_fetch_user_post_v2 | user_id → user_id | — | 返回资料 + "视频列表暂不可取" |

### Output
- 用户资料（必有）
- 视频列表（可选）

### Fallback
全部失败 → 告知用户不存在

---

## Recipe: user_profile_then_hot_posts · 用户资料加热门

> ✋ 用户语义命中：「热门作品」「热门视频」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | yes | string | 纯数字用户 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_one_user_v2 | user_id → user_id | `$.data.user_id` → user_id | STOP |
| 2 | app_fetch_user_hot_post | user_id → user_id | — | 返回资料 + "热门作品暂不可取" |

### Output
- 用户资料（必有）
- 热门作品列表（可选）

### Fallback
全部失败 → 告知用户不存在

---

## Recipe: user_profile_then_live · 用户资料加直播

> ✋ 用户语义命中：「直播信息」「在直播吗」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | yes | string | 纯数字用户 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_one_user_v2 | user_id → user_id | `$.data.user_id` → user_id | STOP |
| 2 | cross_ref:live.md#app_fetch_user_live_info | user_id → user_id | — | 返回资料 + "直播信息暂不可取" |

### Output
- 用户资料（必有）
- 直播信息（可选）

### Fallback
全部失败 → 告知用户不存在
