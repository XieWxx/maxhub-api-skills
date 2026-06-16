# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_temp_email_address | get_temp_email_address | mail.md | 邮箱 | low | ✓ | ✗ | starter |
| get_emails_inbox | get_emails_inbox | mail.md | 邮箱 | low | ✓ | ✗ | relay |
| get_email_by_id | get_email_by_id | mail.md | 邮箱 | low | ✓ | ✗ | terminal |
