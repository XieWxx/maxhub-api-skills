# Recipes: 工具与热榜 / 工具与热榜

> 本文件包含工具与热榜领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: text_to_video · 文生视频

> ✋ 用户语义命中：「生成视频」「文生视频」「创建视频」
> 估算：3 次调用 · ~3K token · 中间步不可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| prompt | ✓ | string | length≤500 |
| duration | ✗ | string | enum=`5,10` |
| aspect_ratio | ✗ | string | enum=`16:9,9:16,1:1` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | create_video | `prompt=$inputs.prompt, duration=$inputs.duration, aspect_ratio=$inputs.aspect_ratio` | `$.data.task_id → task_id` | STOP |
| s2 | get_task_status | `task_id=$s1.task_id` | `$.data.status → status` | RETRY_ONCE |
| s3 | get_task_detail | `task_id=$s1.task_id` | `$.data.video.url → video_url` | RETRY_ONCE |

### Output
- task_id（必有；任意失败均返回）
- video_url（可选；任务成功后才有）

### Fallback
s1 失败 → STOP，让用户重新确认 prompt
s2/s3 失败 → 返回 task_id，让用户后续继续轮询
> ⚠️ s2 为轮询步骤，pending/running 状态需继续轮询，不视为失败

---

## Recipe: image_to_video · 图生视频

> ✋ 用户语义命中：「图生视频」「图片生成视频」「用图做视频」
> 估算：4 次调用 · ~4K token · 中间步不可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| image_url | ✓ | string | startsWith=`http` |
| prompt | ✓ | string | length≤500 |
| duration | ✗ | string | enum=`5,10` |
| aspect_ratio | ✗ | string | enum=`16:9,9:16,1:1` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | upload_image | `image_url=$inputs.image_url` | `$.data.image_id → image_id` | STOP |
| s2 | create_video | `prompt=$inputs.prompt, image_id=$s1.image_id, duration=$inputs.duration, aspect_ratio=$inputs.aspect_ratio` | `$.data.task_id → task_id` | STOP |
| s3 | get_task_status | `task_id=$s2.task_id` | `$.data.status → status` | RETRY_ONCE |
| s4 | get_task_detail | `task_id=$s2.task_id` | `$.data.video.url → video_url` | RETRY_ONCE |

### Output
- task_id（必有；s1 之后任意失败均返回）
- video_url（可选；任务成功后才有）

### Fallback
s1 失败 → STOP，让用户重新提供图片 URL
s2 失败 → STOP，让用户重新确认 prompt
s3/s4 失败 → 返回 task_id，让用户后续继续轮询
> ⚠️ s3 为轮询步骤，pending/running 状态需继续轮询，不视为失败

---

## Recipe: cameo_to_profile · 热榜→用户主页

> ✋ 用户语义命中：「Cameo热榜」「谁最火」「出镜排行」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| index | ✗ | integer | 榜单排名索引（default: 0） |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_cameo_board | — | `$.data.leaderboard[$inputs.index].user_id → user_id` | STOP |
| s2 | cross_ref:user.md#get_profile | `user_id=$s1.user_id` | `$.data → profile` | SKIP |

### Output
- leaderboard（必有）
- profile（可选）

### Fallback
s2 失败 → 返回热榜数据 + "用户资料暂不可取"
