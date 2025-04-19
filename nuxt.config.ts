// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  srcDir: "src/",
  css: ["~/assets/css/global.css"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  i18n: {
    locales: [
      {
        code: "pt",
        iso: "pt-BR",
        file: "pt.json",
      },
      {
        code: "en",
        iso: "en-US",
        file: "en.json",
      },
    ],
    defaultLocale: "en",
    langDir: "locales/",
    lazy: true,
    detectBrowserLanguage: false,
    vueI18n: "./i18n.config.ts",
    strategy: "no_prefix",
  },
  runtimeConfig: {
    public: {
      env: process.env.ENV,
    },
  },
});