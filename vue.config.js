module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  outputDir:'dist',
  assetsDir:'static',
  devServer: {
    overlay: {
      warning: true,
      errors: true,
    },
    proxy: {
      '/api': { 
        target: 'https://www.cjssy.cn:20013/',
        secure: true, // false为http访问，true为https访问
        changeOrigin: true, // 跨域访问设置，true代表跨域
        ws: false,
        pathRewrite: {
          // 路径改写规则
          '^/api': 'api', 
        },
      },
    },
  },
};
