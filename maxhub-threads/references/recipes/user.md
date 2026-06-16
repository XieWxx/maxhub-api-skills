## Recipe: user_info_with_posts · 用户信息+帖子

> ✋ 用户语义命中：「用户帖子」「Threads帖子」「这个人发了什么」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| username | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_info | username → username | $.data.pk → uid | STOP |
| 2 | fetch_user_posts | uid → user_id | — | 返回用户信息+"帖子暂不可取" |

### Output
- 用户信息（必有）
- 用户帖子列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: user_info_with_replies · 用户信息+回复

> ✋ 用户语义命中：「用户回复」「这个人回复了什么」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| username | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_info | username → username | $.data.pk → uid | STOP |
| 2 | fetch_user_replies | uid → user_id | — | 返回用户信息+"回复暂不可取" |

### Output
- 用户信息（必有）
- 用户回复列表（可选）

### Fallback
全部失败 → STOP
