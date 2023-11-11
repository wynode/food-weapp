Page({
  data: {
    dateValue: [2023, '本'],
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

  onPickerChange(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;

    console.log('picker change:', e.detail);
    const tempBillList = this.data.billList.map((item, index) => {
      return {
        ...item,
        date: `${value[1]}.${item.date.split('.')[1]}`,
      }
    })
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
      billList: tempBillList,
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

  onCityPicker() {
    this.setData({
      cityVisible: true
    });
  },

  onSeasonPicker() {
    this.setData({
      dateVisible: true
    });
  },
})