import path from 'path'

export const nextConfig = {
  env: [],
  distDir: '.nextCustom',
  assetPrefix: '',
  useFileSystemPublicRoutes: true,
  compress: true,
  pageExtensions: ['tsx', 'ts'],
}

export const webpackConfig = {
  mode: 'production',
  entry: './app/entry',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/assets/',
    library: {
      type: 'umd',
      name: 'MyLibrary',
    },
    uniqueName: 'my-application',
    name: 'my-config',
  },
  module: {
    rules: [
      {
        include: [],
        exclude: [path.resolve(__dirname, 'app/demo-files')],
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        },
        use: {
          loader: 'next-babel-loader',
        },
        type: 'javascript/auto',
      },
      {
        rules: [],
      },
    ],
  },
}
