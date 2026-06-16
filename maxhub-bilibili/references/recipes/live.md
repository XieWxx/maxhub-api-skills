# Recipes: 直播 / 直播

> 本文件包含直播领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: area_to_streamers · 分区→主播列表

> ✋ 用户语义命中：「直播分区」「看主播」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无必填参数 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_live_areas | — | `$.data.data[0].id → area_id` | STOP |
| s2 | get_live_streamers | `area_id=$s1.area_id` | `$.data.list → streamers` | SKIP |

### Output
- areas（必有）
- streamers（可选）

### Fallback
s2 失败 → 返回分区列表 + "主播列表暂不可取"

---

## Recipe: streamer_to_room · 主播→直播间

> ✋ 用户语义命中：「看直播间」「直播详情」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| area_id | ✓ | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_live_streamers | `area_id=$inputs.area_id` | `$.data.list[0].roomid → room_id` | STOP |
| s2 | get_live_room | `room_id=$s1.room_id` | `→ room_detail` | SKIP |

### Output
- streamers（必有）
- room_detail（可选）

### Fallback
s2 失败 → 返回主播列表 + "直播间详情暂不可取"

---

## Recipe: room_to_profile · 直播间→主播主页

> ✋ 用户语义命中：「主播资料」「直播UP主」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| room_id | ✓ | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_live_room | `room_id=$inputs.room_id` | `$.data.uid → uid` | STOP |
| s2 | cross_ref:user.md#get_profile | `uid=$s1.uid` | `→ profile` | SKIP |

### Output
- room_detail（必有）
- profile（可选）

### Fallback
s2 失败 → 返回直播间详情 + "主播资料暂不可取"
