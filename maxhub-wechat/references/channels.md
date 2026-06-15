# 微信视频号 / WeChat Channels

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
频道信息、视频详情、视频评论、用户作品、用户资料、合集、直播、分享链接、号内搜索 —— 围绕"视频号"的全部读取入口。**finder username 与 object_id 多在本文件首步产出**，是其他链式调用的常见起点。

> 所有端点均为 POST，参数放 request body（JSON），timeout 必须 >= 30 秒。
> 视频号视频文件为加密 MP4，需用同一次响应的 `decode_key` 解密。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_channel_info | 首选 | 用 finder username 取视频号账号信息（认证/IP归属） | POST | /api/v1/wechat_channels/v2/fetch_channel_info | high |
| fetch_channel_id_to_username | 首选 | 用 sph 短号转 finder username（**sph->v2 入口**） | POST | /api/v1/wechat_channels/v2/fetch_channel_id_to_username | high |
| fetch_user_videos | 首选 | 用 finder username 取视频号用户作品列表（含翻页+媒体下载） | POST | /api/v1/wechat_channels/v2/fetch_user_videos | high |
| fetch_video_detail | 首选 | 用 object_id/export_id/share_url 取视频详情（含媒体下载+解密密钥） | POST | /api/v1/wechat_channels/v2/fetch_video_detail | high |
| fetch_video_comments | 首选 | 用 object_id 取视频评论（含翻页） | POST | /api/v1/wechat_channels/v2/fetch_video_comments | high |
| fetch_video_share_url | 条件 | 用 object_id 生成分享短链 | POST | /api/v1/wechat_channels/v2/fetch_video_share_url | high |
| fetch_user_profile | 首选 | 用 finder username 取视频号主页资料+统计 | POST | /api/v1/wechat_channels/v2/fetch_user_profile | high |
| fetch_user_collections | 条件 | 用 finder username 取视频号合集列表 | POST | /api/v1/wechat_channels/v2/fetch_user_collections | high |
| fetch_collection_videos | 条件 | 用 topic_id 取合集内视频（含翻页+媒体下载） | POST | /api/v1/wechat_channels/v2/fetch_collection_videos | high |
| fetch_live_history | 条件 | 用 finder username 取直播回放列表（含翻页） | POST | /api/v1/wechat_channels/v2/fetch_live_history | high |
| fetch_live_detail | 条件 | 用 live_id 取直播间详情 | POST | /api/v1/wechat_channels/v2/fetch_live_detail | high |
| fetch_search_channel_videos | 条件 | 用 finder username+keyword 号内搜索视频 | POST | /api/v1/wechat_channels/v2/fetch_search_channel_videos | high |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 (json_path -> 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| sph 短号 -> 账号信息 | fetch_channel_id_to_username -> fetch_channel_info | `$.data.username` -> `username` | 第 1 步失败：STOP |
| sph 短号 -> 用户作品 | fetch_channel_id_to_username -> fetch_user_videos | `$.data.username` -> `username` | 第 1 步失败：STOP |
| 看视频详情 + 评论 | fetch_video_detail -> fetch_video_comments | `$.data.id` -> `object_id` | 第 2 步失败：返回视频详情 + "评论暂不可取" |
| 看视频详情 + 作者主页 | fetch_video_detail -> fetch_user_profile | `$.data.username` -> `username` | 跨维度链路 |
| 看视频详情 + 作者更多作品 | fetch_video_detail -> fetch_user_videos | `$.data.username` -> `username` | 跨维度链路 |
| 看视频 + 分享链接 | fetch_video_detail -> fetch_video_share_url | `$.data.id` -> `object_id` | 第 2 步失败：返回视频详情 + "分享链接暂不可取" |
| 看评论 + 二级回复 | fetch_video_comments -> fetch_video_comments（传 comment_id） | `$.data.comments[N].comment_id` -> `comment_id` | 同端点递归 |
| 看用户主页 + 合集 | fetch_user_profile -> fetch_user_collections | `username` 复用 | 第 2 步空：返回资料 + "暂无合集" |
| 看合集 + 合集内视频 | fetch_user_collections -> fetch_collection_videos | `$.data.collections[N].topic_id` -> `topic_id` | 第 2 步空：返回合集列表 + "合集视频暂不可取" |
| 搜视频 -> 下载 | fetch_search (search.md) -> fetch_video_detail | `$.data.items[N].exportId` -> `export_id` | 跨文件链路 |
| 号内搜 -> 视频详情 | fetch_search_channel_videos -> fetch_video_detail | 命中项需走 fetch_video_detail 取 media | 跨端点链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`search.md` 的 `fetch_search` (business_type=video/all) 输出 `$.data.items[N].exportId` -> 本文件 `fetch_video_detail` 的 `export_id`
- **流入本文件**：`search.md` 的 `fetch_search` (business_type=video/all) 输出 `$.data.items[N].jumpInfo.userName` -> 本文件 finder username 系端点
- **流出本文件**：`fetch_video_detail` / `fetch_user_videos` 输出 `$.data.username` -> 本文件 finder username 系端点
- **流出本文件**：`fetch_video_detail` / `fetch_user_videos` / `fetch_collection_videos` 输出 `$.data.videos[N].id` -> 本文件 `fetch_video_detail` / `fetch_video_comments` / `fetch_video_share_url`

## 视频下载与解密说明

> 视频号视频文件为加密 MP4，以下规则适用于所有返回 `media` 字段的端点：

1. **防盗链**：直接访问 `url` 可能打不开，需用 `full_url`（已拼 Token）下载
2. **加密文件**：下载的 MP4 若无法播放即为加密，需用 `decode_key` 解密
3. **密钥时效**：微信每次请求返回新的 `decode_key`，必须确保 `decode_key` 与下载文件来自**同一次 API 响应**
4. **推荐 raw=false**：`raw=false` 时 `media` 为单个对象，路径更干净
5. **在线解密工具**：https://evil0ctal.github.io/WeChat-Channels-Video-File-Decryption/
6. **自部署解密 API**：https://github.com/Evil0ctal/WeChat-Channels-Video-File-Decryption

## 错误处理契约 (Error Contract)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单--防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：改路径段 / 切换平台前缀 / 拼接新路径

### 参数错误（400 / 422）
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单--防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 -> 最多重试 1 次

### 鉴权错误（401）/ 余额（402）/ 权限（403）
- 同 [`param-mappings.md`](./param-mappings.md) 通用规则

### 限流（429）/ 上游故障（5xx）/ 网络超时
- 同 [`param-mappings.md`](./param-mappings.md) 通用规则

### 业务错误（HTTP 200 且 `code != 0`）
- 读 `message_zh` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### fetch_channel_info — 获取视频号账号信息

**Full path:** `/api/v1/wechat_channels/v2/fetch_channel_info`
**Method:** POST · **Risk:** high

#### 用途
获取视频号账号的"更多信息"：基础信息（IP 归属地 / 视频号 ID）+ 认证信息（服务单位 / 主体类型 / 认证时间等）。与 `fetch_user_profile`（昵称/粉丝/统计）互补。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | `v2_...@finder` 格式 | 视频号 finder username |
| raw | boolean | no | default=true | True=原始响应；False=精简解析（推荐） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| finder_username | `$.data.finder_username` | finder username（回显） | 复用 |
| channel_id | `$.data.channel_id` | 视频号 ID（sph 短号） | fetch_channel_id_to_username（反向） |
| info | `$.data.info` | 扁平化"标题->内容"字典（raw=false） | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 账号不存在 | STOP | 0 | 降级：fetch_user_profile |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_user_profile（偏统计，缺认证信息） |

---

### fetch_channel_id_to_username — 视频号 ID 转 finder username

**Full path:** `/api/v1/wechat_channels/v2/fetch_channel_id_to_username`
**Method:** POST · **Risk:** high

#### 用途
把对外可见的视频号 ID（`sph...` 短号）解析成 finder username（`v2_...@finder`）。**sph 短号 -> finder username 的链式入口**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | startsWith=`sph` | 视频号 ID（sph 短号） |
| raw | boolean | no | default=true | True=原始响应；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| username | `$.data.username` | 解析出的 finder username | fetch_channel_info / fetch_user_videos / fetch_user_profile / fetch_user_collections / fetch_live_history / fetch_search_channel_videos |
| nickname | `$.data.nickname` | 账号昵称 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sph 短号不存在 | STOP | 0 | 无替代 |
| username=null | 未命中 | 告知用户该短号无法解析 | 0 | — |

---

### fetch_user_videos — 获取视频号用户作品列表

**Full path:** `/api/v1/wechat_channels/v2/fetch_user_videos`
**Method:** POST · **Risk:** high

#### 用途
获取视频号账号主页的作品列表。每个视频带媒体地址（含下载链接+解密密钥），支持翻页。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | `v2_...@finder` 格式 | 视频号 finder username |
| last_buffer | string | no | base64 游标 | 翻页游标，首页留空；翻页传上一页的 `$.data.last_buffer` |
| raw | boolean | no | default=true | True=原始响应；False=精简解析（推荐做媒体下载） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[N].id | `$.data.videos[N].id` | 作品 objectId | fetch_video_detail / fetch_video_comments / fetch_video_share_url |
| videos[N].username | `$.data.videos[N].username` | 作者 finder username | finder username 系端点 |
| videos[N].nickname | `$.data.videos[N].nickname` | 作者昵称 | 仅展示 |
| videos[N].title | `$.data.videos[N].title` | 视频标题 | 仅展示 |
| videos[N].media.full_url | `$.data.videos[N].media.full_url` | 完整 CDN 下载链接 | 直接下载 |
| videos[N].media.decode_key | `$.data.videos[N].media.decode_key` | 视频解密密钥 | 解密用 |
| last_buffer | `$.data.last_buffer` | 翻页游标 | 同端点翻页 |
| up_continue | `$.data.up_continue` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 账号不存在 | STOP | 0 | — |
| 空数据 | 账号暂无作品 | 返回"暂无作品" | 0 | — |

---

### fetch_video_detail — 获取视频号作品详情

**Full path:** `/api/v1/wechat_channels/v2/fetch_video_detail`
**Method:** POST · **Risk:** high

#### 用途
获取视频号作品详情，返回完整详情（含媒体下载地址+解密密钥）。支持三种入参，**优先级 object_id > export_id > share_url**。**链式调用的常见起点**——object_id 和 finder username 从此处产出。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| object_id | string | oneOf(object_id, export_id, share_url) | 纯数字 | 作品 objectId，最优先 |
| export_id | string | oneOf(object_id, export_id, share_url) | startsWith=`export/` | 搜索结果的 exportId，其次（会过期） |
| share_url | string | oneOf(object_id, export_id, share_url) | startsWith=`https://weixin.qq.com/sph/` | 分享短链，最后 |
| object_nonce_id | string | no | 纯数字 | 搜索结果的 feedNonceId，搭配上面提升命中率 |
| raw | boolean | no | default=true | True=原始响应；False=精简解析（推荐做媒体下载） |

> **三选一逻辑**：object_id / export_id / share_url 至少传一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| id | `$.data.id` | 作品 objectId | fetch_video_comments / fetch_video_share_url |
| username | `$.data.username` | 作者 finder username | finder username 系端点 |
| nickname | `$.data.nickname` | 作者昵称 | 仅展示 |
| title | `$.data.title` | 视频标题 | 仅展示 |
| media.full_url | `$.data.media.full_url` | 完整 CDN 下载链接 | 直接下载 |
| media.decode_key | `$.data.media.decode_key` | 视频解密密钥 | 解密用 |
| read_count | `$.data.read_count` | 播放量 | 仅展示 |
| like_count | `$.data.like_count` | 点赞数 | 仅展示 |
| comment_count | `$.data.comment_count` | 评论数 | 用于决定是否调用 fetch_video_comments |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 三种 ID 都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 视频不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_user_videos（已知 username）取列表 |

---

### fetch_video_comments — 获取视频号作品评论

**Full path:** `/api/v1/wechat_channels/v2/fetch_video_comments`
**Method:** POST · **Risk:** high

#### 用途
获取视频号作品的一级评论（含 IP 属地/点赞数）；传 `comment_id` 则返回该评论下的二级回复。支持翻页。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| object_id | string | yes | 纯数字 | 作品 objectId |
| last_buffer | string | no | base64 游标 | 翻页游标，首页留空；翻页传上一页的 `$.data.last_buffer` |
| comment_id | string | no | 纯数字 | 展开某条评论的二级回复时传该评论的 comment_id；首页留空 |
| raw | boolean | no | default=true | True=原始响应；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[N].comment_id | `$.data.comments[N].comment_id` | 评论 ID | 同端点（展开二级回复） |
| comments[N].nickname | `$.data.comments[N].nickname` | 评论人昵称 | 仅展示 |
| comments[N].content | `$.data.comments[N].content` | 评论内容 | 仅展示 |
| comments[N].like_count | `$.data.comments[N].like_count` | 点赞数 | 仅展示 |
| comments[N].ip_region | `$.data.comments[N].ip_region` | IP 属地 | 仅展示 |
| last_buffer | `$.data.last_buffer` | 翻页游标 | 同端点翻页 |
| down_continue | `$.data.down_continue` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |
| 空数据 | 视频暂无评论 | 返回"暂无评论" | 0 | — |

---

### fetch_video_share_url — 生成视频号作品分享链接

**Full path:** `/api/v1/wechat_channels/v2/fetch_video_share_url`
**Method:** POST · **Risk:** high

#### 用途
给定作品 object_id，返回可对外分享的 `weixin.qq.com/sph/...` 短链。与 `fetch_video_detail` 的 `share_url` 入参互为反向。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| object_id | string | yes | 纯数字 | 作品 objectId |
| raw | boolean | no | default=true | True=原始响应；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| share_url | `$.data.share_url` | 分享短链 | fetch_video_detail 的 share_url 参数（反向验证） |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### fetch_user_profile — 获取视频号账号主页资料+统计

**Full path:** `/api/v1/wechat_channels/v2/fetch_user_profile`
**Method:** POST · **Risk:** high

#### 用途
获取创作者的主页资料与互动统计。与 `fetch_channel_info`（认证主体/许可证）互补：本接口给昵称/签名/头像、粉丝/作品/获赞/收藏/转发数、直播时长、IP 属地、合集数、关联公众号等。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | `v2_...@finder` 格式 | 视频号 finder username |
| raw | boolean | no | default=true | True=原始响应；False=精简解析（推荐） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| username | `$.data.username` | finder username（回显） | 复用 |
| nickname | `$.data.nickname` | 昵称 | 仅展示 |
| fans_count | `$.data.fans_count` | 粉丝数（部分账号返回 0） | 仅展示 |
| feeds_count | `$.data.feeds_count` | 作品数 | 仅展示 |
| like_count | `$.data.like_count` | 获赞数 | 仅展示 |
| collection_count | `$.data.collection_count` | 合集数 | 用于决定是否调用 fetch_user_collections |
| linked_accounts[] | `$.data.linked_accounts[]` | 关联公众号 | mp.md 的 fetch_account_profile |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 账号不存在 | STOP | 0 | 降级：fetch_channel_info |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_channel_info（偏认证，缺统计） |

---

### fetch_user_collections — 获取视频号合集列表

**Full path:** `/api/v1/wechat_channels/v2/fetch_user_collections`
**Method:** POST · **Risk:** high

#### 用途
获取创作者主页的"合集"列表。每个合集的 `topic_id` 可传 `fetch_collection_videos` 取该合集内的视频。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | `v2_...@finder` 格式 | 视频号 finder username |
| raw | boolean | no | default=true | True=原始响应；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| collections[N].topic_id | `$.data.collections[N].topic_id` | 合集 ID | fetch_collection_videos |
| collections[N].name | `$.data.collections[N].name` | 合集名 | 仅展示 |
| collections[N].feed_count | `$.data.collections[N].feed_count` | 合集内视频数 | 仅展示 |
| count | `$.data.count` | 合集总数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空数据 | 账号暂无合集 | 返回"暂无合集" | 0 | — |

---

### fetch_collection_videos — 获取视频号合集内视频

**Full path:** `/api/v1/wechat_channels/v2/fetch_collection_videos`
**Method:** POST · **Risk:** high

#### 用途
给定合集 `topic_id`，返回该合集内的视频列表。每个视频带媒体地址，支持翻页。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| topic_id | string | yes | 纯数字 | 合集 ID（来自 fetch_user_collections） |
| topic | string | no | — | 合集名，提高命中 |
| username | string | no | `v2_...@finder` 格式 | 创作者 finder username，提高命中 |
| last_buffer | string | no | base64 游标 | 翻页游标，首页留空 |
| topic_type | integer | no | default=16 | 合集类型 |
| raw | boolean | no | default=true | True=原始响应；False=精简解析（推荐做媒体下载） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[N].id | `$.data.videos[N].id` | 作品 objectId | fetch_video_detail / fetch_video_comments |
| videos[N].media.full_url | `$.data.videos[N].media.full_url` | 完整 CDN 下载链接 | 直接下载 |
| videos[N].media.decode_key | `$.data.videos[N].media.decode_key` | 视频解密密钥 | 解密用 |
| last_buffer | `$.data.last_buffer` | 翻页游标 | 同端点翻页 |
| down_continue | `$.data.down_continue` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 合集不存在 | STOP | 0 | — |
| 空数据 | 合集暂无视频 | 返回"暂无视频" | 0 | — |

---

### fetch_live_history — 获取视频号直播回放列表

**Full path:** `/api/v1/wechat_channels/v2/fetch_live_history`
**Method:** POST · **Risk:** high

#### 用途
获取创作者的直播回放列表。回放本身就是视频对象，每条带媒体地址，支持翻页。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | `v2_...@finder` 格式 | 视频号 finder username |
| last_buffer | string | no | base64 游标 | 翻页游标，首页留空 |
| flag | integer | no | default=12 | 拉取标志 |
| raw | boolean | no | default=true | True=原始响应；False=精简解析（推荐做媒体下载） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| lives[N].id | `$.data.lives[N].id` | 回放作品 objectId | fetch_video_detail / fetch_video_comments |
| lives[N].media.full_url | `$.data.lives[N].media.full_url` | 完整 CDN 下载链接 | 直接下载 |
| lives[N].media.decode_key | `$.data.lives[N].media.decode_key` | 视频解密密钥 | 解密用 |
| last_buffer | `$.data.last_buffer` | 翻页游标 | 同端点翻页 |
| continue_flag | `$.data.continue_flag` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空数据 | 账号暂无直播回放 | 返回"暂无直播回放" | 0 | — |

---

### fetch_live_detail — 获取视频号直播间详情

**Full path:** `/api/v1/wechat_channels/v2/fetch_live_detail`
**Method:** POST · **Risk:** high

#### 用途
传直播 `live_id` 返回直播间详情：主播信息、直播状态、在线人数、回放信息等。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| live_id | string | yes | 纯数字 | 直播 ID |
| scene | integer | no | default=5 | 进入场景 |
| finder_username | string | no | `v2_...@finder` 格式 | 主播 finder username，提高命中 |
| raw | boolean | no | default=true | True=原始响应；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| live_id | `$.data.live_id` | 直播 ID（回显） | 复用 |
| anchor_username | `$.data.anchor_username` | 主播 finder username | finder username 系端点 |
| live_status | `$.data.live_status` | 直播状态（1=直播中/2=已结束） | 仅展示 |
| online_count | `$.data.online_count` | 当前在线人数 | 仅展示 |
| replay_url | `$.data.replay_url` | 回放地址 | 直接播放 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 直播间不存在 | STOP | 0 | 无替代 |

---

### fetch_search_channel_videos — 视频号号内搜索

**Full path:** `/api/v1/wechat_channels/v2/fetch_search_channel_videos`
**Method:** POST · **Risk:** high

#### 用途
在指定创作者的视频号内，按关键词搜索其发布的视频（仅在该号内部检索）。本接口仅做首页检索，命中视频需走 `fetch_video_detail` 取媒体下载地址。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | `v2_...@finder` 格式 | 创作者 finder username |
| keyword | string | yes | length=1-100 | 在该号内搜索的关键词 |
| raw | boolean | no | default=true | True=原始搜索响应；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[N].title | `$.data.items[N].title` | 视频标题 | 仅展示 |
| items[N].doc_id | `$.data.items[N].doc_id` | 文档 id | 需走 fetch_video_detail 取详情 |
| count | `$.data.count` | 本页命中数 | 仅展示 |
| continue_flag | `$.data.continue_flag` | 是否还有更多 | 翻页参考 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空数据 | 号内无匹配视频 | 返回"未搜到相关视频" | 0 | 降级：fetch_search (business_type=video) 全局搜 |
