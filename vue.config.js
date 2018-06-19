const merge = require('lodash.merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
const target = TARGET_NODE ? 'server' : 'client'

module.exports = {
    configureWebpack: () => ({
        entry: `./src/entry-${target}`,
        target: TARGET_NODE ? 'node' : 'web',
        node: TARGET_NODE ? undefined : false,
        devtool: 'source-map',

        plugins: [
          TARGET_NODE 
            ? new VueSSRServerPlugin()
            : new VueSSRClientPlugin()
        ],

        externals: TARGET_NODE ? nodeExternals({
            whitelist: /\.css$/
        }) : undefined,

        output: {
            libraryTarget: TARGET_NODE 
                ? 'commonjs2' 
                : undefined
        },

        optimization: {
            splitChunks: undefined
        },
    }),

    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options =>
                merge(options, {
                    optimizeSSR: false
                })
            )
    }
}