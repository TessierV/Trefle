// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      trefleApiKey: process.env.TREFLE_API_KEY
    }
  },
  devtools: {
    enabled: false
  }
})