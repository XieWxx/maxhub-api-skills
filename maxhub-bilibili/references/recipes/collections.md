# Recipes: 收藏 / 收藏

> 本文件包含收藏领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: folders_with_videos · 收藏夹+夹内视频

> ✋ 用户语义命中：「收藏夹」「看收藏」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| uid | ✓ | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_folders | `uid=$inputs.uid` | `$.data.list[0].id → folder_id` | STOP |
| s2 | get_folder_videos | `folder_id=$s1.folder_id` | `$.data.medias → videos` | SKIP |

### Output
- folders（必有）
- videos（可选）

### Fallback
s2 失败 → 返回收藏夹列表 + "视频列表暂不可取"
