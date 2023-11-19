import Toast from 'tdesign-miniprogram/toast/index';
const app = getApp();
Page({
  data: {
    status: '1',
    enterprise_id: '',
    enterprise_name: '',
    dateValue: [String(new Date().getFullYear()), String(new Date().getMonth() + 1)],
    years: [{
        label: '2026年',
        value: '2026',
      },
      {
        label: '2025年',
        value: '2025',
      },
      {
        label: '2024年',
        value: '2024',
      },
      {
        label: '2023年',
        value: '2023',
      },
    ],
    seasons: [{
        label: '1月',
        value: '01',
      },
      {
        label: '2月',
        value: '02',
      },
      {
        label: '3月',
        value: '03',
      },
      {
        label: '4月',
        value: '04',
      },
      {
        label: '5月',
        value: '05',
      },
      {
        label: '6月',
        value: '06',
      },
      {
        label: '7月',
        value: '07',
      },
      {
        label: '8月',
        value: '08',
      },
      {
        label: '9月',
        value: '09',
      },
      {
        label: '10月',
        value: '10',
      },
      {
        label: '11月',
        value: '11',
      },
      {
        label: '12月',
        value: '12',
      },
    ],
    tabBarValue: 'all-center',
    list: [{
        value: 'all-center',
        icon: 'shop-5',
        ariaLabel: '工作台',
      },
      {
        value: 'submit-report',
        icon: 'add-circle',
        ariaLabel: '立即填报',
      },
      {
        value: 'enterprise-center',
        icon: 'city-10',
        ariaLabel: '企业中心',
      },
    ],
    reportStats: {
      daily: {},
      weekly: {},
      monthly: {},
    },

    clientVisible: false,
    clientValue: '1',
    clientOptions: [{
        label: '商户端',
        value: '1'
      },
      {
        label: '监管端',
        value: '2'
      },
      {
        label: '包保端',
        value: '3'
      },
    ],
  },

  handleClientPickerShow() {
    this.setData({
      clientVisible: true
    });
  },

  async toggleStatus() {
    const enterpriseData = wx.getStorageSync('enterpriseData')
    if (this.data.status === '1') {
      await app.call({
        path: '/api/v1/program/enterprise/status',
        method: 'POST',
        data: {
          status: '127'
        },
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });

    } else {
      await app.call({
        path: '/api/v1/program/enterprise/status',
        data: {
          status: '1'
        },
        method: 'POST',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
    }
    this.setData({
      status: this.data.status === '1' ? '127' : '1'
    })
  },

  onClientPickerChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      clientVisible: false,
      clientValue: value,
    });
    if (value[0] === '1') {
      wx.reLaunch({
        url: '/pages/all-center/index',
      });
    } else if (value[0] === '2') {
      wx.navigateTo({
        url: '/pages/shop-list/index',
      });
    } else if (value[0] === '3') {
      wx.navigateTo({
        url: '/pages/bao-info/index',
      });
    }
  },

  onClientPickerCancel(e) {
    this.setData({
      clientVisible: false,
    });
  },

  async onLoad() {
    this.handelInit();
  },

  async handelInit() {
    try {
      wx.showLoading()
      console.log(111);
      const res = await app.call({
        path: '/api/v1/program/enterprise/relationship',
      });
      if (res.statusCode !== 200) {
        throw error;
      }
      const {
        is_bind,
        enterprise_id,
        enterprise_name,
      } = res.data.data || {};
      if (!is_bind) {
        throw error;
      }
      const enterpriseRes = await app.call({
        path: '/api/v1/program/enterprise',
        header: {
          'x-enterprise-id': enterprise_id,
        },
      });
      if (enterpriseRes.statusCode !== 200) {
        throw error;
      }
      const status = String(enterpriseRes.data.data.status)
      console.log(status)
      wx.setStorageSync('enterpriseData', enterpriseRes.data.data);
      this.setData({
        enterprise_id,
        enterprise_name,
        status,
      });
      this.getReportStats(this.data.dateValue.join(''), enterprise_id);
      wx.hideLoading()
    } catch (error) {
      console.dir(error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '您还未绑定企业，请先绑定',
      });
      wx.navigateTo({
        url: `/pages/create-enterprise/index`,
      });
    }
  },

  async getReportStats(month, enterprise_id) {
    const reportRes = await app.call({
      path: `/api/v1/program/enterprise/report/stats/${month}`,
      header: {
        'x-enterprise-id': enterprise_id,
      },
    });
    const reportStats = reportRes.data.data;
    reportStats.percentage = parseInt(
      (reportStats.daily.submit_report_count / reportStats.daily.total_report_count) * 100,
    );
    reportStats.total =
      reportStats.daily.submit_report_count +
      reportStats.monthly.submit_report_count +
      reportStats.weekly.submit_report_count;

    this.setData({
      reportStats,
    });
  },

  onTabBarChange(e) {
    const {
      value
    } = e.detail;
    if (value === 'submit-report') {
      wx.navigateTo({
        url: `/pages/${value}/index`,
      });
    }
    wx.navigateTo({
      url: `/pages/${value}/index`,
    });
  },

  goProfile(e) {
    const {
      key = '1'
    } = e.currentTarget.dataset || {};
    if (key === 'bill') {
      wx.navigateTo({
        url: `/pages/bill-center/index`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/report-list/index?reportType=${key}&month=${this.data.dateValue.join('')}`,
      });
    }
  },

  goLogList() {
    wx.navigateTo({
      url: `/pages/log-list/index`,
    });
  },

  goMonitor() {
    wx.navigateTo({
      url: `/pages/enterprise-profile/index`,
    });
  },

  onPickerChange(e) {
    const {
      value
    } = e.detail;
    console.log(value);
    this.getReportStats(value.join(''), this.data.enterprise_id);
    this.setData({
      dateVisible: false,
      dateValue: value,
    });
  },

  onPickerCancel() {
    this.setData({
      dateVisible: false,
    });
  },

  onSeasonPicker() {
    this.setData({
      dateVisible: true,
    });
  },
});
