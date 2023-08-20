// pages/report-profile/index.js
Page({


  data: {
    billList: [{
        date: '7.11',
        itemType: '进货单',
        title: 'XXXXXXXXX企业进货单',
        submitTime: '09:00',
        submitUser: '',
        status: 'pass',
        statusCN: '门店提交',
        rejectReason: '发票异常'
      },
      {
        date: '7.10',
        itemType: '进货单',
        title: 'XXXXXXXXX企业进货单',
        submitTime: '11:00',
        submitUser: '',
        status: 'approval',
        statusCN: '审批中',
        rejectReason: '发票异常'
      },
      {
        date: '7.09',
        itemType: '进货单',
        title: 'XXXXXXXXX企业进货单',
        submitTime: '09:00',
        submitUser: '花花',
        status: 'reject',
        statusCN: '审批未通过',
        rejectReason: '这是一条理由'
      },

    ]
  },


})