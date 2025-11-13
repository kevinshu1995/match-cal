import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },

    css: ["~/assets/css/tailwind.css"],

    modules: ["@nuxt/eslint", "@nuxt/hints", "@nuxt/icon", "@nuxt/fonts", "@nuxt/image", "shadcn-nuxt", "@vueuse/nuxt"],

    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: "",
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: "./components/ui",
    },

    app: {
        head: {
            title: "MatchCal - 比賽賽程自動整合行事曆",
            meta: [
                { name: "description", content: "一鍵訂閱各種比賽賽程至個人行事曆" },
                { property: "og:title", content: "MatchCal" },
                { property: "og:description", content: "比賽賽程自動整合行事曆" },
            ],
        },
    },

    vite: {
        plugins: [tailwindcss()],
    },
});

