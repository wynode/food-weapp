import Toast from 'tdesign-miniprogram/toast';

Page({
  data: {
    yyzz: '/assets/image/no_data.png',
    spaq: '/assets/image/no_data.png',
    rgk: '/assets/image/no_data.png',
    zpc: '/assets/image/no_data.png',
    ydd: '/assets/image/no_data.png',
    jkz: '/assets/image/no_data.png',
    businessCode: '',
  },

  onLoad(options) {
    const yyzz = wx.getStorageSync('上传营业执照');
    const spaq = wx.getStorageSync('上传许可证');
    const rgk = wx.getStorageSync('上传日调度制度');
    const zpc = wx.getStorageSync('上传周排查制度');
    const ydd = wx.getStorageSync('上传月调度制度');
    const shopData = wx.getStorageSync('shop_data');
    console.log(yyzz ? yyzz[0].url : this.data.yyzz);
    this.setData({
      yyzz: yyzz ? yyzz[0].url : this.data.yyzz,
      spaq: spaq ? spaq[0].url : this.data.spaq,
      rgk: rgk ? rgk[0].url : this.data.rgk,
      zpc: zpc ? zpc[0].url : this.data.zpc,
      ydd: ydd ? ydd[0].url : this.data.ydd,
      businessCode: shopData && shopData.businessCode ? shopData.businessCode : 'F6727SNDAUIWQNAO',
    });
  },
});
