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
| 1 | cross_ref:search.md#web_v2_fetch_user_search | keyword → query | `$.data.list[].uid` → uid | STOP，告知未找到 |
| 2 | web_v2_fetch_user_info | uid → uid | — | 返回搜索概要 |

### Output
- 用户资料（必有）
- 搜索候选列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知用户名未命中

---

## Recipe: search_user_then_posts · 搜用户看微博

> ✋ 用户语义命中：「搜用户微博」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 用户名/昵称 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | cross_ref:search.md#web_v2_fetch_user_search | keyword → query | `$.data.list[].uid` → uid | STOP |
| 2 | web_v2_fetch_user_posts | uid → uid | — | 返回搜索概要 + "微博列表暂不可取" |

### Output
- 用户微博列表（必有）
- 搜索候选列表（可选）

### Fallback
全部失败 → 告知用户名未命中

---

## Recipe: user_profile_then_timeline · 用户资料加微博

> ✋ 用户语义命中：「用户微博」「主页微博」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| uid | yes | string | 用户 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_user_info | uid → uid | `$.data.uid` → uid | STOP |
| 2 | app_fetch_user_timeline | uid → uid | — | 返回资料 + "微博列表暂不可取" |

### Output
- 用户资料（必有）
- 微博列表（可选）

### Fallback
全部失败 → 告知用户不存在

---

## Recipe: username_to_profile · 用户名查主页

> ✋ 用户语义命中：「用户名查用户」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| custom | yes | string | 微博用户名 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | web_v2_fetch_user_info | custom → custom | `$.data.uid` → uid | STOP，告知用户名未命中 |
| 2 | app_fetch_user_info_detail | uid → uid | — | 返回基本资料 |

### Output
- 用户详细资料（必有）
- 用户基本信息（第 2 步失败时可选）

### Fallback
全部失败 → 告知用户名未命中，建议搜索

---

## Recipe: user_video_collection · 用户视频收藏

> ✋ 用户语义命中：「视频收藏」「收藏夹」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| uid | yes | string | 用户 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | web_v2_fetch_user_video_collection_list | uid → uid | `$.data.list[].id` → cid | 返回"无收藏夹" |
| 2 | web_v2_fetch_user_video_collection_detail | cid → cid | — | 返回收藏夹列表概要 |

### Output
- 收藏夹详情（必有）
- 收藏夹列表（可选）

### Fallback
全部失败 → 告知收藏数据不可取
