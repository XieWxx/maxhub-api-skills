# LinkedIn Data Assistant

[中文文档](README_CN.md)

LinkedIn professional data assistant covering user profiles, companies, jobs, posts, comments, and ads. 85 active endpoints across 4 functional areas via MaxHub API.

## Features

| Area | Reference | Endpoints |
|------|-----------|-----------|
| User & People | `references/user.md` | User profiles, posts, contact info, recommendations, experience, skills, education, publications, certifications, honors, interests, reactions, volunteers, follower/connection stats, people search | 45 |
| Companies | `references/company.md` | Company profiles, employees, posts, jobs, job count, affiliated pages, member insights, competitors, similar companies, stock quotes, CTA buttons, employee distribution, locations | 20 |
| Jobs | `references/jobs.md` | Job details, job search | 4 |
| Content & Ads | `references/content.md` | Post details, comments, replies, reactions, reposts, post search, hashtag feed, group info/posts, ad search/details | 16 |

Supports both Web and Web V2 API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-linkedin
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-linkedin.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| User & People | Search LinkedIn for software engineers at Google, 搜索LinkedIn上的Python开发者, get LinkedIn user profile for... |
| Companies | Get LinkedIn company info for Microsoft, 查LinkedIn上苹果公司的员工分布, search LinkedIn companies in AI |
| Jobs | Search LinkedIn jobs for machine learning roles, 搜索LinkedIn上的远程工作职位, get LinkedIn job details for... |
| Content & Ads | Search LinkedIn posts about AI, 查LinkedIn帖子的热门评论, search LinkedIn ads by advertiser |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
