# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| fetch_one_video | fetch_one_video | post.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_one_video_v2 | fetch_one_video_v2 | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_one_video_play_url | fetch_one_video_play_url | post.md | 内容 | low | ✓ | ✗ | terminal |
| fetch_video_comment_list | fetch_video_comment_list | post.md | 内容 | low | ✓ | ✗ | relay |
| search_video | search_video | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_user_info | fetch_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| fetch_user_post_list | fetch_user_post_list | user.md | 用户 | low | ✓ | ✗ | relay |
