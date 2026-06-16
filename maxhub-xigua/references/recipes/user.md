## Recipe: user_info_with_posts · 用户信息+作品

> ✋ 用户语义命中：「用户作品」「西瓜用户」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| user_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_info | user_id → user_id | $.data.user_id → uid | STOP |
| 2 | fetch_user_post_list | uid → user_id | — | 返回用户信息+"作品暂不可取" |

### Output
- 用户信息（必有）
- 用户作品列表（可选）

### Fallback
全部失败 → STOP
