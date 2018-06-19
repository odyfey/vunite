/* eslint-disable no-console */

const path = require('path')
//const https = require('https')
const express = require('express')
const proxy = require('http-proxy-middleware')
const { createBundleRenderer } = require('vue-server-renderer')

const bundle = require('./dist/vue-ssr-server-bundle.json')
const template = require('fs').readFileSync('./src/index.template.html', 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template,
    clientManifest
})

process.on('unhandledRejection', up => { throw up })

const devServerBaseURL = process.env.DEV_SERVER_BASE_URL || 'http://localhost'
const devServerPort = process.env.DEV_SERVER_PORT || 8080

const app = express()

if (process.env.NODE_ENV !== 'production') {
    app.use('/js/main*', proxy({
        target: `${devServerBaseURL}/${devServerPort}`, 
        changeOrigin: true,
        pathRewrite: function (path) { 
            return path.includes('main')
                ? '/main.js'
                : path
        },
        prependPath: false
    }))
    
    app.use('/*hot-update*', proxy({
        target: `${devServerBaseURL}/${devServerPort}`, 
        changeOrigin: true,
    }))
    
    app.use('/sockjs-node', proxy({
        target: `${devServerBaseURL}/${devServerPort}`, 
        changeOrigin: true,
        ws: true
    }))
}

app.use('/js', express.static(path.resolve(__dirname, './dist/js')))
app.use('/css', express.static(path.resolve(__dirname, './dist/css')))

/*const targetHost = 'developer-forum.rokid.com'

app.use('/discourse/*', (req, res) => {
    var options = {
        host: targetHost,
        method: req.method,
        path: '/' + req.params[0],
        headers: {
            ...(req.headers),
            host: targetHost,
        }
    }

    console.log(options)

    const proxyRequest = https.request(options, (proxyResponse) => {
        for (let name in proxyResponse.headers) {
            res.setHeader(name, proxyResponse.headers[name])
        }

        console.log(proxyResponse.headers)
        res.status(proxyResponse.statusCode)
        proxyResponse.pipe(res, { end: true })
    })

    req.pipe(proxyRequest, { end: true })
})*/

app.get('*', (req, res) => {
    const context = { url: req.url }

    renderer.renderToString(context, (err, html) => {
        if (err) {
            if (err.code === 404) {
                res.status(404).end('Страница не найдена')
            } else {
                res.status(500).end('Внутренняя ошибка сервера')
            }
        } else {
            res.end(html)
        }
    })
})

module.exports = app