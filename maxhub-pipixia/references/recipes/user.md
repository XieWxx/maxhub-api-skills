## Recipe: user_info_with_posts · 用户信息+作品

> ✋ 用户语义命中：「用户作品」「皮皮虾用户」

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

---

## Recipe: user_info_with_social · 用户信息+社交圈

> ✋ 用户语义命中：「用户粉丝」「用户关注」「社交圈」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| user_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_info | user_id → user_id | $.data.user_id → uid | STOP |
| 2 | fetch_user_follower_list | uid → user_id | — | 返回资料+"粉丝暂不可取" |
| 3 | fetch_user_following_list | uid → user_id | — | 返回资料+"关注暂不可取" |

### Output
- 用户信息（必有）
- 粉丝列表（可选）
- 关注列表（可选）

### Fallback
第 1 步失败 → STOP；后续步失败返回已有数据
