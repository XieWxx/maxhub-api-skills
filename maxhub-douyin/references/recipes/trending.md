# Recipe: 热榜 / Trending

> 热榜域编排链路，覆盖热搜→视频、热点总榜→作品分析、城市/标签→榜单、热门账号→粉丝画像/兴趣/趋势、品牌/热词/活动日历等场景。

---

## hot_search_video — 热搜→视频详情

**Inputs:** 无
**Atomic Steps:**
1. `get_hot_search` (starter) → 输出 `$.data.word_list[].aweme_id`
2. `cross_ref:video.md#get_video` (starter) ← `aweme_id` → 输出视频详情
**Output:** 热搜榜单 + 视频详情
**Fallback:** 跨文件链路，详见 video.md

---

## hot_total_portrait — 热点总榜→作品画像

**Inputs:** 无
**Atomic Steps:**
1. `get_hot_total` (starter) → 输出 `$.data.list[].aweme_id`
2. `get_hot_user_portrait` (terminal) ← `aweme_id` → 输出作品点赞观众画像
**Output:** 热点总榜 + 作品画像
**Fallback:** 第 2 步失败：返回榜单 + "画像暂不可取"

---

## hot_total_comment — 热点总榜→评论词云

**Inputs:** 无
**Atomic Steps:**
1. `get_hot_total` (starter) → 输出 `$.data.list[].aweme_id`
2. `get_hot_comment_words` (terminal) ← `aweme_id` → 输出评论词云权重
**Output:** 热点总榜 + 评论词云
**Fallback:** 第 2 步失败：返回榜单 + "词云暂不可取"

---

## hot_total_trends — 热点总榜→作品趋势

**Inputs:** 无
**Atomic Steps:**
1. `get_hot_total` (starter) → 输出 `$.data.list[].aweme_id`
2. `get_hot_item_trends` (terminal) ← `aweme_id` → 输出作品数据趋势
**Output:** 热点总榜 + 作品趋势
**Fallback:** 第 2 步失败：返回榜单 + "趋势暂不可取"

---

## city_hot — 城市列表→同城热点

**Inputs:** 无
**Atomic Steps:**
1. `get_city_list` (starter) → 输出 `$.data[].city_code`
2. `get_hot_city` (terminal) ← `city_code` → 输出同城热点榜
**Output:** 城市列表 + 同城热点
**Fallback:** 第 1 步失败：用空 city_code 查全部

---

## tag_hot_account — 内容标签→热门账号

**Inputs:** 无
**Atomic Steps:**
1. `get_content_tag` (starter) → 输出 `$.data[].tag`
2. `get_hot_account` (starter) ← `query_tag` → 输出热门账号列表
**Output:** 内容标签 + 热门账号
**Fallback:** 第 1 步失败：用空 query_tag 查全部

---

## brand_category_detail — 品牌分类→品牌详情

**Inputs:** 无
**Atomic Steps:**
1. `get_brand_hot_search` (starter) → 输出 `$.data.category_list[].category_id`
2. `get_brand_hot_detail` (terminal) ← `category_id` → 输出品牌热榜详情
**Output:** 品牌分类 + 品牌详情
**Fallback:** 第 1 步失败：STOP

---

## hot_account_fans — 热门账号→粉丝画像

**Inputs:** `query_tag`
**Atomic Steps:**
1. `get_hot_account` (starter) ← `query_tag` → 输出 `$.data.list[].sec_uid`
2. `get_account_fans_portrait` (terminal) ← `sec_uid` → 输出粉丝画像
**Output:** 热门账号 + 粉丝画像
**Fallback:** 第 2 步失败：返回账号列表 + "画像暂不可取"

---

## hot_account_interest — 热门账号→粉丝兴趣

**Inputs:** `query_tag`
**Atomic Steps:**
1. `get_hot_account` (starter) ← `query_tag` → 输出 `$.data.list[].sec_uid`
2. `get_account_fans_interest` / `get_account_fans_topic` / `get_account_fans_search` (terminal) ← `sec_uid` → 输出粉丝兴趣
**Output:** 热门账号 + 粉丝兴趣/话题/搜索词
**Fallback:** 第 2 步失败：返回账号列表

---

## hot_account_trends — 热门账号→账号趋势

**Inputs:** `query_tag`
**Atomic Steps:**
1. `get_hot_account` (starter) ← `query_tag` → 输出 `$.data.list[].sec_uid`
2. `get_account_trends` (terminal) ← `sec_uid` → 输出账号数据趋势
**Output:** 热门账号 + 账号趋势
**Fallback:** 第 2 步失败：返回账号列表

---

## search_account_analysis — 搜索账号→账号分析

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_hot_account` (starter) ← `keyword` → 输出 `$.data.list[].sec_uid`
2. `get_account_analysis` (terminal) ← `sec_uid` → 输出账号作品分析
**Output:** 搜索结果 + 账号分析
**Fallback:** 第 1 步失败：STOP

---

## hotword_detail — 热词→热词详情

**Inputs:** 无
**Atomic Steps:**
1. `get_hot_word_rank` (starter) → 输出 `$.data.list[].word_id` + `keyword`
2. `get_hot_word_detail` (terminal) ← `word_id` + `keyword` → 输出热词详情
**Output:** 热词榜 + 热词详情
**Fallback:** 第 1 步失败：STOP

---

## calendar_detail — 活动日历→日历详情

**Inputs:** 无
**Atomic Steps:**
1. `get_hot_calendar` (starter) → 输出 `$.data.list[].calendar_id`
2. `get_hot_calendar_detail` (terminal) ← `calendar_id` → 输出活动详情
**Output:** 活动日历 + 活动详情
**Fallback:** 第 1 步失败：STOP

---

## video_rank_detail — 视频榜→视频详情

**Inputs:** 无
**Atomic Steps:**
1. `get_video_rank` (starter) → 输出 `$.data.list[].aweme_id`
2. `cross_ref:video.md#get_video` (starter) ← `aweme_id` → 输出视频详情
**Output:** 视频榜 + 视频详情
**Fallback:** 跨文件链路，详见 video.md

---

## channel_video_detail — 频道→视频详情

**Inputs:** `tag_id`
**Atomic Steps:**
1. `get_channel_trending` (starter) ← `tag_id` → 输出 `$.data.aweme_list[].aweme_id`
2. `cross_ref:video.md#get_video` (starter) ← `aweme_id` → 输出视频详情
**Output:** 频道内容 + 视频详情
**Fallback:** 跨文件链路，详见 video.md
