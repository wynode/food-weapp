import Toast from 'tdesign-miniprogram/toast/index';
const app = getApp();

Page({
  data: {
    enterprise_name: '花花的小店',
    dateValue: [2023, '本'],
    years: [{
        label: '2023年',
        value: '2023',
      },
      {
        label: '2022年',
        value: '2022',
      },
      {
        label: '2021年',
        value: '2021',
      },
    ],
    seasons: [{
        label: '1月',
        value: '1',
      },
      {
        label: '2月',
        value: '2',
      },
      {
        label: '3月',
        value: '3',
      },
      {
        label: '4月',
        value: '4',
      },
      {
        label: '5月',
        value: '5',
      },
      {
        label: '6月',
        value: '6',
      },
      {
        label: '7月',
        value: '7',
      },
      {
        label: '8月',
        value: '8',
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
      },
      {
        value: 'enterprise-manage',
        icon: 'city-10',
        ariaLabel: '企业中心',
      },
    ],
  },

  async onLoad() {
    const res = await app.call({
      path: '/api/v1/program/enterprise/relationship',
    });
    console.log(res)
    // const { is_bind, enterprise_id, enterprise_name } = res.data || {};
    const {
      is_bind = true, enterprise_id = 1, enterprise_name = 'wynode'
    } = res.data || {};
    if (!is_bind) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '您还未绑定企业，请先绑定',
      });
      wx.redirectTo({
        url: `/pages/create-enterprise/index`,
      });
    } else {
      this.setData({
        enterprise_id,
        enterprise_name,
      });
    }
  },

  onTabBarChange(e) {
    const {
      value
    } = e.detail;
    wx.navigateTo({
      url: `/pages/${value}/index`,
    });
  },

  goProfile(e) {
    const {
      key = 'day'
    } = e.currentTarget.dataset || {};
    if (key === 'bill') {
      wx.navigateTo({
        url: `/pages/bill-center/index`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/report-profile/index?reportType=${key}`,
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
      key
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;
    let tempReportList = this.data.reportList;
    let percentage = 76;
    if (this.data.reportType === 'day') {
      tempReportList = this.data.reportList.map((item, index) => {
        return {
          ...item,
          date: `${value[1]}.${item.date.split('.')[1]}`,
        };
      });
      percentage = 90;
    } else if (this.data.reportType === 'month') {
      tempReportList = this.data.reportList.map((item, index) => {
        return {
          ...item,
          date: `${value[1]}月`,
        };
      });
      percentage = 88;
    }
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
      reportList: tempReportList,
      percentage: percentage,
    });
  },

  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onSeasonPicker() {
    this.setData({
      dateVisible: true,
    });
  },
});
