## Recipe: user_profile_with_posts · 用户资料+帖子

> ✋ 用户语义命中：「用户帖子」「看看ta的帖子」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| username | yes | string | 不带 u/ 前缀 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_profile | username → username | username 复用 | STOP |
| 2 | fetch_user_posts | username → username | — | 返回资料+"帖子列表暂不可取" |

### Output
- 用户资料（必有）
- 帖子列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: user_profile_with_comments · 用户资料+评论

> ✋ 用户语义命中：「用户评论」「ta的评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| username | yes | string | 不带 u/ 前缀 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_profile | username → username | username 复用 | STOP |
| 2 | fetch_user_comments | username → username | — | 返回资料+"评论列表暂不可取" |

### Output
- 用户资料（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP
