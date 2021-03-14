module.exports = {
  lintOnSave: false,
  devServer: {
    overlay: {
      warning: true,
      errors: true,
    },
    proxy: {
      '/proxy': { 
        target: 'https://www.cjssy.cn:20013',
        secure: true, // false为http访问，true为https访问
        changeOrigin: true, // 跨域访问设置，true代表跨域
        ws: false,
        pathRewrite: {
          // 路径改写规则
          '^/proxy': '', 
        },
      },
    },
  },
};
