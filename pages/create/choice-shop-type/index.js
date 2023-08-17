// import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    shop_type: 'personal',
  },

  onLoad() {
    console.log(123)
  },

  onChange(e) {
    this.setData({
      shop_type: e.detail.value
    });
  },

  goNext(e) {
    wx.navigateTo({
      url: `/pages/create/create-shop/index`,
    });
  },
});