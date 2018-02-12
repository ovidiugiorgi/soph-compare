module.exports = () => ({
  files: ['src/sophCompare.js'],

  tests: ['src/sophCompare.test.js'],

  env: {
    type: 'node',
    runner: 'node',
  },

  testFramework: 'jest',
});
