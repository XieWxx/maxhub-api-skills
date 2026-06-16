# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_image_note_detail | get_image_note_detail | note.md | 笔记 | low | ✓ | ✗ | starter |
| get_video_note_detail | get_video_note_detail | note.md | 笔记 | low | ✓ | ✗ | starter |
| get_note_comments | get_note_comments | note.md | 评论 | low | ✓ | ✗ | relay |
| get_note_sub_comments | get_note_sub_comments | note.md | 评论 | low | ✓ | ✗ | terminal |
| fetch_feed_notes | fetch_feed_notes | note.md | 笔记 | low | ✓ | ✗ | relay |
| fetch_feed_notes_v2 | fetch_feed_notes_v2 | note.md | 笔记 | low | ✓ | ✗ | relay |
| fetch_note_comments_web_v2 | fetch_note_comments_web_v2 | note.md | 评论 | low | ✓ | ✗ | relay |
| fetch_sub_comments_web_v2 | fetch_sub_comments_web_v2 | note.md | 评论 | low | ✓ | ✗ | terminal |
| fetch_note_detail | fetch_note_detail | note.md | 笔记 | low | ✓ | ✗ | relay |
| fetch_note_comments_web_v3 | fetch_note_comments_web_v3 | note.md | 评论 | low | ✓ | ✗ | relay |
| fetch_sub_comments_web_v3 | fetch_sub_comments_web_v3 | note.md | 评论 | low | ✓ | ✗ | terminal |
| get_user_info | get_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| get_user_posted_notes | get_user_posted_notes | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_faved_notes | get_user_faved_notes | user.md | 用户 | low | ✓ | ✗ | terminal |
| fetch_home_notes_app | fetch_home_notes_app | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_info_app | fetch_user_info_app | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_user_info | fetch_user_info | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_user_notes | fetch_user_notes | user.md | 用户 | low | ✓ | ✗ | relay |
| search_notes | search_notes | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_users | search_users | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_images | search_images | search.md | 搜索 | low | ✓ | ✗ | standalone |
| search_products | search_products | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_groups | search_groups | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_hot_list | fetch_hot_list | search.md | 发现 | low | ✓ | ✗ | starter |
| fetch_search_notes | fetch_search_notes | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_search_users | fetch_search_users | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_trending | fetch_trending | search.md | 发现 | low | ✓ | ✗ | starter |
| fetch_search_suggest | fetch_search_suggest | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_homefeed | fetch_homefeed | search.md | 发现 | low | ✓ | ✗ | starter |
| fetch_homefeed_categories | fetch_homefeed_categories | search.md | 发现 | low | ✓ | ✗ | standalone |
| get_product_detail | get_product_detail | product.md | 商品 | low | ✓ | ✗ | starter |
| get_product_review_overview | get_product_review_overview | product.md | 商品 | low | ✓ | ✗ | relay |
| get_product_reviews | get_product_reviews | product.md | 商品 | low | ✓ | ✗ | terminal |
| get_product_recommendations | get_product_recommendations | product.md | 商品 | low | ✓ | ✗ | terminal |
| get_topic_info | get_topic_info | product.md | 话题 | low | ✓ | ✗ | starter |
| get_topic_feed | get_topic_feed | product.md | 话题 | low | ✓ | ✗ | relay |
| get_creator_inspiration_feed | get_creator_inspiration_feed | product.md | 灵感 | low | ✓ | ✗ | standalone |
| get_creator_hot_inspiration_feed | get_creator_hot_inspiration_feed | product.md | 灵感 | low | ✓ | ✗ | standalone |

### 字段说明
- **atom_id**：业务化别名
- **endpoint_id**：原始端点 ID
- **file**：端点详情所在 reference 文件
- **domain**：业务子领域
- **risk**：low / high
- **idempotent**：✓ / ✗
- **write_op**：✓ / ✗
- **chain_role**：starter / relay / terminal / standalone
