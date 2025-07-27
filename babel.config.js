module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }],
    ['@babel/preset-typescript', {
      allowDeclareFields: true
    }],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs'
  ]
};