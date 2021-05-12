var webpack = require('webpack')
module.exports = {
  "devServer": {
    "host": "0.0.0.0",
    "port": "9001",
    "public": "0.0.0.0:9001",
    "disableHostCheck": true,
    "noInfo": true
  },
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: config => {
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{ $: 'jquery', jQuery: "jquery" }])

  }
}