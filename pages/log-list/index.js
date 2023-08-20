// pages/report-profile/index.js
Page({


  data: {
    visible: true,
    calendarValue: new Date().getTime(),
    minDate: new Date(2023, 6, 12).getTime(),
    maxDate: new Date().getTime(),
    logList: [{
        date: '7.11',
        dateType: '上午',
        logType: 'day',
        logTypeCN: '提交日报',
        submitTime: '09:00',
        submitUser: '花花',
        submitStatus: '门店提交',
        address: '成都市金牛区驷马桥街道横田大厦'
      },
      {
        date: '7.10',
        dateType: '上午',
        logType: 'week',
        logTypeCN: '生成周报',
        submitTime: '11:00',
        submitUser: '花花',
        submitStatus: '审批通过',
        address: '成都市金牛区驷马桥街道横田大厦'
      },
      {
        date: '7.09',
        dateType: '上午',
        logType: 'month',
        logTypeCN: '生成月报',
        submitTime: '09:00',
        submitUser: '花花',
        submitStatus: '审批通过',
        address: '成都市金牛区驷马桥街道横田大厦'
      },
      {
        date: '7.09',
        dateType: '上午',
        title: 'XXXXXXXXX企业进货单',
        submitTime: '09:00',
        submitUser: '花花',
        logType: 'bill',
        logTypeCN: '审批未通过',
        rejectReason: '这是一条理由'
      },


    ]
  },

  getItemRightClass(value) {
    console.log(value)
    return 'item-right'
  },

  handleSelect(value) {
    console.log(value)
  }
})