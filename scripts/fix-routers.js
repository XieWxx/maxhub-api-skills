#!/usr/bin/env node

// 为每个skill生成闭环完整的router.js
// 使用api.js中API_REGISTRY的实际方法名

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');

// 平台特有路由配置 - 方法名必须与API_REGISTRY中完全一致
const ROUTER_CONFIG = {
  'maxhub-bilibili': {
    displayName: 'B站平台',
    routes: [
      { intent: 'search_video', apiMethod: 'fetchGeneralSearch', desc: '搜索视频', params: ['keyword'] },
      { intent: 'search_user', apiMethod: 'fetchSearchByType', desc: '搜索用户', params: ['keyword'] },
      { intent: 'get_video_detail', apiMethod: 'fetchOneVideo', desc: '获取视频详情', params: ['bvid'], altParams: { aid: 'fetchOneVideoV2' } },
      { intent: 'get_user_profile', apiMethod: 'fetchUserProfile', desc: '获取用户信息', params: ['mid'] },
      { intent: 'get_hot_search', apiMethod: 'fetchHotSearch', desc: '获取热搜', params: [] },
      { intent: 'get_comments', apiMethod: 'fetchVideoComments', desc: '获取视频评论', params: ['oid'] },
      { intent: 'get_comment_replies', apiMethod: 'fetchCommentReply', desc: '获取评论回复', params: ['oid', 'rpid'] },
      { intent: 'get_user_videos', apiMethod: 'fetchUserPostVideos', desc: '获取用户投稿', params: ['mid'] },
    ],
  },
  'maxhub-xiaohongshu': {
    displayName: '小红书平台',
    routes: [
      { intent: 'search_note', apiMethod: 'fetchSearchNotes', desc: '搜索笔记', params: ['keyword'] },
      { intent: 'search_user', apiMethod: 'fetchSearchUsers', desc: '搜索用户', params: ['keyword'] },
      { intent: 'get_note_detail', apiMethod: 'fetchNoteDetail', desc: '获取笔记详情', params: ['note_id'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserInfo', desc: '获取用户信息', params: ['user_id'] },
      { intent: 'get_comments', apiMethod: 'fetchNoteComments', desc: '获取笔记评论', params: ['note_id'] },
      { intent: 'get_user_notes', apiMethod: 'fetchUserNotes', desc: '获取用户笔记', params: ['user_id'] },
    ],
  },
  'maxhub-weibo': {
    displayName: '微博平台',
    routes: [
      { intent: 'search', apiMethod: 'fetchSearch', desc: '搜索微博', params: ['keyword'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserInfo', desc: '获取用户信息', params: ['uid'] },
      { intent: 'get_hot_search', apiMethod: 'fetchHotSearch', desc: '获取热搜', params: [] },
      { intent: 'get_detail', apiMethod: 'fetchStatusDetail', desc: '获取微博详情', params: ['id'] },
      { intent: 'get_comments', apiMethod: 'fetchStatusComments', desc: '获取评论', params: ['id'] },
    ],
  },
  'maxhub-tiktok': {
    displayName: 'TikTok平台',
    routes: [
      { intent: 'search_video', apiMethod: 'fetchGeneralSearch', desc: '搜索视频', params: ['keyword'] },
      { intent: 'search_user', apiMethod: 'fetchSearchUser', desc: '搜索用户', params: ['keyword'] },
      { intent: 'get_video_detail', apiMethod: 'fetchOneVideo', desc: '获取视频详情', params: ['aweme_id'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserProfile', desc: '获取用户信息', params: ['unique_id'], altParams: { sec_uid: 'handlerUserProfile' } },
      { intent: 'get_comments', apiMethod: 'fetchVideoComments', desc: '获取评论', params: ['aweme_id'] },
      { intent: 'get_user_videos', apiMethod: 'fetchUserPostVideos', desc: '获取用户视频', params: ['sec_uid'] },
    ],
  },
  'maxhub-youtube': {
    displayName: 'YouTube平台',
    routes: [
      { intent: 'search', apiMethod: 'searchVideo', desc: '搜索视频', params: ['keyword'] },
      { intent: 'get_video_detail', apiMethod: 'getVideoInfo', desc: '获取视频详情', params: ['videoId'] },
      { intent: 'get_channel_profile', apiMethod: 'getChannelInfo', desc: '获取频道信息', params: ['channelId'] },
      { intent: 'get_comments', apiMethod: 'getVideoComments', desc: '获取评论', params: ['videoId'] },
      { intent: 'get_channel_videos', apiMethod: 'getChannelVideos', desc: '获取频道视频', params: ['channelId'] },
    ],
  },
  'maxhub-instagram': {
    displayName: 'Instagram平台',
    routes: [
      { intent: 'search_user', apiMethod: 'searchUsers', desc: '搜索用户', params: ['keyword'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserInfoByUsername', desc: '获取用户信息', params: ['username'], altParams: { user_id: 'fetchUserInfoById' } },
      { intent: 'get_user_posts', apiMethod: 'fetchUserPosts', desc: '获取用户帖子', params: ['user_id'] },
      { intent: 'get_post_detail', apiMethod: 'fetchPostByUrl', desc: '获取帖子详情', params: ['shortcode'] },
      { intent: 'get_comments', apiMethod: 'fetchPostComments', desc: '获取评论', params: ['shortcode'] },
    ],
  },
  'maxhub-twitter': {
    displayName: 'Twitter/X平台',
    routes: [
      { intent: 'search', apiMethod: 'fetchSearchTimeline', desc: '搜索推文', params: ['keyword'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserProfile', desc: '获取用户信息', params: ['username'] },
      { intent: 'get_tweet_detail', apiMethod: 'fetchTweetDetail', desc: '获取推文详情', params: ['tweet_id'] },
      { intent: 'get_user_tweets', apiMethod: 'fetchUserPostTweet', desc: '获取用户推文', params: ['user_id'] },
    ],
  },
  'maxhub-linkedin': {
    displayName: 'LinkedIn平台',
    routes: [
      { intent: 'search_people', apiMethod: 'searchPeople', desc: '搜索用户', params: ['keyword'] },
      { intent: 'get_user_profile', apiMethod: 'getUserProfile', desc: '获取用户信息', params: ['username'] },
      { intent: 'get_company_profile', apiMethod: 'getCompanyProfile', desc: '获取公司信息', params: ['name'] },
      { intent: 'get_user_posts', apiMethod: 'getUserPosts', desc: '获取用户帖子', params: ['urn'] },
      { intent: 'get_company_posts', apiMethod: 'getCompanyPosts', desc: '获取公司帖子', params: ['name'] },
    ],
  },
  'maxhub-reddit': {
    displayName: 'Reddit平台',
    routes: [
      { intent: 'search', apiMethod: 'fetchDynamicSearch', desc: '搜索', params: ['keyword'] },
      { intent: 'get_subreddit_feed', apiMethod: 'fetchSubredditFeed', desc: '获取版块帖子', params: ['subreddit_name'] },
      { intent: 'get_post_detail', apiMethod: 'fetchPostDetails', desc: '获取帖子详情', params: ['post_id'] },
      { intent: 'get_comments', apiMethod: 'fetchPostComments', desc: '获取评论', params: ['post_id'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserProfile', desc: '获取用户信息', params: ['username'] },
    ],
  },
  'maxhub-threads': {
    displayName: 'Threads平台',
    routes: [
      { intent: 'search', apiMethod: 'searchProfiles', desc: '搜索用户', params: ['keyword'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserInfo', desc: '获取用户信息', params: ['username'] },
      { intent: 'get_user_posts', apiMethod: 'fetchUserPosts', desc: '获取用户帖子', params: ['user_id'] },
      { intent: 'get_post_detail', apiMethod: 'fetchPostDetail', desc: '获取帖子详情', params: ['post_id'] },
    ],
  },
  'maxhub-wechat': {
    displayName: '微信平台',
    routes: [
      { intent: 'search', apiMethod: 'fetchDefaultSearch', desc: '搜索公众号', params: ['keyword'] },
      { intent: 'get_article_list', apiMethod: 'fetchMpArticleList', desc: '获取文章列表', params: ['ghid'] },
      { intent: 'get_article_detail', apiMethod: 'fetchMpArticleDetailJson', desc: '获取文章详情', params: ['url'] },
      { intent: 'get_comments', apiMethod: 'fetchMpArticleCommentList', desc: '获取文章评论', params: ['url'] },
    ],
  },
  'maxhub-zhihu': {
    displayName: '知乎平台',
    routes: [
      { intent: 'search', apiMethod: 'fetchArticleSearchV3', desc: '搜索', params: ['keyword'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserInfo', desc: '获取用户信息', params: ['user_id'] },
      { intent: 'get_question_answers', apiMethod: 'fetchQuestionAnswers', desc: '获取问题回答', params: ['question_id'] },
      { intent: 'get_column_articles', apiMethod: 'fetchColumnArticles', desc: '获取专栏文章', params: ['column_id'] },
      { intent: 'get_column_article_detail', apiMethod: 'fetchColumnArticleDetail', desc: '获取专栏文章详情', params: ['article_id'] },
    ],
  },
  'maxhub-kuaishou': {
    displayName: '快手平台',
    routes: [
      { intent: 'search_video', apiMethod: 'searchComprehensive', desc: '搜索视频', params: ['keyword'] },
      { intent: 'get_video_detail', apiMethod: 'fetchOneVideo', desc: '获取视频详情', params: ['photo_id'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserInfo', desc: '获取用户信息', params: ['user_id'] },
      { intent: 'get_user_videos', apiMethod: 'fetchUserPost', desc: '获取用户作品', params: ['user_id'] },
      { intent: 'get_comments', apiMethod: 'fetchOneVideoComment', desc: '获取评论', params: ['photo_id'] },
    ],
  },
  'maxhub-toutiao': {
    displayName: '头条平台',
    routes: [
      { intent: 'get_article_detail', apiMethod: 'getArticleInfo', desc: '获取文章详情', params: ['item_id'] },
      { intent: 'get_video_detail', apiMethod: 'getVideoInfo', desc: '获取视频详情', params: ['item_id'] },
      { intent: 'get_user_profile', apiMethod: 'getUserInfo', desc: '获取用户信息', params: ['user_id'] },
      { intent: 'get_comments', apiMethod: 'getComments', desc: '获取评论', params: ['item_id'] },
    ],
  },
  'maxhub-xigua': {
    displayName: '西瓜视频平台',
    routes: [
      { intent: 'search', apiMethod: 'searchVideo', desc: '搜索视频', params: ['keyword'] },
      { intent: 'get_video_detail', apiMethod: 'fetchOneVideo', desc: '获取视频详情', params: ['video_id'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserInfo', desc: '获取用户信息', params: ['user_id'] },
      { intent: 'get_comments', apiMethod: 'fetchVideoCommentList', desc: '获取评论', params: ['video_id'] },
    ],
  },
  'maxhub-pipixia': {
    displayName: '皮皮虾平台',
    routes: [
      { intent: 'search', apiMethod: 'fetchSearch', desc: '搜索', params: ['keyword'] },
      { intent: 'get_video_detail', apiMethod: 'fetchPostDetail', desc: '获取作品详情', params: ['item_id'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserInfo', desc: '获取用户信息', params: ['user_id'] },
      { intent: 'get_user_videos', apiMethod: 'fetchUserPostList', desc: '获取用户作品', params: ['user_id'] },
      { intent: 'get_comments', apiMethod: 'fetchPostCommentList', desc: '获取评论', params: ['item_id'] },
    ],
  },
  'maxhub-lemon8': {
    displayName: 'Lemon8平台',
    routes: [
      { intent: 'search', apiMethod: 'fetchSearch', desc: '搜索', params: ['keyword'] },
      { intent: 'get_user_profile', apiMethod: 'fetchUserProfile', desc: '获取用户信息', params: ['user_id'] },
      { intent: 'get_post_detail', apiMethod: 'fetchPostDetail', desc: '获取帖子详情', params: ['post_id'] },
      { intent: 'get_user_posts', apiMethod: 'fetchDiscoverTab', desc: '获取发现内容', params: [] },
    ],
  },
  'maxhub-sora2': {
    displayName: 'Sora2平台',
    routes: [
      { intent: 'search_user', apiMethod: 'searchUsers', desc: '搜索创作者', params: ['keyword'] },
      { intent: 'get_user_profile', apiMethod: 'getUserProfile', desc: '获取创作者信息', params: ['user_id'] },
      { intent: 'get_user_posts', apiMethod: 'getUserPosts', desc: '获取创作者作品', params: ['user_id'] },
      { intent: 'get_post_detail', apiMethod: 'getPostDetail', desc: '获取作品详情', params: ['post_id'] },
      { intent: 'get_comments', apiMethod: 'getPostComments', desc: '获取作品评论', params: ['post_id'] },
      { intent: 'get_feed', apiMethod: 'getFeed', desc: '获取推荐内容', params: [] },
    ],
  },
};

function generateRouterJs(skillName, config) {
  const { displayName, routes } = config;

  let routesCode = '';
  for (const route of routes) {
    routesCode += `    // ${route.desc}\n`;
    const allParams = [...route.params];
    if (route.extraParams !== false && route.params.length > 0) {
      allParams.push('page = 1', 'count = 20');
    }
    routesCode += `    async ${route.intent}({ ${allParams.join(', ')} }) {\n`;

    if (route.altParams && Object.keys(route.altParams).length > 0) {
      const conditions = [];
      if (route.params.length > 0) {
        conditions.push(`if (${route.params[0]}) {\n        const result = await api.${route.apiMethod}({ ${route.params.join(', ')} });\n        return { success: true, intent: '${route.intent}', data: data.formatItem(result) };\n      }`);
      }
      for (const [altParam, altMethod] of Object.entries(route.altParams)) {
        conditions.push(`if (${altParam}) {\n        const result = await api.${altMethod}({ ${altParam} });\n        return { success: true, intent: '${route.intent}', data: data.formatItem(result) };\n      }`);
      }
      routesCode += `      ${conditions.join(' else ')}\n`;
      routesCode += `      return { success: false, message: '请提供必要参数' };\n`;
    } else if (route.params.length === 0) {
      routesCode += `      const result = await api.${route.apiMethod}({});\n`;
      routesCode += `      return {\n        success: true,\n        intent: '${route.intent}',\n        data: data.formatItem(result),\n      };\n`;
    } else {
      routesCode += `      const result = await api.${route.apiMethod}({ ${route.params.join(', ')} });\n`;
      routesCode += `      return {\n        success: true,\n        intent: '${route.intent}',\n        data: data.formatItem(result),\n      };\n`;
    }
    routesCode += `    },\n\n`;
  }

  return `// 指令路由、分支分发 - ${displayName}
// 根据用户意图路由到对应的API调用

const api = require('../service/api');
const data = require('../service/data');

const router = {
  async dispatch(intent, params = {}) {
    const handler = this.routes[intent];
    if (!handler) {
      return { success: false, message: \`未识别的意图: \${intent}\` };
    }
    return handler(params);
  },

  routes: {
${routesCode}  },
};

module.exports = router;
`;
}

function main() {
  let fixed = 0;
  for (const [skillName, config] of Object.entries(ROUTER_CONFIG)) {
    const routerPath = path.join(SKILLS_DIR, skillName, 'core', 'router.js');
    if (!fs.existsSync(routerPath)) continue;

    const content = generateRouterJs(skillName, config);
    fs.writeFileSync(routerPath, content, 'utf-8');
    console.log(`✅ ${skillName}/core/router.js: 闭环修复完成`);
    fixed++;
  }

  console.log(`\n🎉 共修复 ${fixed} 个 skill 的 router.js`);
}

main();
