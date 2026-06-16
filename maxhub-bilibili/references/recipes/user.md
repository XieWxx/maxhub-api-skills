# Recipes: 用户 / 用户

> 本文件包含用户领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: share_to_profile · 分享链接→用户主页

> ✋ 用户语义命中：「分享链接」「b23链接」「看主页」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| share_link | ✓ | string | startsWith=`https://b23.tv/` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_uid_by_link | `share_link=$inputs.share_link` | `$.data.uid → uid` | STOP |
| s2 | get_profile | `uid=$s1.uid` | `→ profile` | SKIP |

### Output
- uid（必有）
- profile（可选）

### Fallback
s2 失败 → 返回 uid + "资料暂不可取"

---

## Recipe: profile_with_posts · 用户资料+投稿

> ✋ 用户语义命中：「用户投稿」「UP主视频」「ta的视频」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| uid | ✓ | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `uid=$inputs.uid` | `$.data.uid → uid` | STOP |
| s2 | get_user_posts | `uid=$s1.uid` | `$.data.list.vlist → posts` | SKIP |

### Output
- profile（必有）
- posts（可选）

### Fallback
s2 失败 → 返回资料 + "投稿列表暂不可取"

---

## Recipe: profile_with_stats · 用户资料+统计

> ✋ 用户语义命中：「UP主数据」「播放统计」「粉丝数」
> 估算：3 次调用 · ~3K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| uid | ✓ | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `uid=$inputs.uid` | `$.data.uid → uid` | STOP |
| s2 | get_up_stat | `uid=$s1.uid` | `$.data.archive.view → views, $.data.likes → likes` | SKIP |
| s3 | get_relation_stat | `uid=$s1.uid` | `$.data.following → following, $.data.follower → follower` | SKIP |

### Output
- profile（必有）
- up_stat（可选）
- relation_stat（可选）

### Fallback
s2/s3 任一失败 → 返回另一份 + 告知缺失

---

## Recipe: profile_with_dynamic · 用户资料+动态

> ✋ 用户语义命中：「用户动态」「ta的动态」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| uid | ✓ | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `uid=$inputs.uid` | `$.data.uid → uid` | STOP |
| s2 | get_user_dynamic | `uid=$s1.uid` | `$.data.cards → dynamics` | SKIP |

### Output
- profile（必有）
- dynamics（可选；空=暂无动态）

### Fallback
s2 空数据 → 返回资料 + "暂无动态"

---

## Recipe: dynamic_detail · 动态列表→详情

> ✋ 用户语义命中：「动态详情」「看动态」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| uid | ✓ | string | 纯数字 |
| dynamic_type | ✗ | string | "video"=用V2, 其他=用V1 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_user_dynamic | `uid=$inputs.uid` | `$.data.cards[].desc.dynamic_id → dynamic_id` | STOP |
| s2 | get_dynamic_v2 | `dynamic_id=$s1.dynamic_id` | `→ detail` | SKIP |

### Output
- dynamics（必有）
- detail（可选）

### Fallback
s2 失败 → 返回动态列表 + "详情暂不可取"
> 注：图文/专栏类动态用 get_dynamic_v1，视频类用 get_dynamic_v2
