module.exports = {
  stories: ['../stories/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-actions', 
    '@storybook/addon-links',
    '@storybook/addon-controls',
    '@storybook/preset-create-react-app',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      }
    }
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react']
        }
      }
    });
    return config;
  }
};
