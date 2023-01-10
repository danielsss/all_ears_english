module.exports = {
  recursive: true,
  reporter: 'spec',
  spec: ['test/**/*.spec.ts'],
  require: [ 'ts-node/register' ],
  // loader: "ts-node/esm",
  exit: true
};
