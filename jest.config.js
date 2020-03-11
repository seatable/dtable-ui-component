const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  roots: ["<rootDir>/tests/"],
  setupFiles: ["<rootDir>/tests/setup.js"],
  testMatch: [ "<rootDir>/tests/**/(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(css|less)$': '<rootDir>/config/jest/cssTransform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
  ],
}