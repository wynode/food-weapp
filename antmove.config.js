module.exports = {
  env: 'production',
  type: 'wx-alipay',
  fromId: 1100,
  isReport: true,
  input: './',
  output: '..\\alipay\\weapp',
  hooks: {
    appJson: function plugin(appJson) {
      return appJson;
    },
  },
  babel: {
    plugins: function () {
      return [];
    },
  },
  plugins: [],
};
