// import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    value: 'label_1',
    list: [{
        value: 'label_1',
        icon: 'shop-5',
        ariaLabel: '首页'
      },
      {
        value: '添加报告',
        icon: 'add-circle',
        ariaLabel: '报告'
      },
      {
        value: 'label_3',
        icon: 'shop-5',
        ariaLabel: '聊天'
      },
    ],
  },

  onLoad() {
    console.log(123)
  },

  onChange(e) {
    this.setData({
      value: e.detail.value,
    });
  },

  goProfile(goType) {
    console.log(goType)
    // wx.navigateTo({
    //   url: `/pages/create/create-shop/index`,
    // });
  },
});