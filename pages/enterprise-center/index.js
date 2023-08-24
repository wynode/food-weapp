Page({
  data: {
    tabBarValue: 'enterprise-center',
    list: [{
        value: 'report-list',
        icon: 'shop-5',
        ariaLabel: '工作台',
      },
      {
        value: 'submit-report',
        icon: 'add-circle',
      },
      {
        value: 'enterprise-center',
        icon: 'city-10',
        ariaLabel: '企业中心',
        badgeProps: {
          count: 25
        },
      },
    ],
  },

  onLoad(options) {

  },

  goReportList() {
    wx.navigateTo({
      url: '/pages/daily-stats/index',
    })
  },
  goBillCenter() {
    wx.navigateTo({
      url: '/pages/bill-center/index',
    })
  },
  goStaffList() {
    wx.navigateTo({
      url: '/pages/staff-list/index',
    })
  },
  goEnterpriseManage() {
    wx.navigateTo({
      url: '/pages/enterprise-manage/index',
    })
  },
  goCreateShopProfile() {
    wx.navigateTo({
      url: '/pages/create-shop-profile/index?isEnter=true',
    })
  },
  goMessageNotify() {
    wx.navigateTo({
      url: '/pages/message-notify/index',
    })
  },

  onTabBarChange(e) {
    console.log(e)
    const {
      value
    } = e.detail
    // this.setData({
    //   tabBarValue: value,
    // });
    if (value === 'submit-report') {
      wx.navigateTo({
        url: `/pages/${value}/index`,
      });
    } else {
      wx.redirectTo({
        url: `/pages/${value}/index`,
      });
    }
  },
})