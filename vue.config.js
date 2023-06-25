module.exports = {
  chainWebpack: config => {
    // Configuração do loader para arquivos MP4
    config.module
      .rule('mp4')
      .test(/\.mp4$/)
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        options = {
          name: 'videos/[name].[ext]'
        };
        return options;
      });
  }
};
