export const config = {
    baseUrl: 'http://localhost:8080',

    discourse: {
        backend: 'http://discourse.test',
        ssoProxy: 'http://localhost:5000/api/auth',
        apiKey: 'b396581138db3a6f33b582ec7767e71eebe855a1adfb96eec42c0e1f33500a38' //created in ${backend}/admin/api/keys
    },

    locale: 'ru-RU'
}