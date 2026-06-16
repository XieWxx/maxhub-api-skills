# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| app_get_article_info | app_get_article_info | post.md | 内容 | low | ✓ | ✗ | starter |
| app_get_video_info | app_get_video_info | post.md | 内容 | low | ✓ | ✗ | starter |
| app_get_comments | app_get_comments | post.md | 内容 | low | ✓ | ✗ | relay |
| web_get_article_info | web_get_article_info | post.md | 内容 | low | ✓ | ✗ | standalone |
| web_get_video_info | web_get_video_info | post.md | 内容 | low | ✓ | ✗ | standalone |
| app_get_user_id | app_get_user_id | user.md | 用户 | low | ✓ | ✗ | starter |
| app_get_user_info | app_get_user_info | user.md | 用户 | low | ✓ | ✗ | terminal |
