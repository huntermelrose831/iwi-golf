module.exports = {
  apps: [
    {
      name: 'iwi-golf-api',
      cwd: __dirname,
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
