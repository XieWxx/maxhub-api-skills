# Douyin Video — 批量+统计+分享 / 抖音视频 — 批量+统计+分享
> 本文件是 [video/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### app_v3_fetch_multi_video — 批量获取视频详情 V1（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_multi_video`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
批量获取视频详情，最多支持 10 个。

#### 何时使用 / 不使用
- ✅ 需要批量获取少量视频详情（≤10）
- ❌ 超过 10 个 → 用 `app_v3_fetch_multi_video_v2`（最多 50 个）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | array | yes | 最多 10 个元素 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].aweme_id | `$.data[].aweme_id` | 作品 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_multi_video_v2` |

---

### app_v3_fetch_multi_video_v2 — 批量获取视频详情 V2（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_multi_video_v2`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
批量获取视频详情 V2 版本，最多支持 50 个。**批量查询首选**。

#### 何时使用 / 不使用
- ✅ 批量获取视频详情（≤50 个）
- ❌ 单个视频 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | array | yes | 最多 50 个元素 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].aweme_id | `$.data[].aweme_id` | 作品 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_multi_video` |

---

### web_fetch_multi_video — 批量获取视频详情（Web）

**Full path:** `/api/v1/douyin/web/fetch_multi_video`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
Web 版批量获取视频详情，最多支持 50 个。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_multi_video_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | array | yes | 最多 50 个元素 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].aweme_id | `$.data[].aweme_id` | 作品 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_multi_video_v2` |

---

### app_v3_fetch_video_statistics — 取视频统计数据

**Full path:** `/api/v1/douyin/app/v3/fetch_video_statistics`
**Method:** GET · **Risk:** low

#### 用途
获取视频统计数据（点赞数、下载数、播放数、分享数）。**大多数接口已不返回播放数，只能通过此接口获取**。

#### 何时使用 / 不使用
- ✅ 需要视频播放数
- ✅ 需要精确的互动统计数据
- ❌ 超过 2 个视频 → 用 `app_v3_fetch_multi_video_statistics`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | string | yes | 逗号分隔，最多 2 个 | 作品 ID，如 `7448118827402972455,7126745726494821640` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| digg_count | `$.data.digg_count` | 点赞数 | 直接交付用户 |
| play_count | `$.data.play_count` | 播放数 | 直接交付用户 |
| share_count | `$.data.share_count` | 分享数 | 直接交付用户 |
| download_count | `$.data.download_count` | 下载数 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_multi_video_statistics — 批量取视频统计数据

**Full path:** `/api/v1/douyin/app/v3/fetch_multi_video_statistics`
**Method:** GET · **Risk:** low

#### 用途
批量获取视频统计数据，最多支持 50 个视频。

#### 何时使用 / 不使用
- ✅ 需要批量获取统计数据（≤50 个）
- ❌ 仅 1-2 个 → 用 `app_v3_fetch_video_statistics`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | string | yes | 逗号分隔，最多 50 个 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].play_count | `$.data[].play_count` | 播放数 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### app_v3_add_video_play_count — 增加视频播放量

**Full path:** `/api/v1/douyin/app/v3/add_video_play_count`
**Method:** GET · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
增加视频播放量。单一作品每次调用增加 1 次播放数，请求约 1000 次后会被抖音限制。**副作用写入操作，必须获得用户明确确认**。

#### 何时使用 / 不使用
- ✅ 用户明确要求增加某视频播放量（需确认）
- ❌ 仅查看播放量 → 用 `app_v3_fetch_video_statistics`
- ❌ 未获得用户确认 → **禁止调用**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_type | integer | yes | 0=视频, 1=图文 | 作品类型 |
| item_id | string | yes | 纯数字字符串 | 作品 ID |
| cookie | string | no | — | 敏感登录凭据；仅在用户明确授权时使用 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 仅返回时间戳和状态码 | 无链式下游 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 429 | 被抖音限制 | STOP，告知用户 | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### app_v3_fetch_share_info_by_share_code — 用分享口令取分享信息

**Full path:** `/api/v1/douyin/app/v3/fetch_share_info_by_share_code`
**Method:** GET · **Risk:** low

#### 用途
通过抖音分享口令（如 `8:/ h@O.kP 05/21 ... 长按复制打开抖音`）获取分享信息。

#### 何时使用 / 不使用
- ✅ 用户提供分享口令（非链接）
- ❌ 用户提供分享链接 → 用 `app_v3_fetch_one_video_by_share_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_code | string | yes | — | 分享口令文本 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | app_v3_fetch_one_video |
| sec_uid | `$.data.sec_uid` | 分享人 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 口令格式无效 | 校正后重试 | ≤1 次 | — |

---

### app_v3_generate_douyin_short_url — 生成抖音短链接

**Full path:** `/api/v1/douyin/app/v3/generate_douyin_short_url`
**Method:** GET · **Risk:** low

#### 用途
将抖音长链接转换为短链接。

#### 何时使用 / 不使用
- ✅ 用户需要生成抖音短链接
- ❌ 需要 Web 版短链接 → 用 `tools.md` 的 `web_handler_shorten_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 合法的抖音链接 | 待转换的长链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| short_url | `$.data.short_url` | 短链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | URL 格式无效 | 校正后重试 | ≤1 次 | — |

---

### app_v3_generate_douyin_video_share_qrcode — 生成视频分享二维码

**Full path:** `/api/v1/douyin/app/v3/generate_douyin_video_share_qrcode`
**Method:** GET · **Risk:** low

#### 用途
生成视频分享二维码。

#### 何时使用 / 不使用
- ✅ 用户需要视频分享二维码
- ❌ 需要短链接 → 用 `app_v3_generate_douyin_short_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| object_id | string | yes | 纯数字字符串 | 作品 ID 或作者 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| qrcode_url | `$.data.qrcode_url` | 二维码图片链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | object_id 无效 | STOP | 0 | 无替代 |
