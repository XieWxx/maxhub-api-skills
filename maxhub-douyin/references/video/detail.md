# Douyin Video — 视频详情+高清链接 / 抖音视频 — 视频详情+高清链接
> 本文件是 [video/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### app_v3_fetch_one_video — 获取单个视频详情（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
用 aweme_id 获取单个视频完整详情，支持图文、视频等。**链式调用的常见起点**——大多数 aweme_id 与 sec_user_id 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 aweme_id（纯数字，如 `7448118827402972455`）
- ✅ 链式起点：取 aweme_id 或 sec_user_id
- ✅ 需要完整视频元数据（标题、描述、作者、统计等）
- ❌ 用户提供分享链接 → 用 `app_v3_fetch_one_video_by_share_url`
- ❌ 想看评论 → 直接用 `comments.md` 的 `app_v3_fetch_video_comments`
- ❌ 想要高清播放链接 → 用 `app_v3_fetch_video_high_quality_play_url`
- ❌ 接口返回空 → 尝试 `web_fetch_one_video`（App V3 和 Web 数据源不同）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID，如 `7448118827402972455` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | app_v3_fetch_video_high_quality_play_url / comments.md 全部端点 / app_v3_fetch_video_statistics |
| author.sec_uid | `$.data.author.sec_uid` | 作者加密 ID | user.md 全部 user 系端点 |
| author.uid | `$.data.author.uid` | 作者数字 ID | user.md / xingtu.md |
| music_id | `$.data.music.id` | 背景音乐 ID | app_v3_fetch_music_detail / app_v3_fetch_music_video_list |
| mix_id | `$.data.mix_info.mix_id` | 合集 ID | app_v3_fetch_video_mix_detail / app_v3_fetch_video_mix_post_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aweme_id 不存在 | STOP | 0 | 无替代 |
| status_code=8 | 版权限制/已删除 | STOP，告知用户 | 0 | 尝试 `app_v3_fetch_one_video_v3`（无版权限制版本） |
| status_code=5 | 私人内容 | STOP，告知用户 | 0 | 无替代 |
| 空响应 | App V3 数据源无数据 | 换 Web 版 | ≤1 次 | **替换**：`web_fetch_one_video`（同参数 aweme_id） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_one_video` |

---

### app_v3_fetch_one_video_v2 — 获取单个视频详情 V2（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_one_video_v2`
**Method:** GET · **Risk:** low

#### 用途
V2 版本视频详情接口，返回字段与 V1 略有差异。

#### 何时使用 / 不使用
- ✅ V1 返回空或异常时作为降级
- ❌ 首选 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | 同 app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_one_video_v2` |

---

### app_v3_fetch_one_video_v3 — 获取单个视频详情 V3（无版权限制）

**Full path:** `/api/v1/douyin/app/v3/fetch_one_video_v3`
**Method:** GET · **Risk:** low

#### 用途
V3 版本，解决了版权限制问题。支持视频和文章类型。

#### 何时使用 / 不使用
- ✅ V1 返回 status_code=8（版权限制）时
- ✅ 需要获取文章类型内容
- ❌ 首选 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品或文章 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | 同 app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在 | STOP | 0 | 无替代 |

---

### web_fetch_one_video — 获取单个视频详情（Web）

**Full path:** `/api/v1/douyin/web/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
Web 版视频详情接口，支持锚点信息。若此接口失效，请使用 `web_fetch_one_video_v2` 或 App 版本。

#### 何时使用 / 不使用
- ✅ App V3 版本返回空时的降级选择
- ✅ 需要 `need_anchor_info` 锚点信息
- ❌ 首选 → 用 `app_v3_fetch_one_video`（App V3 数据更完整）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |
| need_anchor_info | boolean | no | default: false | 是否需要锚点信息 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | 同 app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_one_video` |

---

### web_fetch_one_video_v2 — 获取单个视频详情 V2（Web）

**Full path:** `/api/v1/douyin/web/fetch_one_video_v2`
**Method:** GET · **Risk:** low

#### 用途
Web V2 版本视频详情接口。

#### 何时使用 / 不使用
- ✅ `web_fetch_one_video` 失效时的降级
- ❌ 首选 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | 同 app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_one_video_v2` |

---

### app_v3_fetch_one_video_by_share_url — 用分享链接取视频详情（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_one_video_by_share_url`
**Method:** GET · **Risk:** low

#### 用途
通过抖音分享链接（短链接或长链接）获取视频详情。**当用户只提供分享链接时的首选入口**。

#### 何时使用 / 不使用
- ✅ 用户提供分享链接（如 `https://v.douyin.com/e3x2fjE/`）
- ❌ 用户已有 aweme_id → 直接用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_url | string | yes | 合法的抖音分享链接 | 分享链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | app_v3_fetch_one_video / app_v3_fetch_video_high_quality_play_url |
| author.sec_uid | `$.data.author.sec_uid` | 作者加密 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | share_url 格式无效 | 校正 URL | ≤1 次 | — |
| 404 | 链接已失效 | STOP | 0 | 无替代 |

---

### web_fetch_one_video_by_share_url — 用分享链接取视频详情（Web）

**Full path:** `/api/v1/douyin/web/fetch_one_video_by_share_url`
**Method:** GET · **Risk:** low

#### 用途
Web 版分享链接解析。视频画质比 App 版高，但响应字段较少。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ✅ 用户需要更高画质
- ❌ 首选 → 用 `app_v3_fetch_one_video_by_share_url`（字段更完整）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_url | string | yes | 合法的抖音分享链接 | 分享链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_one_video_by_share_url` |

---

### app_v3_fetch_video_high_quality_play_url — 取最高画质播放链接（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_video_high_quality_play_url`
**Method:** GET · **Risk:** low

#### 用途
获取视频的最高画质（原始上传画质）播放链接，非常适合获取高清无水印视频链接。

#### 何时使用 / 不使用
- ✅ 用户明确要"高清"/"无水印"/"下载"视频
- ✅ 链式中间步：从视频详情取高清链接
- ❌ 只想看视频详情 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | oneOf(aweme_id, share_url) | 纯数字字符串 | 作品 ID（优先使用） |
| share_url | string | oneOf(aweme_id, share_url) | 合法的抖音链接 | 分享链接 |
| region | string | no | ISO 国家代码 | 请求出口地区（CN/US/HK），国内用户建议传 CN 获取国内 CDN |

> **二选一逻辑**：aweme_id 与 share_url 必须传且只传一个。优先使用 aweme_id。同时传 → 以 aweme_id 为准；都不传 → 400。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_id | `$.data.video_id` | 视频 ID | 直接交付用户 |
| original_video_url | `$.data.original_video_url` | 最高画质播放链接 | 直接交付用户 |
| video_data | `$.data.video_data` | 视频元数据 | 参考信息 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | aweme_id/share_url 都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 视频不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_video_high_quality_play_url` |

---

### web_fetch_video_high_quality_play_url — 取最高画质播放链接（Web）

**Full path:** `/api/v1/douyin/web/fetch_video_high_quality_play_url`
**Method:** GET · **Risk:** low

#### 用途
Web 版最高画质播放链接接口。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_video_high_quality_play_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | oneOf(aweme_id, share_url) | 纯数字字符串 | 作品 ID |
| share_url | string | oneOf(aweme_id, share_url) | 合法的抖音链接 | 分享链接 |
| region | string | no | ISO 国家代码 | 请求出口地区 |

> **二选一逻辑**：aweme_id 与 share_url 必须传且只传一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| original_video_url | `$.data.original_video_url` | 最高画质播放链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_video_high_quality_play_url` |

---

### app_v3_fetch_multi_video_high_quality_play_url — 批量取最高画质播放链接（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_multi_video_high_quality_play_url`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
批量获取视频最高画质播放链接，最多支持 50 个视频。

#### 何时使用 / 不使用
- ✅ 用户需要批量下载多个高清视频
- ❌ 单个视频 → 用 `app_v3_fetch_video_high_quality_play_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | string | yes | 逗号分隔，最多 50 个 | 作品 ID 列表，如 `"7512756548356492544,7448118827402972455"` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].video_id | `$.data.videos[].video_id` | 视频 ID | 直接交付用户 |
| videos[].original_video_url | `$.data.videos[].original_video_url` | 最高画质链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_multi_video_high_quality_play_url` |

---

### web_fetch_multi_video_high_quality_play_url — 批量取最高画质播放链接（Web）

**Full path:** `/api/v1/douyin/web/fetch_multi_video_high_quality_play_url`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
Web 版批量最高画质播放链接。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_multi_video_high_quality_play_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | string | yes | 逗号分隔，最多 50 个 | 作品 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].original_video_url | `$.data.videos[].original_video_url` | 最高画质链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_multi_video_high_quality_play_url` |
