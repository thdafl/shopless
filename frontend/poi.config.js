module.exports = {
  entry: [
    'src/registerServiceWorker',
    'src/index'
  ],
  devServer: {
    https: true,
    port: process.env.FRONTEND_PORT || 8080
  },
  envs: {
    API_URL: 'https://localhost:8081',
    ...require('dotenv').config().parsed
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
