// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode', '@nuxt/image'],
  css: ['~/assets/css/app.css'],
  build: {
    transpile: ['frappe-gantt'],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@import "@/assets/styles/_variables.scss";`, // если у вас есть глобальные переменные или миксины
        },
      },
    },
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
