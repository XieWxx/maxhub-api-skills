# Toutiao Posts / 今日头条 内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
文章信息、视频信息、评论列表 —— 含 App 端和 Web 端双端。**group_id / aweme_id 是本文件的核心输入**。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_get_article_info | ⭐⭐⭐ 首选 | 用 group_id 取文章信息（App 端） | GET | /api/v1/toutiao/app/get_article_info | low |
| app_get_video_info | ⭐⭐⭐ 首选 | 用 group_id 取视频信息（App 端） | GET | /api/v1/toutiao/app/get_video_info | low |
| app_get_comments | ⭐⭐ 条件 | 用 group_id 取评论列表（App 端） | GET | /api/v1/toutiao/app/get_comments | low |
| web_get_article_info | ⭐⭐ 降级 | 用 aweme_id 取文章信息（Web 端） | GET | /api/v1/toutiao/web/get_article_info | low |
| web_get_video_info | ⭐⭐ 降级 | 用 aweme_id 取视频信息（Web 端） | GET | /api/v1/toutiao/web/get_video_info | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 | 容错 |
|---------|------|-------|------|
| 看文章 + 评论 | app_get_article_info → app_get_comments | group_id 复用 | 第 2 步失败：返回文章信息 + "评论暂不可取" |
| 看视频 + 评论 | app_get_video_info → app_get_comments | group_id 复用 | 同上 |
| App 端失败 → Web 端降级 | app_get_article_info → web_get_article_info | group_id 值 → aweme_id | 需注意参数名切换 |
| 文章 → 作者 | app_get_article_info → user.md app_get_user_info | `$.data.user_id` → `user_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`$.data.user_id` → `user.md` app_get_user_info

## 错误处理契约

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 通用规则
- 404/410 → 防臆造自检后 STOP
- 400/422 → 防臆造自检后修正重试 ≤1 次
- 401/402/403 → STOP
- 429 → 退避重试 ≤2 次
- 5xx → 等 3s 重试 ≤1 次，可走 App/Web 端替换
- 业务 code≠0 → 读 message_zh，不重试

---

## 端点详情

### app_get_article_info — 获取文章信息（App 端）

**Full path:** `/api/v1/toutiao/app/get_article_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定文章的信息（App 端）。group_id 可从链接中获取，如 `https://www.toutiao.com/article/7450114952884503059/`。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| group_id | string | yes | 纯数字字符串 | 作品 ID，形如 `7450114952884503059` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 作者用户 ID | user.md app_get_user_info |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 文章不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | **降级**：web_get_article_info（用相同 ID 值作 aweme_id） |

---

### app_get_video_info — 获取视频信息（App 端）

**Full path:** `/api/v1/toutiao/app/get_video_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定视频的信息（App 端）。group_id 可从链接中获取，如 `https://www.toutiao.com/video/7431543350882206242/`。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| group_id | string | yes | 纯数字字符串 | 作品 ID，形如 `7431543350882206242` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 作者用户 ID | user.md app_get_user_info |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | **降级**：web_get_video_info |

---

### app_get_comments — 获取评论列表（App 端）

**Full path:** `/api/v1/toutiao/app/get_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定作品的评论列表（App 端）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| group_id | string | yes | 纯数字字符串 | 作品 ID |
| offset | string | yes | 首次="0"，后续每次加 20 | 偏移量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 评论列表 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_get_article_info — 获取文章信息（Web 端）

**Full path:** `/api/v1/toutiao/web/get_article_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定文章的信息（Web 端）。aweme_id 可从链接中获取。通常作为 App 端的降级替代。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID，与 App 端 group_id 值相同 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 文章不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | **降级**：app_get_article_info |

---

### web_get_video_info — 获取视频信息（Web 端）

**Full path:** `/api/v1/toutiao/web/get_video_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定视频的信息（Web 端）。通常作为 App 端的降级替代。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID，与 App 端 group_id 值相同 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | **降级**：app_get_video_info |
