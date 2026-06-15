# 微信搜一搜 / WeChat Search

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
微信"搜一搜"综合搜索，覆盖公众号、文章、视频号视频、直播、朋友圈、新闻、读书等垂类。**本文件是跨领域链式的核心入口**——搜索结果的 `jumpInfo.userName` 和 `exportId` 是进入 mp.md 和 channels.md 的桥梁。

> 所有端点均为 POST，参数放 request body（JSON），timeout 必须 >= 30 秒。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_search | 首选 | 用关键词综合搜索（公众号/文章/视频/直播等垂类） | POST | /api/v1/wechat_search/v2/fetch_search | high |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 (json_path -> 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜公众号 -> 看资料 | fetch_search (business_type=account) -> mp.md fetch_account_profile | `$.data.items[N].jumpInfo.userName` -> `username` | 第 1 步空：STOP；第 2 步失败：返回搜索结果 + "资料暂不可取" |
| 搜公众号 -> 看文章列表 | fetch_search (business_type=account) -> mp.md fetch_account_articles | `$.data.items[N].jumpInfo.userName` -> `username` | 跨文件链路 |
| 搜文章 -> 看详情 | fetch_search (business_type=article) -> mp.md fetch_article_detail | 搜索结果中的文章 URL | 跨文件链路 |
| 搜视频 -> 下载 | fetch_search (business_type=video) -> channels.md fetch_video_detail | `$.data.items[N].exportId` -> `export_id` | 跨文件链路 |
| 搜视频 -> 看作者 | fetch_search (business_type=video) -> channels.md fetch_user_profile | `$.data.items[N].jumpInfo.userName` -> `username` | 跨文件链路 |
| 搜直播 -> 看详情 | fetch_search (business_type=live_stream) -> channels.md fetch_live_detail | 搜索结果中的 live_id | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`fetch_search` (business_type=account) 输出 `$.data.items[N].jumpInfo.userName`（`gh_...`）-> `mp.md` 的 `fetch_account_profile` / `fetch_account_articles` / `fetch_account_services`
- **流出本文件**：`fetch_search` (business_type=article) 输出文章 URL -> `mp.md` 的 `fetch_article_detail` / `fetch_article_stats` / `fetch_article_comments`
- **流出本文件**：`fetch_search` (business_type=video/all) 输出 `$.data.items[N].exportId` -> `channels.md` 的 `fetch_video_detail` 的 `export_id`
- **流出本文件**：`fetch_search` (business_type=video/all) 输出 `$.data.items[N].jumpInfo.userName`（`v2_...@finder`）-> `channels.md` 的 finder username 系端点

## 错误处理契约 (Error Contract)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单--防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：改路径段 / 切换平台前缀 / 拼接新路径

### 参数错误（400 / 422）
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单--防参数与传参方式臆造)）
- **特别注意**：`business_type` 仅支持以下值，传其他值将直接报错（422）
- **第 2 步：自检通过后**才能修正参数重试 -> 最多重试 1 次

### 鉴权错误（401）/ 余额（402）/ 权限（403）
- 同 [`param-mappings.md`](./param-mappings.md) 通用规则

### 限流（429）/ 上游故障（5xx）/ 网络超时
- 同 [`param-mappings.md`](./param-mappings.md) 通用规则

### 业务错误（HTTP 200 且 `code != 0`）
- 读 `message_zh` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### fetch_search — 微信综合搜索（搜一搜）

**Full path:** `/api/v1/wechat_search/v2/fetch_search`
**Method:** POST · **Risk:** high

#### 用途
微信"搜一搜"综合搜索，垂类由 `business_type` 字符串键切换，传关键词即可。可搜公众号 / 文章 / 视频号视频 / 直播 / 朋友圈 / 新闻 / 读书 / 图片 / 百科 / 微信指数等垂类。**跨领域链式的核心入口**。

#### 何时使用 / 不使用
- 用户想搜微信公众号 / 文章 / 视频号视频 / 直播等
- 链式起点：搜索结果产出 gh_username / exportId / finder username 给下游
- 已知具体文章 URL -> 直接用 `mp.md` 的 `fetch_article_detail`
- 已知具体视频 object_id -> 直接用 `channels.md` 的 `fetch_video_detail`
- 已知 gh_username -> 直接用 `mp.md` 的账号系端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | length=1-100（去空白后） | 搜索关键词 |
| business_type | string | no | enum=`all`/`account`/`article`/`video`/`live_stream`/`moments`/`news`/`book`/`listen`/`image`/`encyclopedia`/`weixin_index` | 垂类字符串键，默认 `all`；**传其他值将直接报错（422）** |
| offset | integer | no | default=0, >=0 | 翻页游标；首页传 0；翻页传上一页响应的 `$.data.offset` |
| raw | boolean | no | default=true | True=原始搜索响应；False=精简解析（推荐） |

#### business_type 垂类说明

| 值 | 垂类 | 搜索结果典型字段 | 下游链路 |
|----|------|----------------|---------|
| `all` | 综合（默认） | 混合多种类型 | 按类型分流到 mp.md / channels.md |
| `account` | 公众号 | `jumpInfo.userName`（`gh_...`）/ `jumpInfo.nickName` / `jumpInfo.signature` | mp.md 账号系端点 |
| `article` | 文章 | 标题 / 摘要 / 文章 URL | mp.md 文章系端点 |
| `video` | 视频号视频 | `exportId` / `jumpInfo.extInfo.feedNonceId` / `jumpInfo.userName` | channels.md fetch_video_detail |
| `live_stream` | 直播 | 直播间信息 | channels.md fetch_live_detail |
| `moments` | 朋友圈 | 朋友圈内容 | 仅展示 |
| `news` | 新闻 | 新闻标题/来源 | 仅展示 |
| `book` | 读书 | 书籍信息 | 仅展示 |
| `listen` | 听书 | 有声书信息 | 仅展示 |
| `image` | 图片 | 图片搜索结果 | 仅展示 |
| `encyclopedia` | 百科 | 百科词条 | 仅展示 |
| `weixin_index` | 微信指数 | 指数趋势数据 | 仅展示 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| keyword | `$.data.keyword` | 关键词回填 | 仅展示 |
| business_type | `$.data.business_type` | 实际生效的垂类代码 | 仅展示 |
| total | `$.data.total` | 结果总数（部分垂类为 null） | 仅展示 |
| continue_flag | `$.data.continue_flag` | 是否还有下一页 | 翻页终止条件 |
| offset | `$.data.offset` | 下一页游标 | 同端点翻页 |
| count | `$.data.count` | 本页结果数 | 仅展示 |
| items[N].title | `$.data.items[N].title` | 标题（含高亮标记） | 仅展示 |
| items[N].desc | `$.data.items[N].desc` | 描述 | 仅展示 |
| items[N].jumpInfo.userName | `$.data.items[N].jumpInfo.userName` | 账号 username（`gh_...` 或 `v2_...@finder`） | mp.md / channels.md 对应端点 |
| items[N].jumpInfo.nickName | `$.data.items[N].jumpInfo.nickName` | 账号昵称 | 仅展示 |
| items[N].exportId | `$.data.items[N].exportId` | 视频 exportId（仅 video 垂类） | channels.md fetch_video_detail |
| items[N].jumpInfo.extInfo.feedNonceId | `$.data.items[N].jumpInfo.extInfo.feedNonceId` | 视频 feedNonceId（仅 video 垂类） | channels.md fetch_video_detail 的 object_nonce_id |

#### 典型链路说明

**搜视频 -> 下载视频**：
1. `fetch_search` (business_type=video) -> 视频结果项含 `exportId`（+ `jumpInfo.extInfo.feedNonceId`）
2. 取 `exportId` -> 调 `channels.md` 的 `fetch_video_detail`（传 `export_id`）
3. `fetch_video_detail` 返回 `media`（`url` / `url_token` / `decode_key`）和明文 `username`
4. 用 `full_url` 下载 + `decode_key` 解密

**搜公众号 -> 看文章列表**：
1. `fetch_search` (business_type=account) -> 公众号结果项含 `jumpInfo.userName`（`gh_...`）
2. 取 `jumpInfo.userName` -> 调 `mp.md` 的 `fetch_account_articles`
3. 文章列表中的 URL 可继续喂给 `fetch_article_detail`

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 422 | business_type 不合法 | 修正为合法枚举值后重试 | ≤1 次 | — |
| 空结果 | 关键词无命中 | 告知用户"未搜到结果"，建议换关键词或换垂类 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（搜索是顶层入口） |
