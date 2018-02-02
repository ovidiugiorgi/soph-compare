module.exports = () => ({
  files: ['sophComparator.js'],

  tests: ['sophComparator.test.js'],

  env: {
    type: 'node',
    runner: 'node',
  },

  testFramework: 'jest',
});
