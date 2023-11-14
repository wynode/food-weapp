import {
  formatTime
} from '../../utils/util';
const app = getApp()
Page({
  data: {
    visible: true,
    calendarValue: new Date().getTime(),
    minDate: new Date(2023, 6, 12).getTime(),
    maxDate: new Date().getTime(),
    logList: [
      // {
      //   date: formatTime(new Date(), 'M.DD'),
      //   dateType: '下午',
      //   logType: 'day',
      //   logTypeCN: '提交日管控',
      //   submitTime: '14:00',
      //   submitUser: '花花',
      //   submitStatus: '门店提交',
      //   address: '成都市金牛区驷马桥街道横田大厦',
      // },
      // {
      //   date: formatTime(new Date(), 'M.DD'),
      //   dateType: '上午',
      //   title: 'XXXXXXXXX企业进货单',
      //   submitTime: '09:00',
      //   submitUser: '花花',
      //   logType: 'bill',
      //   logTypeCN: '审批未通过',
      //   rejectReason: '这是一条理由',
      // },
    ],
  },

  onLoad() {
    this.getReportLogList(new Date().getTime());
  },

  async getReportLogList(dateTime) {
    try {
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const month = formatTime(dateTime, 'YYYYMM')
      const date = formatTime(dateTime, 'DD')
      const reportLogListRes = await app.call({
        path: `/api/v1/program/enterprise/report/stats/${month}/logs?date=${date}`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const {
        list
      } = reportLogListRes.data.data;
      const logList = list.map((item) => {
        return {
          ...item,
          date: formatTime(item.created_at, 'M.DD'),
          dateType: '',
          logType: 'day',
          logTypeCN: '提交日管控',
          submitTime: formatTime(item.created_at, 'HH.mm'),
          submitUser: item.employee ? item.employee.name : '',
          submitStatus: item.action,
          title: item.content,
        }
      })
      this.setData({
        logList,
      });
    } catch {
      wx.showToast({
        title: '获取详情失败，请联系管理员',
      });
      wx.redirectTo({
        url: '/pages/all-center/index',
      });
    }
  },

  getItemRightClass(value) {
    console.log(value);
    return 'item-right';
  },

  handleSelect(e) {
    const {
      value
    } = e.detail;
    // const tempLogList = this.data.logList.map((item) => {
    //   return {
    //     ...item,
    //     date: formatTime(value, 'MM.DD'),
    //   };
    // });
    // this.setData({
    //   logList: tempLogList,
    // });
    this.getReportLogList(value)
  },
});
