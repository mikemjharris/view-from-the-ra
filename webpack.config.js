const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env)  => {
  env = env || {};
  console.log(env);
  console.log(env.production);

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    watch: !env.production,

    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }]
      }]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "./style.css"
      })
    ]
  }
};
