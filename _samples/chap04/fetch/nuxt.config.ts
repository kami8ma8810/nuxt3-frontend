// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    apiKey: process.env.NUXT_OPEN_WEATHER_API_KEY,
    public: {
      apiUrl: process.env.NUXT_API_URL,
    }
  },
})
