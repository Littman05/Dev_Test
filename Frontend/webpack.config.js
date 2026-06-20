import path from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Template from '@type/tailwind-custom-templates'
import dotenv from 'dotenv'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default (env, argv) => {
  const isProduction = argv.mode === 'production'
  const nodeEnv = isProduction ? 'production' : 'development'

  dotenv.config({ path: path.resolve(__dirname, `.env.${nodeEnv}`) })
  dotenv.config({ path: path.resolve(__dirname, '.env') })

  return {
    mode: nodeEnv,
    entry: path.resolve(__dirname, 'src/main.jsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'assets/[name].[contenthash].js' : 'assets/[name].js',
      assetModuleFilename: 'assets/[hash][ext][query]',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      }),
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
      }),
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      host: '0.0.0.0',
      port: 5173,
      hot: true,
      historyApiFallback: true,
      open: false,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          pathRewrite: { '^/api': '' },
        },
      ],
    },
  }
}
