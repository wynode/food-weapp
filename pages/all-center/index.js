import Toast from 'tdesign-miniprogram/toast/index';
const app = getApp();
Page({
  data: {
    status: '1',
    is_bind: false,
    enterprise_id: '',
    enterprise_name: '',
    showWarnConfirm: false,
    dateValue: [String(new Date().getFullYear()), String(new Date().getMonth() + 1).padStart(2, '0')],
    years: [
      {
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
    seasons: [
      {
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
    list: [
      {
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
    clientOptions: [
      {
        label: '包保检查',
        value: '1',
      },
      {
        label: '员工扫码',
        value: '2',
      },
      {
        label: '离开企业',
        value: 'leave',
      },
      // {
      //   label: '包保端',
      //   value: '3'
      // },
    ],
  },

  handleClientPickerShow() {
    this.setData({
      clientVisible: true,
    });
  },

  async toggleStatus() {
    const enterpriseData = wx.getStorageSync('enterpriseData');
    if (this.data.status === '1') {
      await app.call({
        path: '/api/v1/program/enterprise/status',
        method: 'POST',
        data: {
          status: '127',
        },
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
    } else {
      await app.call({
        path: '/api/v1/program/enterprise/status',
        data: {
          status: '1',
        },
        method: 'POST',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
    }
    this.setData({
      status: this.data.status === '1' ? '127' : '1',
    });
  },

  onClientPickerChange(e) {
    const { value } = e.detail;
    this.setData({
      clientVisible: false,
      clientValue: value,
    });
    if (value[0] === '1') {
      wx.navigateTo({
        url: '/pages/check-bao/index',
      });
    } else if (value[0] === '2') {
      wx.navigateTo({
        url: '/pages/staff-scan/index',
      });
    } else if (value[0] === '3') {
      wx.navigateTo({
        url: '/pages/bao-info/index',
      });
    } else if (value[0] === 'leave') {
      const isTourists = wx.getStorageSync('isTourists');
      if (isTourists) {
        wx.setStorageSync('isTourists', false);
        wx.navigateTo({
          url: `/pages/create-enterprise/index`,
        });
        return;
      }
      this.setData({
        showWarnConfirm: true,
      });
    }
  },

  closeDialog() {
    this.setData({
      showWarnConfirm: false,
    });
  },

  async confirmDialog() {
    wx.showLoading();
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: `/api/v1/program/enterprise/leave`,
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
      method: 'DELETE',
      data: {
        enterprise_id: enterpriseData.enterprise_id,
      },
    });
    wx.hideLoading();
    if (res.data.code !== 400 || res.data.code !== 500) {
      wx.showToast({
        title: '解除企业成功',
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/create-enterprise/index',
        });
      }, 1000);
    } else {
      wx.showToast({
        icon: 'error',
        title: '解除企业失败',
      });
    }
  },

  onClientPickerCancel(e) {
    this.setData({
      clientVisible: false,
    });
  },

  async onLoad(options) {
    const isTourists = wx.getStorageSync('isTourists');
    if (isTourists) {
      this.setData({
        is_bind: true,
      });
      return;
    }
    if (options && options.date) {
      const date = String(options.date);
      this.setData({
        dateValue: [date.slice(0, 4), date.slice(4, 6)],
      });
      this.handelInit([date.slice(0, 4), date.slice(4, 6)]);
    } else if (options && options.enterprise_id && options.month) {
      const date = String(options.month);
      this.setData({
        dateValue: [date.slice(0, 4), date.slice(4, 6)],
      });
      this.setData({
        is_bind: true,
      });
      try {
        wx.showLoading();
        const { enterprise_id, enterprise_name, status } = wx.getStorageSync('enterpriseData');
        wx.setStorageSync('subEnterpriseId', enterprise_id);
        this.setData({
          enterprise_id,
          enterprise_name,
          status: String(status),
        });
        this.getReportStats(date, enterprise_id);
        wx.hideLoading();
      } catch (error) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '您还未绑定企业，请先绑定',
        });
        wx.navigateTo({
          url: `/pages/create-enterprise/index`,
        });
      }
    } else {
      this.handelInit(this.data.dateValue);
    }
  },

  async handelInit(dateValue) {
    try {
      wx.showLoading();
      // wx.setStorageSync('subEnterpriseId', '');
      const res = await app.call({
        path: '/api/v1/program/enterprise/relationship',
      });
      if (res.statusCode !== 200) {
        throw error;
      }
      const { is_bind, enterprise_id, enterprise_name } = res.data.data || {};
      if (!is_bind) {
        throw error;
      }
      this.setData({
        is_bind: true,
      });
      const enterpriseRes = await app.call({
        path: '/api/v1/program/enterprise',
        header: {
          'x-enterprise-id': enterprise_id,
        },
      });
      if (enterpriseRes.statusCode !== 200) {
        throw error;
      }
      const status = String(enterpriseRes.data.data.status);
      const parent_enterprise_id = String(enterpriseRes.data.data.parent_enterprise_id);
      const subEnterpriseId = wx.getStorageSync('subEnterpriseId');
      if (parent_enterprise_id === '0') {
        wx.setStorageSync('isParentEnterprise', true);
      } else {
        console.log(subEnterpriseId, 'xxx');
        if (!subEnterpriseId) {
          wx.setStorageSync('isParentEnterprise', false);
        }
      }
      wx.setStorageSync('enterpriseData', enterpriseRes.data.data);
      this.setData({
        enterprise_id: enterpriseRes.data.data.enterprise_id,
        enterprise_name: enterpriseRes.data.data.enterprise_name,
        status,
      });
      this.getReportStats(dateValue.join(''), enterprise_id);
      wx.hideLoading();
    } catch (error) {
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
    if (Object.keys(reportStats).length === 0) {
      this.setData({
        reportStats: {
          daily: {},
          weekly: {},
          monthly: {},
        },
      });
      return;
    }
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
    const { value } = e.detail;
    if (value === 'all-center') {
      wx.redirectTo({
        url: `/pages/${value}/index`,
      });
      return
    }
    if (value === 'submit-report') {
      const isTourists = wx.getStorageSync('isTourists');
      if (isTourists) {
        wx.navigateTo({
          url: `/pages/create-report/index`,
        });
        return;
      }
    }
    wx.navigateTo({
      url: `/pages/${value}/index`,
    });
  },

  goProfile(e) {
    const { key = '1' } = e.currentTarget.dataset || {};
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

  goCalendarList() {
    wx.navigateTo({
      url: `/pages/calendar-list/index?date=${this.data.dateValue.join('')}`,
    });
  },

  goMonitor() {
    wx.navigateTo({
      url: `/pages/enterprise-profile/index`,
    });
  },

  onPickerChange(e) {
    const { value } = e.detail;
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
