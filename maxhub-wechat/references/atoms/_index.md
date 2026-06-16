# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。
> Agent 可按 atom_id 快速定位端点，无需全文读取 reference 详情。
> ⚠️ 本 skill 全部端点均为 POST + risk=high，参数放 request body（JSON）。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_article | fetch_article_detail | mp.md | 公众号 | high | ✓ | ✗ | starter |
| get_article_stats | fetch_article_stats | mp.md | 公众号 | high | ✓ | ✗ | relay |
| get_mp_comments | fetch_article_comments | mp.md | 公众号 | high | ✓ | ✗ | relay |
| get_mp_replies | fetch_comment_replies | mp.md | 公众号 | high | ✓ | ✗ | relay |
| get_related | fetch_related_articles | mp.md | 公众号 | high | ✓ | ✗ | relay |
| get_article_ad | fetch_article_ad | mp.md | 公众号 | high | ✓ | ✗ | standalone |
| get_mp_profile | fetch_account_profile | mp.md | 公众号 | high | ✓ | ✗ | relay |
| get_mp_articles | fetch_account_articles | mp.md | 公众号 | high | ✓ | ✗ | relay |
| get_mp_services | fetch_account_services | mp.md | 公众号 | high | ✓ | ✗ | standalone |
| get_channel_info | fetch_channel_info | channels.md | 视频号 | high | ✓ | ✗ | relay |
| sph_to_username | fetch_channel_id_to_username | channels.md | 视频号 | high | ✓ | ✗ | starter |
| get_user_videos | fetch_user_videos | channels.md | 视频号 | high | ✓ | ✗ | relay |
| get_video_detail | fetch_video_detail | channels.md | 视频号 | high | ✓ | ✗ | starter |
| get_video_comments | fetch_video_comments | channels.md | 视频号 | high | ✓ | ✗ | relay |
| get_share_url | fetch_video_share_url | channels.md | 视频号 | high | ✓ | ✗ | relay |
| get_ch_profile | fetch_user_profile | channels.md | 视频号 | high | ✓ | ✗ | relay |
| get_collections | fetch_user_collections | channels.md | 视频号 | high | ✓ | ✗ | relay |
| get_collection_videos | fetch_collection_videos | channels.md | 视频号 | high | ✓ | ✗ | relay |
| get_live_history | fetch_live_history | channels.md | 视频号 | high | ✓ | ✗ | relay |
| get_live_detail | fetch_live_detail | channels.md | 视频号 | high | ✓ | ✗ | relay |
| search_channel | fetch_search_channel_videos | channels.md | 视频号 | high | ✓ | ✗ | starter |
| search_wechat | fetch_search | search.md | 搜一搜 | high | ✓ | ✗ | starter |

### 字段说明
- **atom_id**：业务化别名，Agent 易记易用
- **endpoint_id**：原始端点 ID，与 endpoints_whitelist.yaml / param-mappings.md 对应
- **file**：端点详情所在的 reference 文件
- **domain**：业务子领域（公众号/视频号/搜一搜）
- **risk**：本 skill 全部为 high（付费调用）
- **idempotent**：✓=可安全重试（读取端点）/ ✗=非幂等（写入端点）
- **write_op**：✓=写入端点（需用户确认）/ ✗=只读端点（本 skill 全部为只读）
- **chain_role**：starter=链路起点 / relay=中继 / terminal=终点 / standalone=独立使用
