import { defineClientConfig } from "vuepress/client";
import { defineKotlinPlaygroundConfig } from "vuepress-plugin-md-enhance/client";

defineKotlinPlaygroundConfig({
  // `kotlin-playground` options here
  version: "2.0.0"
});

export default defineClientConfig({
});