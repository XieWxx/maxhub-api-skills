## Recipe: share_link_to_user_profile · 分享链接→用户资料

> ✋ 用户语义命中：「用户链接」「看看主页」「Lemon8用户」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| share_text | yes | string | Lemon8 用户分享链接 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | get_user_id | share_text → share_text | $.data.user_id → uid | STOP |
| 2 | fetch_user_profile | uid → user_id | — | 返回 user_id |

### Output
- 用户资料（必有）

### Fallback
全部失败 → STOP

---

## Recipe: user_profile_with_followers · 用户资料+粉丝

> ✋ 用户语义命中：「用户粉丝」「粉丝列表」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| user_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_profile | user_id → user_id | $.data.user_id → uid | STOP |
| 2 | fetch_user_follower_list | uid → user_id | — | 返回资料+"粉丝列表暂不可取" |

### Output
- 用户资料（必有）
- 粉丝列表（可选）

### Fallback
全部失败 → STOP
