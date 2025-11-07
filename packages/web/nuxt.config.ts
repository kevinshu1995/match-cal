// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],

  shadcn: {
    /**
     * 組件前綴（留空表示無前綴）
     */
    prefix: '',
    /**
     * 組件目錄
     */
    componentDir: './components/ui'
  },

  css: ['~/assets/css/tailwind.css']
})
