# Recipes: 视频 / 视频

> 本文件包含视频领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: video_with_play · 看视频+播放

> ✋ 用户语义命中：「看视频播放」「播放视频」「视频流」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_web | `bv_id=$inputs.bv_id` | `$.data.bvid → bv_id`, `$.data.cid → cid` | STOP |
| s2 | get_playurl | `bv_id=$s1.bv_id, cid=$s1.cid` | `→ play_url` | SKIP |

### Output
- video_detail（必有）
- play_url（可选）

### Fallback
s2 失败 → 返回详情 + "播放地址暂不可取"

---

## Recipe: video_with_subtitle · 看视频+字幕

> ✋ 用户语义命中：「视频字幕」「看字幕」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_web | `bv_id=$inputs.bv_id` | `$.data.aid → a_id`, `$.data.cid → c_id` | STOP |
| s2 | get_subtitle | `a_id=$s1.a_id, c_id=$s1.c_id` | `→ subtitle` | SKIP |

### Output
- video_detail（必有）
- subtitle（可选）

### Fallback
s2 失败 → 返回详情 + "字幕暂不可取"

---

## Recipe: video_with_parts · 看视频+分P

> ✋ 用户语义命中：「分P」「多P」「第几P」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_web | `bv_id=$inputs.bv_id` | `$.data.bvid → bv_id` | STOP |
| s2 | get_parts | `bv_id=$s1.bv_id` | `$.data.parts → parts` | SKIP |

### Output
- video_detail（必有）
- parts（可选；空=单P视频）

### Fallback
s2 空数据 → 返回详情 + "该视频为单P"

---

## Recipe: video_with_comments · 看视频+评论

> ✋ 用户语义命中：「视频评论」「看评论」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_web | `bv_id=$inputs.bv_id` | `$.data.bvid → bv_id` | STOP |
| s2 | cross_ref:comments.md#get_comments_web | `bv_id=$s1.bv_id` | `$.data.replies → comments` | SKIP |

### Output
- video_detail（必有）
- comments（可选）

### Fallback
s2 失败 → 返回详情 + "评论暂不可取"

---

## Recipe: video_with_danmaku · 看视频+弹幕

> ✋ 用户语义命中：「弹幕」「看弹幕」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_web | `bv_id=$inputs.bv_id` | `$.data.cid → cid` | STOP |
| s2 | cross_ref:comments.md#get_danmaku | `cid=$s1.cid` | `→ danmaku` | SKIP |

### Output
- video_detail（必有）
- danmaku（可选）

### Fallback
s2 失败 → 返回详情 + "弹幕暂不可取"

---

## Recipe: video_with_author · 看视频+作者

> ✋ 用户语义命中：「视频作者」「UP主」「谁发的」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_web | `bv_id=$inputs.bv_id` | `$.data.owner.mid → uid` | STOP |
| s2 | cross_ref:user.md#get_profile | `uid=$s1.uid` | `→ profile` | SKIP |

### Output
- video_detail（必有）
- profile（可选）

### Fallback
s2 失败 → 返回详情 + "作者资料暂不可取"

---

## Recipe: bv2aid_then_detail · BV转AV取详情

> ✋ 用户语义命中：「BV转AV」「AV号」
> 估算：2 次调用 · ~2K token · 中间步不可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | bv2aid | `bv_id=$inputs.bv_id` | `$.data.aid → aid` | STOP |
| s2 | get_video_detail | `aid=$s1.aid` | `→ video_detail` | STOP |

### Output
- aid（必有）
- video_detail（可选）

### Fallback
s1 失败 → STOP

---

## Recipe: url_video_play · URL取视频+播放

> ✋ 用户语义命中：「链接看视频」「URL播放」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| url | ✓ | string | startsWith=`https://www.bilibili.com/video/` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_v3 | `url=$inputs.url` | `$.data.bvid → bv_id`, `$.data.cid → cid` | STOP |
| s2 | get_playurl | `bv_id=$s1.bv_id, cid=$s1.cid` | `→ play_url` | SKIP |

### Output
- video_detail（必有）
- play_url（可选）

### Fallback
s2 失败 → 返回详情 + "播放地址暂不可取"

---

## Recipe: vip_video_play · 大会员视频播放

> ✋ 用户语义命中：「大会员」「高清」「4K」
> 估算：2 次调用 · ~2K token · 写入端点需确认

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| bv_id | ✓ | string | 形如 `BV1xxxxxx` |
| cookie | ✓ | string | 大会员 Cookie（敏感信息） |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_web | `bv_id=$inputs.bv_id` | `$.data.bvid → bv_id`, `$.data.cid → cid` | STOP |
| s2 | get_vip_playurl | `bv_id=$s1.bv_id, cid=$s1.cid, cookie=$inputs.cookie` | `→ vip_play_url` | STOP |

### Output
- video_detail（必有）
- vip_play_url（可选；失败可降级到普通清晰度）

### Fallback
s2 失败 → 降级到 get_playurl（普通清晰度），**必须显式告知用户**
