Page({
  data: {
    tabBarValue: 'data-show',
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

    dataList: [
      {
        title: '餐饮',
        childrenList: [
          {
            title: '覆盖率',
            progress: 75,
            status: '',
            total: '共1000家',
          },
          {
            title: '整体合格率',
            progress: 40,
            status: 'warning',
          },
          {
            title: '填报率',
            progress: 100,
            status: 'success',
          },
        ],
      },
      {
        title: '食品销售',
        childrenList: [
          {
            title: '覆盖率',
            progress: 75,
            status: '',
            total: '共1000家',
          },
          {
            title: '整体合格率',
            progress: 40,
            status: 'warning',
          },
          {
            title: '填报率',
            progress: 100,
            status: 'success',
          },
        ],
      },
      {
        title: '食品生产',
        childrenList: [
          {
            title: '覆盖率',
            progress: 75,
            status: '',
            total: '共1000家',
          },
          {
            title: '整体合格率',
            progress: 40,
            status: 'warning',
          },
          {
            title: '填报率',
            progress: 100,
            status: 'success',
          },
        ],
      },
      {
        title: '特种生产',
        childrenList: [
          {
            title: '覆盖率',
            progress: 75,
            status: '',
            total: '共1000家',
          },
          {
            title: '整体合格率',
            progress: 40,
            status: 'warning',
          },
          {
            title: '填报率',
            progress: 100,
            status: 'success',
          },
        ],
      },
      {
        title: '工业生产',
        childrenList: [
          {
            title: '覆盖率',
            progress: 75,
            status: '',
            total: '共1000家',
          },
          {
            title: '整体合格率',
            progress: 40,
            status: 'warning',
          },
          {
            title: '填报率',
            progress: 100,
            status: 'success',
          },
        ],
      },
    ],
    progress: 10,
  },

  onLoad(options) {},

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

  onCityPicker() {
    this.setData({ cityVisible: true });
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
    this.setData({
      cityVisible: false,
      cityValue: value?.[0],
      cityText: value?.[0],
    });
  },
  onPickerCancel(e) {
    this.setData({
      cityVisible: false,
    });
  },
});
