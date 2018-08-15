export const config = {
    baseUrl: "http://localhost:8080",

    discourse: {
        backend: "http://discourse.test",
        ssoProxy: "http://localhost:5000/api/auth",
        // apiKey created in ${backend}/admin/api/keys
        apiKey: process.env.DISCOURSE_API_KEY
    },

    locale: "ru-RU"
}
