# Recipes: 用户 / 用户

> 本文件包含用户领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: username_to_profile · 用户名→用户主页

> ✋ 用户语义命中：「搜用户」「找用户」「用户名查主页」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | ✓ | string | 用户名 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_users | `username=$inputs.username` | `$.data.users[0].user_id → user_id` | STOP |
| s2 | get_profile | `user_id=$s1.user_id` | `$.data → profile` | SKIP |

### Output
- user_id（必有）
- profile（可选）

### Fallback
s1 空结果 → 告知用户"用户名未命中"

---

## Recipe: profile_with_posts · 用户资料+作品

> ✋ 用户语义命中：「用户作品」「主页作品」「ta的作品」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | ✓ | string | 形如 `user-xxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `user_id=$inputs.user_id` | `$.data.user_id → user_id` | STOP |
| s2 | list_user_posts | `user_id=$s1.user_id` | `$.data.posts → posts` | SKIP |

### Output
- profile（必有）
- posts（可选）

### Fallback
s2 失败 → 返回资料 + "作品列表暂不可取"

---

## Recipe: username_to_posts · 用户名→用户作品

> ✋ 用户语义命中：「搜用户作品」「找ta的作品」
> 估算：3 次调用 · ~3K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | ✓ | string | 用户名 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_users | `username=$inputs.username` | `$.data.users[0].user_id → user_id` | STOP |
| s2 | get_profile | `user_id=$s1.user_id` | `$.data.user_id → user_id` | SKIP |
| s3 | list_user_posts | `user_id=$s2.user_id` | `$.data.posts → posts` | SKIP |

### Output
- user_id（必有）
- profile（可选）
- posts（可选）

### Fallback
s1 空结果 → 告知用户"用户名未命中"

---

## Recipe: user_social_circle · 看用户社交圈

> ✋ 用户语义命中：「关注粉丝」「社交关系」「社交圈」
> 估算：3 次调用 · ~3K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | ✓ | string | 形如 `user-xxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `user_id=$inputs.user_id` | `$.data.user_id → user_id` | STOP |
| s2 | list_followers | `user_id=$s1.user_id` | `$.data.followers → followers` | SKIP |
| s3 | list_following | `user_id=$s1.user_id` | `$.data.following → following` | SKIP |

### Output
- profile（必有）
- followers（可选）
- following（可选）

### Fallback
s2/s3 任一失败 → 返回另一份 + 告知缺失

---

## Recipe: user_with_cameo · 看用户Cameo出镜

> ✋ 用户语义命中：「Cameo」「出镜」「出镜记录」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | ✓ | string | 形如 `user-xxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `user_id=$inputs.user_id` | `$.data.user_id → user_id` | STOP |
| s2 | list_cameo | `user_id=$s1.user_id` | `$.data.appearances → appearances` | SKIP |

### Output
- profile（必有）
- appearances（可选；空数据=无出镜记录）

### Fallback
s2 空数据 → 返回资料 + "无 Cameo 出镜记录"
