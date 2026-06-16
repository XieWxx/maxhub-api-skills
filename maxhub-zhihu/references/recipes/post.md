## Recipe: column_articles_to_detail · 专栏文章→详情

> ✋ 用户语义命中：「专栏文章」「看看专栏」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| column_id | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_column_articles | column_id → column_id | $.data.data[].id → aid | STOP |
| 2 | fetch_column_article_detail | aid → article_id | — | 返回文章列表+"详情暂不可取" |

### Output
- 专栏文章列表（必有）
- 文章详情（可选）

### Fallback
全部失败 → STOP

---

## Recipe: article_detail_with_relationship · 文章详情+互动

> ✋ 用户语义命中：「文章互动」「点赞评论」「互动数据」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| article_id | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_column_article_detail | article_id → article_id | $.data.id → aid | STOP |
| 2 | fetch_column_relationship | aid → article_id | — | 返回详情+"互动数据暂不可取" |

### Output
- 文章详情（必有）
- 互动关系数据（可选）

### Fallback
全部失败 → STOP

---

## Recipe: question_answers_with_comments · 问题回答+评论

> ✋ 用户语义命中：「问题评论」「回答评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| question_id | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_question_answers | question_id → question_id | $.data.data[].id → ans_id | STOP |
| 2 | fetch_comment_v5 | ans_id → answer_id | — | 返回回答列表+"评论暂不可取" |

### Output
- 回答列表（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: hot_list_to_answers · 热榜→回答

> ✋ 用户语义命中：「知乎热榜」「热门问题」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_hot_list | — | $.data.data[].target.id → qid | STOP |
| 2 | fetch_question_answers | qid → question_id | — | 返回热榜+"回答暂不可取" |

### Output
- 热榜列表（必有）
- 问题回答（可选）

### Fallback
全部失败 → STOP
