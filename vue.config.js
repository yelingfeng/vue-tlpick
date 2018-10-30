module.exports = {
    lintOnSave: false,
    outputDir: 'release',
    devServer: {
        port: 8222,
        https: false,
        hotOnly: false,
        proxy: null // string | Object
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'development') {
            config.devtool = 'source-map'
            // mutate config for production...
        }
        config.externals = {
            jquery: 'jQuery'
        }
    }
};
