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
    wx.setStorageSync('shop_type', this.data.shop_type)
    wx.redirectTo({
      url: `/pages/create-shop/index`,
    });
  },
});