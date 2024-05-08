import {
  formatTime
} from '../../utils/util';
const app = getApp()
Page({
  data: {
    showDotArray: [],
    showDiffDotObject: {
      date: [],
      status: []
    },
    visible: true,
    calendarValue: '',
    minDate: new Date(2023, 6, 12).getTime(),
    maxDate: new Date().getTime(),
    logList: [],
    dateType: '日管控',
    reportType: '1',
    reportProfileList: [],

    mode: '',
    monthVisible: false,
    month: formatTime(new Date(), 'YYYY-MM'),
    monthText: '',
    monthSlice: '',
    monthFinished: '',
    weekFinished: '',

    // 指定选择区间起始值
    start: '2023-01-01 00:00:00',
    end: formatTime(new Date(), 'YYYY-MM-DD'),
  },

  onLoad(options) {
    const {
      date
    } = options || {}
    const year = String(date).slice(0, 4) || new Date().getFullYear
    const month = String(date).slice(4, 6) || new Date().getMonth + 1
    // `${year}/${month}/1`
    // `${year}/${month}/1`
    this.setData({
      calendarValue: new Date().getTime()
    })
    this.setData({
      month: `${year}-${month}`,
      monthText: `${year}-${month}`,
      // calendarValue: new Date().getTime()
    });
    this.getReportProfileList(year + month, formatTime(new Date(), 'YYYYMMDD'));
  },

  showPicker(e) {
    const {
      mode
    } = e.currentTarget.dataset;
    this.setData({
      mode,
      [`${mode}Visible`]: true,
    });
  },
  hidePicker() {
    const {
      mode
    } = this.data;
    this.setData({
      [`${mode}Visible`]: false,
    });
  },
  onConfirm(e) {
    const {
      value
    } = e.detail;
    const {
      mode
    } = this.data;

    console.log('confirm', value);

    this.setData({
      [mode]: value,
      [`${mode}Text`]: value,
      // calendarValue: new Date().getTime()
    });

    const monthD = value.split('-').join('')
    this.setData({
      calendarValue: new Date(String(value + '-01')).getTime()
    })
    this.getReportProfileList(monthD, value.split('-').concat(['01']).join(''))

    this.hidePicker();
  },

  onColumnChange(e) {
    console.log('pick', e.detail.value);
  },

  async getReportProfileList(month, date) {
    wx.showLoading()
    try {
      this.setData({
        reportProfileList: []
      });
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportProfileRes = await app.call({
        path: `/api/v1/program/enterprise/report/stats/${month}/list?report_type=1`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const {
        list,
      } = reportProfileRes.data.data;
      const showDiffDotObject = {}
      showDiffDotObject.date = list.map((item) => {
        return String(item.date)
      })
      showDiffDotObject.status = list.map((item) => {
        if (item && item.status === 4) {
          return 'skip'
        } else if (item.unpassed_count) {
          return 'no'
        } else {
          return 'yes'
        }
      })
      const reportProfileList = list.filter((item) => String(item.date) === date).map((item) => {
        return {
          ...item,
          isSkip: item.status === 4,
          isDeadline: new Date(item.deadline).getTime() < new Date(item.created_at).getTime(),
          dateCn: `${String(item.date).slice(-4, -2)}/${String(item.date).slice(-2)}`,
          submitTime: item.submit_at ? formatTime(item.submit_at, 'YYYY年MM月DD日 HH:mm:ss') : '',
          total: item.passed_count + item.unpassed_count,
          unqualifiedTotal: item.unpassed_count,
          submitUser: item.employee.name,
        };
      });
      const reportLogListRes = await app.call({
        path: `/api/v1/program/enterprise/report/stats/${month}/logs?date=${date}`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const {
        month_finished,
        week_finished,
      } = reportLogListRes.data.data;
      this.setData({
        reportProfileList: reportProfileList,
        showDiffDotObject,
        monthSlice: String(month).slice(-2),
        monthFinished: month_finished ? '已完成' : '未完成',
        weekFinished: week_finished ? '已完成' : '未完成'
      });
    } catch {
      wx.showToast({
        icon: 'error',
        title: '获取详情失败，请联系管理员',
      });
    }
    wx.hideLoading()
  },

  goDailyStats(e) {
    const {
      item
    } = e.currentTarget.dataset;
    if (item.isSkip) {
      return
    }
    wx.navigateTo({
      url: `/pages/daily-stats/index?date=${item.date}&report_type=${item.report_type}`,
    });
  },

  handleRectify(e) {
    const {
      date
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/rectify-list/index?date=${date}&report_type=${this.data.reportType}`,
    });
  },

  async handlePreviewCheckList(e) {
    wx.showLoading()
    const {
      date
    } = e.currentTarget.dataset;
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const reportProfileRes = await app.call({
      path: `/api/v1/program/enterprise/report/${date}/${this.data.reportType}/images?type=checklist`,
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    if (reportProfileRes.data.data.picture_path) {
      const url = `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la/${reportProfileRes.data.data.picture_path}`;
      wx.previewImage({
        current: url,
        urls: [url], // 需要预览的图片http链接列表
      });
    }
    wx.hideLoading()
    console.log(reportProfileRes);
  },


  handleSelect(e) {
    const {
      value
    } = e.detail;
    this.setData({
      month: formatTime(value, 'YYYY-MM'),
      monthText: formatTime(value, 'YYYY-MM'),
    })
    this.getReportProfileList(formatTime(value, 'YYYYMM'), formatTime(value, 'YYYYMMDD'))
  },
});
