# Recipes: 评论与弹幕 / 评论与弹幕

> 本文件包含评论与弹幕领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: comments_with_reply · 评论+回复

> ✋ 用户语义命中：「评论回复」「看回复」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_comments_web | `bv_id=$inputs.bv_id` | `$.data.replies[].rpid → rpid` | STOP |
| s2 | get_comment_reply | `bv_id=$inputs.bv_id, rpid=$s1.rpid` | `→ replies` | SKIP |

### Output
- comments（必有）
- replies（可选）

### Fallback
s2 失败 → 返回评论 + "回复暂不可取"

---

## Recipe: video_full_interact · 视频+评论+弹幕

> ✋ 用户语义命中：「视频互动」「评论弹幕」
> 估算：3 次调用 · ~3K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | cross_ref:video.md#get_video_web | `bv_id=$inputs.bv_id` | `$.data.bvid → bv_id`, `$.data.cid → cid` | STOP |
| s2 | get_comments_web | `bv_id=$s1.bv_id` | `→ comments` | SKIP |
| s3 | get_danmaku | `cid=$s1.cid` | `→ danmaku` | SKIP |

### Output
- video_detail（必有）
- comments（可选）
- danmaku（可选）

### Fallback
s2/s3 任一失败 → 返回另一份 + 告知缺失
