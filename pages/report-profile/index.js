Page({
  data: {
    month: '8',
    percentage: 76,
    reportList: [{
        date: '7.11',
        dateType: '日管控',
        total: 5,
        unqualifiedTotal: 0,
        submitTime: '09:00',
        submitUser: '花花',
        submitType: '门店提交',
        address: '成都市金牛区驷马桥街道横田大厦'
      },
      {
        date: '7.10',
        dateType: '日管控',
        total: 10,
        unqualifiedTotal: 3,
        submitTime: '09:00',
        submitUser: '花花',
        submitType: '门店提交',
        address: '成都市金牛区驷马桥街道横田大厦'
      },
      {
        date: '7.09',
        dateType: '日管控',
        total: 5,
        unqualifiedTotal: 0,
        submitTime: '09:00',
        submitUser: '花花',
        submitType: '门店提交',
        address: '成都市金牛区驷马桥街道横田大厦'
      },
      {
        date: '7.08',
        dateType: '日管控',
        total: 3,
        unqualifiedTotal: 2,
        submitTime: '09:00',
        submitUser: '花花',
        submitType: '门店提交',
        address: '成都市金牛区驷马桥街道横田大厦'
      },

    ],
    dateValue: [2023, 8],
    years: [{
        label: '2023年',
        value: '2023'
      },
      {
        label: '2022年',
        value: '2022'
      },
      {
        label: '2021年',
        value: '2021'
      },
    ],
    seasons: [{
        label: '1月',
        value: '1'
      },
      {
        label: '2月',
        value: '2'
      },
      {
        label: '3月',
        value: '3'
      },
      {
        label: '4月',
        value: '4'
      },
      {
        label: '5月',
        value: '5'
      },
      {
        label: '6月',
        value: '6'
      },
      {
        label: '7月',
        value: '7'
      },
      {
        label: '8月',
        value: '8'
      },
    ],
  },

  onLoad(options) {
    const {
      reportType = 'day'
    } = options || {}
    let tempReportList = this.data.reportList
    if (reportType === 'week') {
      wx.setNavigationBarTitle({
        title: '周排查',
      })
      tempReportList = tempReportList.slice(0, 3).map((item, index) => {
        return {
          ...item,
          date: `第${index + 1}周`,
          dateType: '周排查',
        }
      })
    } else if (reportType === 'month') {
      wx.setNavigationBarTitle({
        title: '月调度',
      })
      tempReportList = tempReportList.slice(1, 2).map((item) => {
        return {
          ...item,
          date: `${this.data.month}月`,
          dateType: '月调度',
        }
      })
    }
    this.setData({
      reportType,
      reportList: tempReportList,
    })
  },

  goDailyStats() {
    wx.redirectTo({
      url: '/pages/daily-stats/index',
    })
  },


  onPickerChange(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;
    let tempReportList = this.data.reportList
    let percentage = 76
    if (this.data.reportType === 'day') {
      tempReportList = this.data.reportList.map((item, index) => {
        return {
          ...item,
          date: `${value[1]}.${item.date.split('.')[1]}`
        }
      })
      percentage = 90
    } else if (this.data.reportType === 'month') {
      tempReportList = this.data.reportList.map((item, index) => {
        return {
          ...item,
          date: `${value[1]}月`
        }
      })
      percentage = 88
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
      dateVisible: true
    });
  },
})