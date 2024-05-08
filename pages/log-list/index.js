import {
  formatTime
} from '../../utils/util';
const app = getApp()
Page({
  data: {
    showDotArray: [],
    showDiffDotObject: { date: [], status: []},
    visible: true,
    month: '',
    calendarValue: new Date().getTime(),
    minDate: new Date(2023, 6, 12).getTime(),
    maxDate: new Date().getTime(),
    logList: [],
    monthFinished: '',
    weekFinished: '',
  },

  onLoad(options) {
    // const {
    //   date
    // } = options || {}
    // const year = String(date).slice(0, 4) || new Date().getFullYear
    // const month = String(date).slice(4, 6) || new Date().getMonth + 1
    // `${year}/${month}/1`
    // `${year}/${month}/1`
    this.setData({
      calendarValue: new Date().getTime()
    })
    this.getReportLogList(new Date().getTime());
  },

  async getReportLogList(dateTime) {
    try {
      wx.showLoading()
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const month = formatTime(dateTime, 'YYYYMM')
      const date = formatTime(dateTime, 'DD')
      const reportLogListRes = await app.call({
        path: `/api/v1/program/enterprise/report/stats/${month}/logs?date=${month}${date}`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const {
        list,
        month_logs,
        month_finished,
        week_finished,
      } = reportLogListRes.data.data;
      const reportTypeOptions = {
        1: '日管控',
        2: '周排查',
        3: '月调度',
      };
      const logList = list.map((item) => {
        return {
          ...item,
          date: formatTime(String(item.report_info ? item.report_info.date : item.date), 'MM/DD'),
          dateType: '',
          logType: 'day',
          logTypee: reportTypeOptions[item.report_info.report_type],
          logTypeCN: '提交日管控',
          submitTime: item.created_at ? formatTime(item.created_at, 'YYYY年MM月DD日 HH:mm:ss') : '',
          submitUser: item.employee ? item.employee.name : '',
          submitStatus: item.action,
          title: item.content,
        }
      })

      this.setData({
        logList,
        showDotArray: month_logs.map((item) => String(item)),
        month: month.slice(-2).startsWith('0') ? month.slice(-1) : month.slice(-2),
        monthFinished: month_finished ? '已完成' : '未完成',
        weekFinished: week_finished ? '已完成' : '未完成'
      });
      wx.hideLoading()
    } catch {
      wx.showToast({
        icon: 'none',
        title: '获取详情失败，请联系管理员',
      });
      // wx.reLaunch({
      //   url: '/pages/all-center/index',
      // });
    }
  },

  // 自定义函数，用于为节点添加特定的 class
  addSpecificClass: function (node, className) {
    const currentClass = node.className || '';
    // 使用 Set 数据结构确保不重复添加相同的 class
    const classSet = new Set(currentClass.split(' '));
    classSet.add(className);
    node.className = [...classSet].join(' ');
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
