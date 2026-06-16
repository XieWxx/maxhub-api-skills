## Recipe: user_url_to_info · 用户URL→信息

> ✋ 用户语义命中：「用户主页」「头条用户」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| user_profile_url | yes | string | startsWith=https://www.toutiao.com/c/user/ |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | app_get_user_id | user_profile_url → user_profile_url | $.data.user_id → uid | STOP |
| 2 | app_get_user_info | uid → user_id | — | 返回 user_id |

### Output
- 用户信息（必有）

### Fallback
全部失败 → STOP
