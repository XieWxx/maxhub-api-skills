# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。
> Agent 可按 atom_id 快速定位端点，无需全文读取 reference 详情。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_post | get_post_detail | post.md | 作品 | low | ✓ | ✗ | starter |
| list_comments | get_post_comments | post.md | 评论 | low | ✓ | ✗ | relay |
| list_replies | get_comment_replies | post.md | 评论 | low | ✓ | ✗ | relay |
| list_remix | get_post_remix_list | post.md | 作品 | low | ✓ | ✗ | relay |
| get_download | get_video_download_info | post.md | 作品 | low | ✓ | ✗ | relay |
| get_feed | get_feed | post.md | 作品 | low | ✓ | ✗ | starter |
| search_users | search_users | user.md | 用户 | low | ✓ | ✗ | starter |
| get_profile | get_user_profile | user.md | 用户 | low | ✓ | ✗ | relay |
| list_user_posts | get_user_posts | user.md | 用户 | low | ✓ | ✗ | relay |
| list_following | get_user_following | user.md | 用户 | low | ✓ | ✗ | relay |
| list_followers | get_user_followers | user.md | 用户 | low | ✓ | ✗ | relay |
| list_cameo | get_user_cameo_appearances | user.md | 用户 | low | ✓ | ✗ | relay |
| upload_image | upload_image | tools.md | 工具 | high | ✗ | ✓ | starter |
| create_video | create_video | tools.md | 工具 | high | ✗ | ✓ | starter |
| get_task_status | get_task_status | tools.md | 工具 | low | ✓ | ✗ | relay |
| get_task_detail | get_task_detail | tools.md | 工具 | low | ✓ | ✗ | terminal |
| get_cameo_board | get_cameo_leaderboard | tools.md | 热榜 | low | ✓ | ✗ | starter |

### 字段说明
- **atom_id**：业务化别名，Agent 易记易用（如 `get_post` 而非 `get_post_detail`）
- **endpoint_id**：原始端点 ID，与 endpoints_whitelist.yaml / param-mappings.md 对应
- **file**：端点详情所在的 reference 文件（含子目录路径）
- **domain**：业务子领域（作品/评论/用户/工具/热榜）
- **risk**：low / high（与 endpoints_whitelist.yaml 一致）
- **idempotent**：✓=可安全重试 / ✗=非幂等（写入端点）
- **write_op**：✓=写入端点（需用户确认）/ ✗=只读端点
- **chain_role**：starter=链路起点 / relay=中继 / terminal=终点 / standalone=独立使用
