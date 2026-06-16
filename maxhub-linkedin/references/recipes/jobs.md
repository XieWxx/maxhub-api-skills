## Recipe: search_jobs_to_detail · 搜索职位→详情

> ✋ 用户语义命中：「搜索职位」「找工作」「领英职位」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_search_jobs | keyword → keyword | $.data.elements[].job_id → jid | STOP |
| 2 | v2_get_job_detail | jid → job_id | — | 返回搜索列表+"详情暂不可取" |

### Output
- 职位搜索列表（必有）
- 职位详情（可选）

### Fallback
全部失败 → STOP
