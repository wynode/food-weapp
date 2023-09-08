Page({
  data: {
    tabBarValue: 'enterprise-center',
    list: [
      {
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
    shopList: [
      {
        name: '卷卷尾咖啡厅',
        progress: 80,
        standard: 50,
        address: '四川省成都市金牛区驷马桥街道16号附4',
      },
    ],
    shopList1: [],
    cityVisible: false,
    citys: [
      { label: '全部', value: '全部' },
      { label: '金牛区', value: '金牛区' },
      { label: '高新区', value: '高新区' },
      { label: '成华区', value: '成华区' },
      { label: '青羊区', value: '青羊区' },
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

  onChange({ detail }) {
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
    this.setData({ cityVisible: true });
  },

  onTabBarChange(e) {
    console.log(e);
    const { value } = e.detail;
    // this.setData({
    //   tabBarValue: value,
    // });
    if (value === 'submit-report') {
      wx.navigateTo({
        url: `/pages/${value}/index`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/${value}/index`,
      });
    }
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
    const { key = 'day' } = e.currentTarget.dataset || {};
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

  onDelete() {
    wx.showToast({
      title: '你点击了删除',
      icon: 'none',
    });
  },
  changeHandle(e) {
    const { value } = e.detail;
    this.setData({
      value,
    });
  },
  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;
    console.log(key);
    console.log('picker change:', e.detail);
    this.setData({
      cityVisible: false,
      cityValue: value?.[0],
      cityText: value?.[0],
    });
  },
  onPickerCancel(e) {
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      cityVisible: false,
    });
  },
});
