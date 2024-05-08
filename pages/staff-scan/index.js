const app = getApp();
Page({
  data: {
    scanImage: '',
  },

  onLoad() {
    this.fetchScanImage();
  },

  async fetchScanImage() {
    wx.showLoading()
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: `/api/v1/program/enterprise/qrcode?type=1`,
      method: 'POST',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    this.setData({
      scanImage: `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la/${res.data.data.url}`
    })
    wx.hideLoading()
  },


});
