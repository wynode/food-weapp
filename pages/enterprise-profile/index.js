Page({
  data: {
    tabBarValue: 'enterprise-center',
    dateVisible: false,
    dateValue: [String(new Date().getFullYear()), String(new Date().getMonth() + 1).padStart(2, '0')],
    dateText: '本',
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
    list: [{
        value: 'data-show',
        icon: 'chart-line-multi',
        ariaLabel: '数据统计',
      },
      // {
      //   value: 'submit-report',
      //   icon: 'add-circle',
      // },
      {
        value: 'shop-list',
        icon: 'city-10',
        ariaLabel: '商铺列表',
      },
    ],
    shopList: [{
      name: '卷卷尾咖啡厅',
      progress: 80,
      standard: 50,
      address: '四川省成都市金牛区驷马桥街道16号附4',
    }, ],
    shopList1: [],
    cityVisible: false,
    citys: [{
        label: '全部',
        value: '全部'
      },
      {
        label: '金牛区',
        value: '金牛区'
      },
      {
        label: '高新区',
        value: '高新区'
      },
      {
        label: '成华区',
        value: '成华区'
      },
      {
        label: '青羊区',
        value: '青羊区'
      },
    ],
    cityText: '全部',
    cityValue: '',
    value: '',
  },
  onLoad(options) {
    this.setData({
      shopList1: this.data.shopList,
    });
  },

  onChange({
    detail
  }) {
    const shops = this.data.shopList;
    if (detail.value === '') {
      return this.setData({
        shopList1: shops,
      });
    }
    const filterArray = shops.filter((item) => {
      return item?.name?.includes(detail.value);
    });
    this.setData({
      shopList1: filterArray,
    });
  },

  onCityPicker() {
    this.setData({
      cityVisible: true
    });
  },


  onSeasonPicker() {
    this.setData({
      dateVisible: true,
    });
  },


  onPickerChange(e) {
    const {
      value
    } = e.detail;
    // this.getReportProfileList(this.data.reportType, value.join(''));
    console.log(value)
    this.setData({
      dateVisible: false,
      dateValue: value,
      dateText: value[1],
    });
  },

  onPickerCancel() {
    this.setData({
      dateVisible: false,
    });
  },


  onTabBarChange(e) {
    console.log(e);
    const {
      value
    } = e.detail;
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

  goEnterprise() {
    wx.navigateTo({
      url: '/pages/enterprise-info/index',
    });
  },

  goCertInfo() {
    wx.navigateTo({
      url: '/pages/cert-info/index',
    });
  },

  goBao() {
    wx.navigateTo({
      url: '/pages/bao-info/index',
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
        url: `/pages/report-list/index?reportType=${key}`,
      });
    }
  },

  onDelete() {
    wx.showToast({
      title: '你点击了删除',
      icon: 'none',
    });
  },
  changeHandle(e) {
    const {
      value
    } = e.detail;
    this.setData({
      value,
    });
  },
  // onPickerChange(e) {
  //   const {
  //     key
  //   } = e.currentTarget.dataset;
  //   const {
  //     value
  //   } = e.detail;
  //   console.log(key);
  //   console.log('picker change:', e.detail);
  //   this.setData({
  //     cityVisible: false,
  //     cityValue: value?.[0],
  //     cityText: value?.[0],
  //   });
  // },
  // onPickerCancel(e) {
  //   console.log(e, '取消');
  //   console.log('picker1 cancel:');
  //   this.setData({
  //     cityVisible: false,
  //   });
  // },
});
