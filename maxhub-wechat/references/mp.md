# 微信公众号 / WeChat Official Accounts (MP)

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
文章详情、互动数据、评论、回复、关联文章、广告、账号资料、文章列表、服务菜单 —— 围绕"公众号"的全部读取入口。**文章 URL 与 gh_username 多在本文件首步产出**，是其他链式调用的常见起点。

> 所有端点均为 POST，参数放 request body（JSON），timeout 必须 >= 30 秒。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_article_detail | 首选 | 用文章 URL 取文章详情（正文/标题/作者/封面/发布时间） | POST | /api/v1/wechat_mp/v2/fetch_article_detail | high |
| fetch_article_stats | 首选 | 用文章 URL 取互动数据（阅读/点赞/在看/分享/收藏/评论数） | POST | /api/v1/wechat_mp/v2/fetch_article_stats | high |
| fetch_article_comments | 首选 | 用文章 URL 取一级评论（含翻页） | POST | /api/v1/wechat_mp/v2/fetch_article_comments | high |
| fetch_comment_replies | 条件 | 用 content_id 取二级回复（仅当用户明确要"回复"） | POST | /api/v1/wechat_mp/v2/fetch_comment_replies | high |
| fetch_related_articles | 条件 | 用文章 URL 取关联文章 | POST | /api/v1/wechat_mp/v2/fetch_related_articles | high |
| fetch_article_ad | 条件 | 用文章 URL 取内嵌广告信息 | POST | /api/v1/wechat_mp/v2/fetch_article_ad | high |
| fetch_account_profile | 首选 | 用 gh_username 取公众号资料页 | POST | /api/v1/wechat_mp/v2/fetch_account_profile | high |
| fetch_account_articles | 首选 | 用 gh_username 取公众号历史文章列表（含翻页） | POST | /api/v1/wechat_mp/v2/fetch_account_articles | high |
| fetch_account_services | 条件 | 用 gh_username 取公众号自定义菜单/服务入口 | POST | /api/v1/wechat_mp/v2/fetch_account_services | high |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 (json_path -> 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看文章详情 + 互动数据 | fetch_article_detail -> fetch_article_stats | URL 复用 | 第 2 步失败：返回文章详情 + "互动数据暂不可取" |
| 看文章 + 评论 | fetch_article_detail -> fetch_article_comments | URL 复用 | 第 2 步失败：返回文章详情 + "评论暂不可取" |
| 看评论 + 回复 | fetch_article_comments -> fetch_comment_replies | `$.data.comments[N].content_id` -> `content_id` | 第 2 步失败：返回已有评论 + "回复缺失" |
| 看文章 + 关联文章 | fetch_article_detail -> fetch_related_articles | URL 复用 | 第 2 步空：返回文章详情 + "暂无关联文章" |
| 看文章 + 作者主页 | fetch_article_detail -> fetch_account_profile | `$.data.content.user_name` -> `username` | 跨文件链路 |
| 搜公众号 + 看文章列表 | fetch_search (search.md) -> fetch_account_articles | `$.data.items[N].jumpInfo.userName` -> `username` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`search.md` 的 `fetch_search` (business_type=account) 输出 `$.data.items[N].jumpInfo.userName` -> 本文件 `fetch_account_profile` / `fetch_account_articles` / `fetch_account_services` 的 `username`
- **流出本文件**：`fetch_article_detail` 输出 `$.data.content.user_name` -> 本文件 `fetch_account_profile` / `fetch_account_articles` / `fetch_account_services` 的 `username`
- **流出本文件**：`fetch_article_comments` 输出 `$.data.comments[N].content_id` -> 本文件 `fetch_comment_replies`

## 错误处理契约 (Error Contract)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单--防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：改路径段 / 切换平台前缀 / 拼接新路径

### 参数错误（400 / 422）
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单--防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 -> 最多重试 1 次 -> 仍失败 STOP

### 鉴权错误（401）
- **STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **STOP**，告知用户充值（https://www.aconfig.cn/billing）

### 权限错误（403）
- **STOP**，按子场景告知用户去控制台处理

### 限流（429）
- 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次

### 上游故障（500/502/503/504）
- 等 3 秒重试 1 次 -> 仍失败走端点级"降级/替换"

### 网络超时 / DNS
- **STOP**，向用户报告

### 业务错误（HTTP 200 且 `code != 0`）
- 读 `message_zh` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### fetch_article_detail — 获取公众号文章详情

**Full path:** `/api/v1/wechat_mp/v2/fetch_article_detail`
**Method:** POST · **Risk:** high

#### 用途
传文章 URL，返回文章正文 / 标题 / 作者 / 封面 / 发布时间 / 合集信息等。**链式调用的常见起点**——文章 URL 和 gh_username 从此处产出。

#### 何时使用 / 不使用
- 用户提供了公众号文章链接
- 链式起点：取 gh_username 给账号系端点
- 想看互动数据 -> 直接用 `fetch_article_stats`
- 想看评论 -> 直接用 `fetch_article_comments`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://mp.weixin.qq.com/s/` 或含 `__biz` 的长链 | 公众号文章链接 |
| raw | boolean | no | default=true | True=原始响应；False=精简投影 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| content.user_name | `$.data.content.user_name` | 公众号 gh_username | fetch_account_profile / fetch_account_articles / fetch_account_services |
| content.comment_id | `$.data.content.comment_id` | 评论内部 id | fetch_article_comments（间接，通过 URL 更常用） |
| content.title | `$.data.content.title` | 文章标题 | 仅展示 |
| content.nick_name | `$.data.content.nick_name` | 公众号名称 | 仅展示 |
| content.create_time | `$.data.content.create_time` | 发布时间 | 仅展示 |
| content.content_text | `$.data.content.content_text` | 正文纯文字 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | URL 格式错 | 修正 URL 后重试 | ≤1 次 | — |
| 404 | 文章不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_article_stats — 获取公众号文章互动数据

**Full path:** `/api/v1/wechat_mp/v2/fetch_article_stats`
**Method:** POST · **Risk:** high

#### 用途
传文章 URL，返回文章的互动指标（阅读量 / 点赞 / 在看 / 分享 / 收藏 / 评论数）。

#### 何时使用 / 不使用
- 用户想看文章的阅读/点赞等互动数据
- 想看文章正文 -> 用 `fetch_article_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://mp.weixin.qq.com/s/` | 公众号文章链接 |
| raw | boolean | no | default=true | True=完整统计（含显隐标志）；False=仅精简计数 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| read_num | `$.data.read_num` | 阅读量 | 仅展示 |
| like_count | `$.data.like_count` | 点赞数 | 仅展示 |
| old_like_count | `$.data.old_like_count` | 在看数 | 仅展示 |
| share_count | `$.data.share_count` | 分享数 | 仅展示 |
| collect_count | `$.data.collect_count` | 收藏数 | 仅展示 |
| comment_count | `$.data.comment_count` | 评论数 | 用于决定是否调用 fetch_article_comments |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 文章不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_article_comments — 获取公众号文章评论

**Full path:** `/api/v1/wechat_mp/v2/fetch_article_comments`
**Method:** POST · **Risk:** high

#### 用途
获取公众号文章的一级评论（含翻页）。逐条评论的二级回复请用 `fetch_comment_replies`。

#### 何时使用 / 不使用
- 用户想看文章评论
- 链式中间步：为 fetch_comment_replies 提供 content_id
- 想看二级回复 -> 先取 content_id 再调 fetch_comment_replies

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://mp.weixin.qq.com/s/` | 公众号文章链接 |
| buffer | string | no | default="" | 翻页游标，首页留空；翻页传上一页响应的 `$.data.buffer` |
| raw | boolean | no | default=true | True=完整原始评论；False=精简评论 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[N].content_id | `$.data.comments[N].content_id` | 评论 id | fetch_comment_replies |
| comments[N].nick_name | `$.data.comments[N].nick_name` | 评论者昵称 | 仅展示 |
| comments[N].content | `$.data.comments[N].content` | 评论内容 | 仅展示 |
| comments[N].like_num | `$.data.comments[N].like_num` | 点赞数 | 仅展示 |
| comments[N].ip_wording | `$.data.comments[N].ip_wording` | IP 归属地 | 仅展示 |
| buffer | `$.data.buffer` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 文章不存在 | STOP | 0 | 无替代 |
| 空数据 | 文章未开评论/无评论 | 返回"暂无评论" | 0 | — |

---

### fetch_comment_replies — 获取公众号评论的二级回复

**Full path:** `/api/v1/wechat_mp/v2/fetch_comment_replies`
**Method:** POST · **Risk:** high

#### 用途
返回某条一级评论下的二级回复。链路：先调 `fetch_article_comments` 取到 content_id，再喂给本接口。

#### 何时使用 / 不使用
- 已通过 fetch_article_comments 取得 content_id
- 不要传文章 URL 当 content_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://mp.weixin.qq.com/s/` | 公众号文章链接 |
| content_id | string | no | 纯数字 | 一级评论的 content_id；不传则自动取第一条有回复的评论 |
| offset | integer | no | default=0, >=0 | 回复翻页偏移；首页 0，has_more=true 时传 next_offset |
| all_pages | boolean | no | default=false | True 时一次取全部回复（忽略 offset） |
| raw | boolean | no | default=true | True=完整原始回复；False=精简回复 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[N].reply_id | `$.data.replies[N].reply_id` | 回复 id | 仅展示 |
| replies[N].nick_name | `$.data.replies[N].nick_name` | 回复者昵称 | 仅展示 |
| replies[N].content | `$.data.replies[N].content` | 回复内容 | 仅展示 |
| next_offset | `$.data.next_offset` | 下一页偏移 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 评论不存在 | STOP | 0 | 无替代 |
| 空数据 | 该评论无回复 | 返回"暂无回复" | 0 | — |

---

### fetch_related_articles — 获取公众号关联文章

**Full path:** `/api/v1/wechat_mp/v2/fetch_related_articles`
**Method:** POST · **Risk:** high

#### 用途
传文章 URL，返回文章底部"关联/相关文章"。未开启该功能的文章返回空列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 公众号文章链接（长/短链均可） | 文章链接 |
| raw | boolean | no | default=true | True=完整原始响应；False=精简投影 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| articles[] | `$.data.articles[]` | 关联文章列表 | 关联文章 URL 可喂给 fetch_article_detail |
| count | `$.data.count` | 关联文章条数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空数据 | 文章未开关联 | 返回"暂无关联文章" | 0 | — |

---

### fetch_article_ad — 获取公众号文章广告

**Full path:** `/api/v1/wechat_mp/v2/fetch_article_ad`
**Method:** POST · **Risk:** high

#### 用途
传文章 URL，返回文章内嵌的广告位信息。未投放广告的文章返回空。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 公众号文章链接 | 文章链接 |
| raw | boolean | no | default=true | True=完整原始响应；False=拍平广告列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| ads[] | `$.data.ads[]` | 广告项列表 | 仅展示 |
| count | `$.data.count` | 广告条数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空数据 | 文章无广告 | 返回"暂无广告" | 0 | — |

---

### fetch_account_profile — 获取公众号资料页

**Full path:** `/api/v1/wechat_mp/v2/fetch_account_profile`
**Method:** POST · **Risk:** high

#### 用途
传 gh_username，返回公众号资料页：名称 / 头像 / 简介 / 认证主体类型等。**账号系链式调用的常见验证步**。

#### 何时使用 / 不使用
- 已知 gh_username，想看公众号主页信息
- 链式中验证 gh_username 是否有效
- 只有公众号名 -> 先用 search.md 的 fetch_search 搜索

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | startsWith=`gh_` | 公众号 gh_username |
| raw | boolean | no | default=true | True=原始；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_name | `$.data.user_name` | 公众号 gh_username（回显） | 复用 |
| nick_name | `$.data.nick_name` | 公众号昵称 | 仅展示 |
| signature | `$.data.signature` | 签名/简介 | 仅展示 |
| head_url | `$.data.head_url` | 头像 | 仅展示 |
| service_type | `$.data.service_type` | 服务类型（订阅号/服务号） | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 公众号不存在 | STOP | 0 | 降级：fetch_search 取候选 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_account_articles — 获取公众号文章列表

**Full path:** `/api/v1/wechat_mp/v2/fetch_account_articles`
**Method:** POST · **Risk:** high

#### 用途
传 gh_username，返回公众号历史发文列表。支持手动翻页和自动翻页两种模式。

#### 何时使用 / 不使用
- 已知 gh_username，想看公众号的文章列表
- 链式产出文章 URL 给 fetch_article_detail
- 想看公众号资料本身 -> fetch_account_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | startsWith=`gh_` | 公众号 gh_username |
| page_size | integer | no | default=20, range=10-20 | 每页文章数 |
| max_pages | integer | no | default=1, range=1-10 | 1=单页手动翻页；>1=自动续拉合并去重 |
| offset | string | no | base64 游标 | 翻页游标，首页留空；手动翻页传上一页的 next_offset |
| raw | boolean | no | default=true | True=原始；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| articles[N].url | `$.data.articles[N].url` | 文章链接 | fetch_article_detail / fetch_article_stats / fetch_article_comments |
| articles[N].title | `$.data.articles[N].title` | 文章标题 | 仅展示 |
| articles[N].digest | `$.data.articles[N].digest` | 文章摘要 | 仅展示 |
| articles[N].create_time | `$.data.articles[N].create_time` | 发布时间戳 | 仅展示 |
| next_offset | `$.data.next_offset` | 下一页游标 | 同端点翻页 |
| is_end | `$.data.is_end` | 是否末页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 公众号不存在 | STOP | 0 | — |
| 空数据 | 公众号暂无文章 | 返回"暂无文章" | 0 | — |

---

### fetch_account_services — 获取公众号服务/自定义菜单

**Full path:** `/api/v1/wechat_mp/v2/fetch_account_services`
**Method:** POST · **Risk:** high

#### 用途
传 gh_username，返回公众号底部的自定义菜单 / 服务入口。未配置自定义菜单的账号返回空菜单。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | startsWith=`gh_` | 公众号 gh_username |
| raw | boolean | no | default=true | True=原始；False=精简解析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| menu[] | `$.data.menu[]` | 菜单项列表 | 仅展示 |
| biz_username | `$.data.biz_username` | 公众号 username（回显） | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空数据 | 公众号未配置菜单 | 返回"暂无自定义菜单" | 0 | — |
