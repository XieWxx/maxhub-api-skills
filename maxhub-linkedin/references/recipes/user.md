## Recipe: user_profile_with_posts · 用户资料+帖子

> ✋ 用户语义命中：「用户帖子」「领英帖子」「这个人发了什么」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| username | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_user_profile | username → username | $.data.username → uname | STOP |
| 2 | v2_get_user_posts | uname → username | — | 返回资料+"帖子暂不可取" |

### Output
- 用户资料（必有）
- 用户帖子列表（可选）

### Fallback
全部失败 → STOP，告知用户信息获取失败

---

## Recipe: search_people_to_profile · 搜索人→资料

> ✋ 用户语义命中：「搜索人」「找人」「领英找人」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_search_users | keyword → keyword | $.data.elements[].public_identifier → uname | STOP |
| 2 | v2_get_user_profile | uname → username | — | 返回搜索列表+"资料暂不可取" |

### Output
- 搜索结果列表（必有）
- 用户资料（可选）

### Fallback
全部失败 → STOP

---

## Recipe: user_top_card · 用户顶部卡片

> ✋ 用户语义命中：「用户概览」「用户简介」「快速了解」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| username | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_user_top_card | username → username | — | STOP |

### Output
- 用户概览卡片（必有）

### Fallback
失败 → STOP
