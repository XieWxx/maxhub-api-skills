## Recipe: company_with_employees · 公司+员工

> ✋ 用户语义命中：「公司员工」「谁在这家公司」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| company_id | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_company_profile | company_id → company_id | $.data.id → cid | STOP |
| 2 | v2_get_company_employees | cid → company_id | — | 返回公司信息+"员工列表暂不可取" |

### Output
- 公司信息（必有）
- 员工列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: company_with_posts · 公司+帖子

> ✋ 用户语义命中：「公司帖子」「公司动态」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| company_id | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_company_profile | company_id → company_id | $.data.id → cid | STOP |
| 2 | v2_get_company_posts | cid → company_id | — | 返回公司信息+"帖子暂不可取" |

### Output
- 公司信息（必有）
- 公司帖子列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: company_with_jobs · 公司+职位

> ✋ 用户语义命中：「公司职位」「公司招聘」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| company_id | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_company_profile | company_id → company_id | $.data.id → cid | STOP |
| 2 | v2_get_company_jobs | cid → company_id | — | 返回公司信息+"职位暂不可取" |

### Output
- 公司信息（必有）
- 公司职位列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: company_competitor_analysis · 公司竞品分析

> ✋ 用户语义命中：「竞品」「竞争对手」「类似公司」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| company_id | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_company_profile | company_id → company_id | $.data.id → cid | STOP |
| 2 | v2_get_company_competitors | cid → company_id | — | 返回公司信息+"竞品数据暂不可取" |

### Output
- 公司信息（必有）
- 竞品公司列表（可选）

### Fallback
全部失败 → STOP
