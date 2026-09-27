export interface UIStrings {
  nav: {
    home: string;
    about: string;
    posts: string;
    tags: string;
    archives: string;
    search: string;
  };
  home: {
    socialLinks: string;
    latestPosts: string;
    allPosts: string;
  };
  posts: {
    title: string;
    description: string;
    backToPosts: string;
    empty: string;
    publishedOn: string;
    updatedOn: string;
    readingTime: string;
    minutes: string;
    tableOfContents: string;
    previousPost: string;
    nextPost: string;
    adjacentPosts: string;
    copyCode: string;
    copied: string;
    copyFailed: string;
    linkToHeading: string;
    backToTop: string;
  };
  tags: {
    title: string;
    description: string;
    /** 单个标签页的标题前缀，形如「标签：Astro」 */
    one: string;
    oneDescription: string;
    empty: string;
  };
  archives: {
    title: string;
    description: string;
    /** 年份/月份后面的计数单位 */
    count: string;
  };
  search: {
    title: string;
    description: string;
    /** 搜索框的可访问标签（pagefind 自己只给 title，axe 判定不合格） */
    searchLabel: string;
    /** 开发模式下 pagefind 索引还没生成时的提示 */
    devHint: string;
    devHintCommand: string;
  };
  pagination: {
    prev: string;
    next: string;
  };
  comments: {
    title: string;
    hint: string;
    iframeTitle: string;
    noscript: string;
  };
  activity: {
    title: string;
    description: string;
    totalCommits: string;
    activeDays: string;
    maxInADay: string;
    longestStreak: string;
    currentStreak: string;
    unitDay: string;
    month: string;
    commits: string;
    share: string;
    yearTotal: string;
    legendLess: string;
    legendMore: string;
    rangeNote: string;
    unavailable: string;
    /** 首页区块的说明文案 */
    homeDescription: string;
    /** 首页跳到关于页的链接文字 */
    homeMore: string;
    /** 窄屏时热力图需要横向滑动，给一句提示 */
    scrollHint: string;
    /** 逐日格子的可访问名称，{date} / {count} 会被替换 */
    dayLabel: string;
    /** 贡献热力图的可访问名称，{total} / {from} / {to} 会被替换 */
    heatmapLabel: string;
  };
  avatarAlt: string;
  footer: {
    copyright: string;
    allRightsReserved: string;
    themeCredit: string;
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    zoomImage: string;
    closeImage: string;
    imagePreview: string;
    readingProgress: string;
    goToPreviousPage: string;
    goToNextPage: string;
    pagination: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
}
