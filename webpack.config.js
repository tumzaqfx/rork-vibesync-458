const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

module.exports = async function (env, argv) {
  const projectRoot = __dirname;
  const appRootAbs = path.resolve(projectRoot, 'app');
  const appRootRel = './app';
  
  if (!fs.existsSync(appRootAbs)) {
    throw new Error(`App directory not found at ${appRootAbs}`);
  }
  
  env.projectRoot = projectRoot;
  process.env.EXPO_ROUTER_APP_ROOT = appRootRel;
  
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          'mime',
          '@expo/metro-runtime',
          'expo-router',
          'lucide-react-native',
        ],
      },
    },
    argv
  );

  config.resolve.alias = {
    ...config.resolve.alias,
    mime: require.resolve('mime/lite'),
    '@': projectRoot,
    'app': appRootAbs,
    '../../../../../app': appRootAbs,
    '../../../../app': appRootAbs,
    '../../../app': appRootAbs,
    '../../app': appRootAbs,
    '../app': appRootAbs,
  };

  config.resolve.modules = [
    path.resolve(projectRoot, 'node_modules'),
    'node_modules',
  ];

  config.resolve.extensions = [
    '.web.tsx',
    '.web.ts',
    '.web.jsx',
    '.web.js',
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
    '.json',
  ];

  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false,
    stream: false,
    buffer: false,
  };

  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    {
      module: /@expo[\\/]metro-runtime/,
      message: /export.*was not found/,
    },
    {
      module: /expo-router/,
      message: /Can't resolve/,
    },
  ];

  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      'process.env.EXPO_ROUTER_APP_ROOT': JSON.stringify(appRootRel),
      '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production'),
    }),
    new webpack.NormalModuleReplacementPlugin(
      /^(\.\.[\/\\])+app$/,
      (resource) => {
        resource.request = appRootAbs;
      }
    ),
  ];

  config.module = config.module || {};
  config.module.rules = config.module.rules || [];
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};
