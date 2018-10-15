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
        router: '/api',
        target: 'http://localhost:81',
        pathRewrite: { '^/api': '/' }
    }]
}