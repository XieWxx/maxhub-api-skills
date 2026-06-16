# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| fetch_home_feed | fetch_home_feed | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_popular_feed | fetch_popular_feed | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_games_feed | fetch_games_feed | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_news_feed | fetch_news_feed | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_explore_feed | fetch_explore_feed | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_topic_feed | fetch_topic_feed | content.md | 内容 | low | ✓ | ✗ | relay |
| fetch_post_details | fetch_post_details | content.md | 内容 | low | ✓ | ✗ | starter |
| fetch_post_details_batch | fetch_post_details_batch | content.md | 内容 | low | ✓ | ✗ | relay |
| fetch_post_details_batch_large | fetch_post_details_batch_large | content.md | 内容 | low | ✓ | ✗ | relay |
| fetch_post_comments | fetch_post_comments | content.md | 内容 | low | ✓ | ✗ | relay |
| fetch_comment_replies | fetch_comment_replies | content.md | 内容 | low | ✓ | ✗ | terminal |
| fetch_generated_posts | fetch_generated_posts | content.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_generated_comments | fetch_generated_comments | content.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_dynamic_search | fetch_dynamic_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| fetch_search_typeahead | fetch_search_typeahead | search.md | 搜索 | low | ✓ | ✗ | starter |
| fetch_community_highlights | fetch_community_highlights | search.md | 搜索 | low | ✓ | ✗ | relay |
| fetch_trending_searches | fetch_trending_searches | search.md | 搜索 | low | ✓ | ✗ | starter |
| fetch_subreddit_info | fetch_subreddit_info | subreddit.md | 版块 | low | ✓ | ✗ | starter |
| fetch_subreddit_feed | fetch_subreddit_feed | subreddit.md | 版块 | low | ✓ | ✗ | relay |
| fetch_subreddit_style | fetch_subreddit_style | subreddit.md | 版块 | low | ✓ | ✗ | standalone |
| fetch_subreddit_post_channels | fetch_subreddit_post_channels | subreddit.md | 版块 | low | ✓ | ✗ | standalone |
| fetch_subreddit_settings | fetch_subreddit_settings | subreddit.md | 版块 | low | ✓ | ✗ | terminal |
| check_subreddit_muted | check_subreddit_muted | subreddit.md | 版块 | low | ✓ | ✗ | terminal |
| fetch_user_profile | fetch_user_profile | user.md | 用户 | low | ✓ | ✗ | starter |
| fetch_user_posts | fetch_user_posts | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_comments | fetch_user_comments | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_user_active_subreddits | fetch_user_active_subreddits | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_user_trophies | fetch_user_trophies | user.md | 用户 | low | ✓ | ✗ | terminal |
