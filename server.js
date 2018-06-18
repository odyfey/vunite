/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const https = require('https')
const app = require('express')()
const renderer = require('vue-server-renderer').createRenderer()
const createApp = require('/path/to/built-server-bundle.js')
const targetHost = 'developer-forum.rokid.com'

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
})

app.get('/*\.:ext', (req, res) => {
    const name = req.params[0]
    const ext = req.params.ext
    const file = fs.createReadStream(
        path.join(__dirname, `./dist/${name}.${ext}`)
    )

    if (ext === 'js') {
        res.set('Content-Type', 'text/javascript');
    }

    file.on('error', (err) => {
        res.status(404)
        res.end(err.message)
    })

    file.pipe(res)
})

app.get('*', (req, res) => {
    const context = { url: req.url }

    createApp(context).then(app => {
        renderer.renderToString(app, (err, html) => {
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
})

app.listen(process.env.PORT || 8080)