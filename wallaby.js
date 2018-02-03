module.exports = () => ({
  files: ['sophCompare.js'],

  tests: ['sophCompare.test.js'],

  env: {
    type: 'node',
    runner: 'node',
  },

  testFramework: 'jest',
});
