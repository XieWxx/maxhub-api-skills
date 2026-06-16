# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| fetch_post_detail | fetch_post_detail | content.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_post_detail_v2 | fetch_post_detail_v2 | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_post_comments | fetch_post_comments | content.md | 内容 | low | ✓ | ✗ | relay |
| search_top | search_top | content.md | 内容 | low | ✓ | ✗ | starter |
| search_recent | search_recent | content.md | 内容 | low | ✓ | ✗ | starter |
| search_profiles | search_profiles | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_user_info | fetch_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| fetch_user_info_by_id | fetch_user_info_by_id | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_user_posts | fetch_user_posts | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_reposts | fetch_user_reposts | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_replies | fetch_user_replies | user.md | 用户 | low | ✓ | ✗ | relay |
