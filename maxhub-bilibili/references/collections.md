# Bilibili Collections / B站 收藏夹

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户收藏夹列表、收藏夹内视频 —— 围绕"收藏"的全部读取入口。**folder_id 从 fetch_collect_folders 产出**，是 fetch_user_collection_videos 的必需输入。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys in logs, prompts, or client-side storage.

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_collect_folders | ⭐⭐⭐ 首选 | 用 uid 取收藏夹列表（**uid→folder_id 入口**） | GET | /api/v1/bilibili/web/fetch_collect_folders | low |
| fetch_user_collection_videos | ⭐⭐⭐ 首选 | 用 folder_id 取收藏夹内视频 | GET | /api/v1/bilibili/web/fetch_user_collection_videos | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看用户收藏夹 + 夹内视频 | fetch_collect_folders → fetch_user_collection_videos | `$.data.list[].id` → `folder_id` | 第 1 步失败：STOP；第 2 步失败：返回收藏夹列表 + "视频列表暂不可取" |
| 收藏夹视频 → 视频详情 | fetch_user_collection_videos → 跳到 `video.md` fetch_one_video_web | `$.data.medias[].bvid` → `bv_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的多个端点输出 uid → 本文件 `uid`
- **流出本文件**：`fetch_user_collection_videos` 的 `$.data.medias[].bvid` → `video.md` 多端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次

### 鉴权/余额/权限/限流/上游/网络/业务错误
- 按 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview) 通用规则处理

---

## 端点详情

### fetch_collect_folders — 获取用户收藏夹列表

**Full path:** `/api/v1/bilibili/web/fetch_collect_folders`
**Method:** GET · **Risk:** low

#### 用途
用 uid 获取用户所有收藏夹信息。**uid→folder_id 的链式入口**——收藏夹 ID 从此处产出。

#### 何时使用 / 不使用
- ✅ 已知 uid，想看用户的收藏夹
- ✅ 链式起点：uid → folder_id
- ❌ 已知 folder_id → 直接 fetch_user_collection_videos
- ❌ 没有 uid → 先调 user.md 的端点获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户UID，如 `178360345` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 收藏夹 ID | fetch_user_collection_videos.folder_id |
| list[].title | `$.data.list[].title` | 收藏夹标题 | 仅展示 |
| list[].media_count | `$.data.list[].media_count` | 收藏夹内视频数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无收藏夹 | 返回"暂无收藏夹" | 0 | — |

---

### fetch_user_collection_videos — 获取收藏夹内视频

**Full path:** `/api/v1/bilibili/web/fetch_user_collection_videos`
**Method:** GET · **Risk:** low

#### 用途
用 folder_id 获取指定收藏夹内的视频列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_collect_folders 取得 folder_id
- ✅ 链式产出 bvid 给 `video.md`
- ❌ 没有 folder_id → 先调 fetch_collect_folders
- ❌ 想看收藏夹列表 → fetch_collect_folders

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| folder_id | string | yes | 纯数字字符串 | 收藏夹ID，如 `1756059545` |
| pn | integer | no | ≥1 | 页码（default: 1） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| medias[].bvid | `$.data.medias[].bvid` | 视频 BV号 | video.md 多端点 |
| medias[].title | `$.data.medias[].title` | 视频标题 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | folder_id 不存在 | STOP | 0 | — |
| 空数据 | 收藏夹为空 | 返回"该收藏夹暂无视频" | 0 | — |
