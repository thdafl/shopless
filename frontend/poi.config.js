module.exports = {
  entry: [
    'src/registerServiceWorker',
    'src/index'
  ],
  devServer: {
    https: true,
    port: process.env.FRONTEND_PORT || 8080
  },
  plugins: [
    {
      resolve: '@poi/plugin-eslint'
    },
    {
      resolve: '@poi/plugin-typescript'
    },
    {
      resolve: '@poi/plugin-pwa'
    }
  ]
};
