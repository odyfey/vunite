const path = require("path")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const { VueLoaderPlugin } = require("vue-loader")

const isProd = process.env.NODE_ENV === "production"
const resolve = dir => path.join(__dirname, "..", dir)

module.exports = {
    devtool: isProd ? false : "#cheap-module-source-map",
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/dist/",
        filename: "[name].[chunkhash].js"
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            public: resolve("public"),
            "@": resolve("src"),
            assets: resolve("src/assets")
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.css$/,
                use: isProd
                    ? ExtractTextPlugin.extract({
                          use: [
                              {
                                  loader: "css-loader",
                                  options: { minimize: true }
                              }
                          ],
                          fallback: "vue-style-loader"
                      })
                    : ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/webpack-dev-server/client"),
                    resolve(
                        "node_modules/element-ui/packages/popover/src/directive.js"
                    )
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "img/[name].[hash:7].[ext]"
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "media/[name].[hash:7].[ext]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                query: {
                    limit: 10000,
                    name: "fonts/[name].[hash:7].[ext]"
                }
            }
        ]
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? "warning" : false
    },
    plugins: isProd
        ? [
              new VueLoaderPlugin(),
              new webpack.optimize.UglifyJsPlugin({
                  sourceMap: true,
                  uglifyOptions: {
                      compress: { warnings: false }
                  }
              }),
              new webpack.optimize.ModuleConcatenationPlugin(),
              new ExtractTextPlugin({
                  filename: "common.[chunkhash].css"
              })
          ]
        : [new VueLoaderPlugin(), new FriendlyErrorsPlugin()]
}
