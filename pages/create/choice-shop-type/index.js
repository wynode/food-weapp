// import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    shop_type: 'enterprise',
  },

  onLoad() {
    console.log(123)
  },


  onChange(e) {
    console.log(11)
    this.setData({
      shop_type: e.detail.value
    });
  },
});