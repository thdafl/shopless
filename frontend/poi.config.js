const path = require('path')

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
    ...require('dotenv').config({path: path.resolve(__dirname, '../.env.default')}).parsed,
    ...require('dotenv').config({path: path.resolve(__dirname, '../.env')}).parsed,
    ...require('dotenv').config({path: path.resolve(process.cwd(), './.env.default')}).parsed,
    ...require('dotenv').config().parsed,
    API_URL: process.env.API_URL || 'https://localhost:8081'
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
