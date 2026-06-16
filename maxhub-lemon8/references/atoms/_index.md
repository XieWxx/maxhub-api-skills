# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| fetch_post_detail | fetch_post_detail | content.md | 内容 | low | ✓ | ✗ | terminal |
| fetch_post_comment_list | fetch_post_comment_list | content.md | 内容 | low | ✓ | ✗ | relay |
| fetch_search | fetch_search | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_discover_tab | fetch_discover_tab | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_discover_tab_information_tabs | fetch_discover_tab_information_tabs | content.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_discover_banners | fetch_discover_banners | content.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_hot_search_keywords | fetch_hot_search_keywords | content.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_topic_info | fetch_topic_info | content.md | 内容 | low | ✓ | ✗ | relay |
| fetch_topic_post_list | fetch_topic_post_list | content.md | 内容 | low | ✓ | ✗ | relay |
| get_item_id | get_item_id | content.md | 内容 | low | ✓ | ✗ | starter |
| get_item_ids | get_item_ids | content.md | 内容 | low | ✓ | ✗ | starter |
| get_user_id | get_user_id | user.md | 用户 | low | ✓ | ✗ | starter |
| get_user_ids | get_user_ids | user.md | 用户 | low | ✓ | ✗ | starter |
| fetch_user_profile | fetch_user_profile | user.md | 用户 | low | ✓ | ✗ | terminal |
| fetch_user_follower_list | fetch_user_follower_list | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_following_list | fetch_user_following_list | user.md | 用户 | low | ✓ | ✗ | relay |
