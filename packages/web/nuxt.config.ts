import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },

    modules: ["shadcn-nuxt"],

    shadcn: {
        prefix: "",
        componentDir: "./components/ui",
    },

    css: ["~/assets/css/tailwind.css"],

    vite: {
        // @ts-expect-error
        plugins: [tailwindcss()],
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
});

