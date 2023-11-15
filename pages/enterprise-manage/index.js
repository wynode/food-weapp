Page({
  data: {
    value: 0,
    enterpriseList: [{
        name: '金牛区卷卷尾咖啡馆',
        address: '四川省成都市金牛区驷马桥街道16号四栋20门'
      },
      {
        name: 'MDL女装',
        address: '四川省成都市金牛区驷马桥街道16号四栋20门'
      },
      {
        name: 'MDL女装',
        address: '四川省成都市金牛区驷马桥街道16号四栋20门'
      },
    ]
  },
  onChange(e) {
    this.setData({
      value: e.detail.value
    });
    wx.navigateTo({
      url: `/pages/enterprise-center/index?id=${this.data.value}`,
    })
  },

  newEnterprise() {
    wx.navigateTo({
      url: '/pages/create-enterprise/index',
    })
  }
})
