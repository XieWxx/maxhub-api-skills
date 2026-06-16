# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| fetch_column_articles | fetch_column_articles | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_column_article_detail | fetch_column_article_detail | post.md | 内容 | low | ✓ | ✗ | terminal |
| fetch_column_recommend | fetch_column_recommend | post.md | 内容 | low | ✓ | ✗ | relay |
| fetch_column_relationship | fetch_column_relationship | post.md | 内容 | low | ✓ | ✗ | relay |
| fetch_column_comment_config | fetch_column_comment_config | post.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_comment_v5 | fetch_comment_v5 | post.md | 内容 | low | ✓ | ✗ | relay |
| fetch_sub_comment_v5 | fetch_sub_comment_v5 | post.md | 内容 | low | ✓ | ✗ | terminal |
| fetch_question_answers | fetch_question_answers | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_hot_recommend | fetch_hot_recommend | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_hot_list | fetch_hot_list | post.md | 内容 | low | ✓ | ✗ | starter |
| fetch_video_list | fetch_video_list | post.md | 内容 | low | ✓ | ✗ | standalone |
| fetch_user_info | fetch_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| fetch_user_followees | fetch_user_followees | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_followers | fetch_user_followers | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_articles | fetch_user_articles | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_included_articles | fetch_user_included_articles | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_user_follow_columns | fetch_user_follow_columns | user.md | 用户 | low | ✓ | ✗ | relay |
| fetch_user_follow_questions | fetch_user_follow_questions | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_user_follow_collections | fetch_user_follow_collections | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_user_follow_topics | fetch_user_follow_topics | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_recommend_followees | fetch_recommend_followees | user.md | 用户 | low | ✓ | ✗ | standalone |
| fetch_article_search_v3 | fetch_article_search_v3 | search.md | 搜索 | low | ✓ | ✗ | starter |
| fetch_user_search_v3 | fetch_user_search_v3 | search.md | 搜索 | low | ✓ | ✗ | starter |
| fetch_topic_search_v3 | fetch_topic_search_v3 | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_scholar_search_v3 | fetch_scholar_search_v3 | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_ai_search | fetch_ai_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| fetch_ai_search_result | fetch_ai_search_result | search.md | 搜索 | low | ✓ | ✗ | terminal |
| fetch_video_search_v3 | fetch_video_search_v3 | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_column_search_v3 | fetch_column_search_v3 | search.md | 搜索 | low | ✓ | ✗ | starter |
| fetch_salt_search_v3 | fetch_salt_search_v3 | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_ebook_search_v3 | fetch_ebook_search_v3 | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_preset_search | fetch_preset_search | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_search_recommend | fetch_search_recommend | search.md | 搜索 | low | ✓ | ✗ | standalone |
| fetch_search_suggest | fetch_search_suggest | search.md | 搜索 | low | ✓ | ✗ | standalone |
