import { formatTime } from '../../utils/util';
const app = getApp();
Page({
  data: {
    noReadCount: 0,
    isTopShop: false,
    isShopOwner: false,
    // tabBarValue: 'enterprise-center',
    // list: [
    //   {
    //     value: 'all-center',
    //     icon: 'shop-5',
    //     ariaLabel: '工作台',
    //   },
    //   {
    //     value: 'submit-report',
    //     icon: 'add-circle',
    //   },
    //   {
    //     value: 'enterprise-center',
    //     icon: 'city-10',
    //     ariaLabel: '企业中心',
    //     badgeProps: {
    //       count: 25,
    //     },
    //   },
    // ],
  },

  async onLoad(options) {
    try {
      wx.showLoading();
      const { enterprise_id, employee_position } = wx.getStorageSync('enterpriseData');
      const isParentEnterprise = wx.getStorageSync('isParentEnterprise');
      this.setData({
        isTopShop: isParentEnterprise,
        isShopOwner: employee_position === 1,
      });
      const messageRes = await app.call({
        path: `/api/v2/program/station/list?enterprise_id=${enterprise_id}`,
      });
      const noReadCount = messageRes.data.data.reduce((acc, cur) => {
        return acc + Number(cur.is_read ? 0 : 1);
      }, 0);
      this.setData({
        noReadCount,
      });
    } finally {
      wx.hideLoading();
    }
  },

  handleteach() {
    wx.scanCode({
      success(res) {
        wx.redirectTo({
          url: `/${res.path}`,
        });
      },
    });
  },

  goReportList(e) {
    const { key = '1' } = e.currentTarget.dataset || {};
    if (key === 'bill') {
      wx.navigateTo({
        url: `/pages/bill-center/index`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/report-list/index?reportType=${key}&month=${`${new Date().getFullYear()}${String(
          new Date().getMonth() + 1,
        ).padStart(2, 0)}`}`,
      });
    }
  },

  goLogList() {
    const date = formatTime(new Date(), 'YYYYMMDD');
    wx.navigateTo({
      url: `/pages/log-list/index?date=${date}`,
    });
  },

  goBaoInfo() {
    wx.navigateTo({
      url: '/pages/bao-info/index',
    });
  },
  goWechat() {
    wx.navigateTo({
      url: '/pages/wechat-info/index',
    });
  },
  goEnterpriseList() {
    wx.setStorageSync('subEnterpriseId', '');
    wx.reLaunch({
      url: '/pages/enterprise-list/index',
    });
  },
  goMessageList() {
    wx.reLaunch({
      url: '/pages//index',
    });
  },
  goBillCenter() {
    wx.navigateTo({
      url: '/pages/bill-center/index',
    });
  },
  goQrCode() {
    wx.navigateTo({
      url: '/pages/staff-scan/index',
    });
  },
  goChangeShopOwner() {
    wx.navigateTo({
      url: '/pages/change-owner-qr/index',
    });
  },
  goBaoCheck() {
    wx.navigateTo({
      url: '/pages/check-bao/index',
    });
  },
  goTeachVideo() {
    wx.navigateTo({
      url: '/pages/teach-video/index',
    });
  },
  goStaffList() {
    wx.navigateTo({
      url: '/pages/staff-list/index',
    });
  },
  goHealth() {
    wx.navigateTo({
      url: '/pages/health-list/index',
    });
  },
  goAppointment() {
    wx.navigateTo({
      url: '/pages/appointment-list/index',
    });
  },
  goWord() {
    wx.navigateTo({
      url: '/pages/word-list/index',
    });
  },
  goDuty() {
    wx.navigateTo({
      url: '/pages/word-list-duty/index',
    });
  },
  goRegime() {
    wx.navigateTo({
      url: '/pages/word-list-regime/index',
    });
  },
  goCreateShopProfile() {
    wx.navigateTo({
      url: '/pages/enterprise-info/index',
    });
  },
  goMessageNotify() {
    wx.navigateTo({
      url: '/pages/message-notify/index',
    });
  },
  goMendian() {
    wx.navigateTo({
      url: '/pages/mendian-statis/index',
    });
  },

  onTabBarChange(e) {
    console.log(e);
    const { value } = e.detail;
    // this.setData({
    //   tabBarValue: value,
    // });
    if (value === 'all-center') {
      wx.redirectTo({
        url: `/pages/${value}/index`,
      });
    }
    wx.navigateTo({
      url: `/pages/${value}/index`,
    });
  },
});
