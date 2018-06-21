/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')

const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
const app = express()

function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        // this is only needed when vue-server-renderer is npm-linked
        basedir: resolve('./dist'),
        runInNewContext: false
    }))
}

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')

if (isProd) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    
    renderer = createRenderer(bundle, {
        template,
        clientManifest
    })
} else {
    readyPromise = require('./build/setup-dev-server')(
        app,
        templatePath,
        (bundle, options) => {
            renderer = createRenderer(bundle, options)
        }
    )
}

app.use('/dist', express.static(resolve('./dist')))

function render (req, res) {
    const s = Date.now()

    res.setHeader("Content-Type", "text/html")

    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err.stack)
        }
    }

    const context = { url: req.url }

    renderer.renderToString(context, (err, html) => {
        if (err)
            return handleError(err)

        res.send(html)

        if (!isProd) {
            console.log(`whole request: ${Date.now() - s}ms`)
        }
    })
}

app.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})