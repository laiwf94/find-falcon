module.exports = {
  rootDir: './',
  verbose: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      lines: 100,
      statement: 100,
      functions: 100
    }
  },
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/*-test.js',
    '!**/index.js',
    '!**/node_modules/**/*.*',
    '!**/webpack/**/*.*',
    '!<rootDir>/src/ui/**/*.*js',
    '!<rootDir>/src/setupTests.js',
    '!<rootDir>/src/app/services/LocaleService.js',
    '!<rootDir>/src/app/components/presentational/CheckboxDetail/*.*',
    '!<rootDir>/src/app/util/generalUtil.js',
    '!<rootDir>/src/app/components/ProductSelection/ProductSelection.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'html', 'lcov'],
  reporters: [
    'default',
  ],
  transform: {
    '^.+\\.scss$': 'identity-obj-proxy',
    '^.+\\.css$': 'identity-obj-proxy',
    '^.+\\.js$': './node_modules/react-scripts/config/jest/babelTransform.js',
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: [
    'node_modules'
  ],
  modulePaths: [
    '<rootDir>/node_modules'
  ],
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^.+\\.scss$': 'identity-obj-proxy',
    '^.+\\.css$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/'
  ],
  testMatch: ['**/__tests__/*-test.js'],
  setupFiles: ['<rootDir>/jest.setup.js']
};
