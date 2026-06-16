# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。
> Agent 可按 atom_id 快速定位端点，无需全文读取 reference 详情。
> ⚠️ 本 skill 全部端点均为 GET + risk=low，参数放 query string。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_tweet | fetch_tweet_detail | content.md | 推文 | low | ✓ | ✗ | starter |
| get_comments | fetch_post_comments | content.md | 推文 | low | ✓ | ✗ | relay |
| get_latest_comments | fetch_latest_post_comments | content.md | 推文 | low | ✓ | ✗ | relay |
| get_retweeters | fetch_retweet_user_list | content.md | 推文 | low | ✓ | ✗ | relay |
| search_tweets | fetch_search_timeline | content.md | 推文 | low | ✓ | ✗ | starter |
| get_trending | fetch_trending | content.md | 推文 | low | ✓ | ✗ | starter |
| get_profile | fetch_user_profile | user.md | 用户 | low | ✓ | ✗ | starter |
| get_user_tweets | fetch_user_post_tweet | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_replies | fetch_user_tweet_replies | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_media | fetch_user_media | user.md | 用户 | low | ✓ | ✗ | relay |
| get_followings | fetch_user_followings | user.md | 用户 | low | ✓ | ✗ | relay |
| get_followers | fetch_user_followers | user.md | 用户 | low | ✓ | ✗ | relay |
| get_highlights | fetch_user_highlights_tweets | user.md | 用户 | low | ✓ | ✗ | relay |

### 字段说明
- **atom_id**：业务化别名，Agent 易记易用
- **endpoint_id**：原始端点 ID，与 endpoints_whitelist.yaml / param-mappings.md 对应
- **file**：端点详情所在的 reference 文件
- **domain**：业务子领域（推文/用户）
- **risk**：本 skill 全部为 low（免费/低风险调用）
- **idempotent**：✓=可安全重试（全部为 GET 读取端点）
- **write_op**：✗=只读端点（本 skill 无写入能力）
- **chain_role**：starter=链路起点 / relay=中继 / terminal=终点 / standalone=独立使用
