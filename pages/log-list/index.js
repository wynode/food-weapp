// pages/report-profile/index.js
import { formatTime } from '../../utils/util';
Page({
  data: {
    visible: true,
    calendarValue: new Date().getTime(),
    minDate: new Date(2023, 6, 12).getTime(),
    maxDate: new Date().getTime(),
    logList: [
      {
        date: formatTime(new Date(), 'M.DD'),
        dateType: '下午',
        logType: 'day',
        logTypeCN: '提交日管控',
        submitTime: '14:00',
        submitUser: '花花',
        submitStatus: '门店提交',
        address: '成都市金牛区驷马桥街道横田大厦',
      },
      {
        date: formatTime(new Date(), 'M.DD'),
        dateType: '上午',
        logType: 'week',
        logTypeCN: '生成周排查',
        submitTime: '11:00',
        submitUser: '花花',
        submitStatus: '审批通过',
        address: '成都市金牛区驷马桥街道横田大厦',
      },
      {
        date: formatTime(new Date(), 'M.DD'),
        dateType: '上午',
        logType: 'month',
        logTypeCN: '生成月调度',
        submitTime: '09:00',
        submitUser: '花花',
        submitStatus: '审批通过',
        address: '成都市金牛区驷马桥街道横田大厦',
      },
      {
        date: formatTime(new Date(), 'M.DD'),
        dateType: '上午',
        title: 'XXXXXXXXX企业进货单',
        submitTime: '09:00',
        submitUser: '花花',
        logType: 'bill',
        logTypeCN: '审批未通过',
        rejectReason: '这是一条理由',
      },
    ],
  },

  getItemRightClass(value) {
    console.log(value);
    return 'item-right';
  },

  handleSelect(e) {
    const { value } = e.detail;
    const tempLogList = this.data.logList.map((item) => {
      return {
        ...item,
        date: formatTime(value, 'M.DD'),
      };
    });
    this.setData({
      logList: tempLogList,
    });
  },
});
