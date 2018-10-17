module.exports = {
    port: 9000,
    dev: 'development',
    prod: 'production',
    entries: [{
        name: 'app',
        entry: 'src/app/index.js',
        title: '保利国际维权',
        template: 'src/app/index.html',
        favicon: 'src/app/favicon.ico'
    }],
    proxy: [{
        router: '/baoli/api',
        target: 'http://localhost:82',
        pathRewrite: { '^/baoli/api': '/' }
    }]
}