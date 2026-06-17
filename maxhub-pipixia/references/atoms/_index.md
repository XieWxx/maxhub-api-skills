# Atomic Index / 原子索引

## 🚨 高风险能力分组（RESTRICTED — 默认禁用）

> 以下原子被分类为高风险，**默认 agent 不应主动调用**。
> 仅在用户明确授权 + 一次性确认后才能执行。具体策略见 SKILL.md 的「高风险能力清单」章节。

| atom_id | 风险类别 | 限制原因 |
|---------|---------|---------|
| 🚨 fetch_increase_post_view_count | metric_manipulation | platform metric fraud — violates platform ToS |

---

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| 🚨 fetch_increase_post_view_count | fetch_increase_post_view_count | post.md | 内容 | medium | ✓ | ✓ | standalone |
| fetch_post_detail | fetch_post_detail | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_post_statistics | fetch_post_statistics | post.md | 内容 | low | ✓ | ✗ | relay |
| fetch_post_comment_list | fetch_post_comment_list | post.md | 内容 | low | ✓ | ✗ | relay |
| fetch_home_feed | fetch_home_feed | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_home_short_drama_feed | fetch_home_short_drama_feed | post.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_search | fetch_search | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_hot_search_words | fetch_hot_search_words | post.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_hot_search_board_list | fetch_hot_search_board_list | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_hot_search_board_detail | fetch_hot_search_board_detail | post.md | 内容 | low | ✓ | ✗ | relay |
| fetch_hashtag_detail | fetch_hashtag_detail | post.md | 内容 | low | ✓ | ✗ | relay |
| fetch_hashtag_post_list | fetch_hashtag_post_list | post.md | 内容 | low | ✓ | ✗ | relay |
| fetch_short_url | fetch_short_url | post.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_user_info | fetch_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| fetch_user_post_list | fetch_user_post_list | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_follower_list | fetch_user_follower_list | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_following_list | fetch_user_following_list | user.md | 用户 | low | ✓ | ✗ | relay |
