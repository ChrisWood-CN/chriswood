import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Blog",
      description: "chriswoodcn's blog website, Powered by vuepress & Themed by vuepress-theme-hope.",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "博客",
      description: "chriswoodcn's 博客网站, 基于vuepress构建 & 使用vuepress-theme-hope主题。",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
