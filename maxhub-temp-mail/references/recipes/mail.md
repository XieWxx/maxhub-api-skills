## Recipe: create_email_check_inbox · 创建邮箱+查收件箱

> ✋ 用户语义命中：「临时邮箱」「收邮件」「给我一个临时邮箱」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | get_temp_email_address | — | $.data.token → tk | STOP |
| 2 | get_emails_inbox | tk → token | — | 返回邮箱信息+"收件箱暂不可取" |

### Output
- 临时邮箱地址（必有）
- 收件箱邮件列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: inbox_to_email_detail · 收件箱→邮件详情

> ✋ 用户语义命中：「看邮件」「邮件内容」「读邮件」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| token | yes | string | 邮箱 Bearer Token |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | get_emails_inbox | token → token | $.data.emails[].message_id → mid | STOP |
| 2 | get_email_by_id | token → token; mid → message_id | — | 返回邮件列表+"详情暂不可取" |

### Output
- 邮件列表（必有）
- 邮件详情（可选）

### Fallback
全部失败 → STOP

---

## Recipe: full_email_flow · 完整邮箱流程

> ✋ 用户语义命中：「帮我收邮件」「注册用邮箱」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | get_temp_email_address | — | $.data.token → tk | STOP |
| 2 | get_emails_inbox | tk → token | $.data.emails[].message_id → mid | 返回邮箱信息+"收件箱暂不可取" |
| 3 | get_email_by_id | tk → token; mid → message_id | — | 返回邮件列表+"详情暂不可取" |

### Output
- 临时邮箱地址（必有）
- 收件箱邮件列表（可选）
- 邮件详情（可选）

### Fallback
任意中间步失败 → 返回截止失败前的数据
