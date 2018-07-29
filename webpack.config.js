const CleanPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { DefinePlugin } = require('webpack');

const log = require('webpack-log')({ name: 'wds' });

// Resolve environment settings for webpack.
const config = f => (
  { development, production } = {
    development: true
  }
) => {
  const env = {
    development: !!development,
    production: !!production
  };

  log.info(`Environment settings`);
  log.info(env);

  return f(env);
};

module.exports = config((development) => ({
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  entry: {
    ...entry('background'),
    ...entry('common'),
    ...entry('popup'),
    ...entry('settings')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env': stringifyValues({
        BUGSNAG_API_KEY: '7419717b29de539ab0fbe35dcd7ca19d',
        DEBUG: development,
        GA_TRACKING_ID: 'UA-3215787-22'
      })
    }),
    new CleanPlugin([path.resolve(__dirname, 'dist')]),
    new CopyPlugin([
      ...copy({
        from: 'html/',
        to: 'html/'
      }),
      ...copy({
        from: 'images/',
        to: 'images/'
      }),
      ...copy({
        from: 'scripts/content/',
        to: 'scripts/content/'
      }),
      ...copy({
        from: 'sounds/',
        to: 'sounds/'
      }),
      ...copy({
        from: 'styles/',
        to: 'styles/'
      }),
      {
        from: 'chrome-manifest.json',
        to: 'chrome/manifest.json'
      },
      {
        from: 'firefox-manifest.json',
        to: 'firefox/manifest.json'
      }
    ])
  ]
}));

const entry = name => ({
  [`chrome/scripts/${name}`]: `./scripts/${name}.js`,
  [`firefox/scripts/${name}`]: `./scripts/${name}.js`
});

const copy = o => [
  {
    ...o,
    to: `chrome/${o.to}`
  },
  {
    ...o,
    to: `firefox/${o.to}`
  }
];

const stringifyValues = obj =>
  Object.entries(obj)
    .map(([k, v]) => [k, JSON.stringify(v)])
    .reduce((o, [k, v]) => {
      o[k] = v;
      return o;
    }, {});
