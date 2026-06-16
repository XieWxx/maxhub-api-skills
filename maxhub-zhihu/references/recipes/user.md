## Recipe: user_info_with_articles · 用户信息+文章

> ✋ 用户语义命中：「用户文章」「知乎用户」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| user_url_token | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_info | user_url_token → user_url_token | $.data.url_token → utoken | STOP |
| 2 | fetch_user_articles | utoken → user_url_token | — | 返回用户信息+"文章暂不可取" |

### Output
- 用户信息（必有）
- 用户文章列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: user_info_with_social · 用户信息+社交圈

> ✋ 用户语义命中：「用户关注」「用户粉丝」「社交圈」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| user_url_token | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_info | user_url_token → user_url_token | $.data.url_token → utoken | STOP |
| 2 | fetch_user_followees | utoken → user_url_token | — | 返回资料+"关注暂不可取" |
| 3 | fetch_user_followers | utoken → user_url_token | — | 返回资料+"粉丝暂不可取" |

### Output
- 用户信息（必有）
- 关注列表（可选）
- 粉丝列表（可选）

### Fallback
第 1 步失败 → STOP；后续步失败返回已有数据
