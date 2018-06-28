export const config = {
    baseUrl: 'http://localhost:8080',

    discourse: {
        backend: 'http://discourse.test',
        backendProxy: 'http://localhost:8888', //configured in .bypassconfig
        ssoProxy: 'http://localhost:5000/api/auth'
    },

    locale: 'ru-RU'
}