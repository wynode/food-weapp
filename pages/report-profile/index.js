import {
  formatTime
} from '../../utils/util';
const app = getApp();
Page({
  data: {
    percentage: 0,
    dateType: '日管控',
    reportType: '1',
    reportProfileList: [],
    reportProfileDetail: {},
    reportList: [],
    dateVisible: false,
    dateValue: [String(new Date().getFullYear()), String(new Date().getMonth() + 1)],
    years: [{
        label: '2026年',
        value: '2026',
      },
      {
        label: '2025年',
        value: '2025',
      },
      {
        label: '2024年',
        value: '2024',
      },
      {
        label: '2023年',
        value: '2023',
      },
    ],
    seasons: [{
        label: '1月',
        value: '01',
      },
      {
        label: '2月',
        value: '02',
      },
      {
        label: '3月',
        value: '03',
      },
      {
        label: '4月',
        value: '04',
      },
      {
        label: '5月',
        value: '05',
      },
      {
        label: '6月',
        value: '06',
      },
      {
        label: '7月',
        value: '07',
      },
      {
        label: '8月',
        value: '08',
      },
      {
        label: '9月',
        value: '09',
      },
      {
        label: '10月',
        value: '10',
      },
      {
        label: '11月',
        value: '11',
      },
      {
        label: '12月',
        value: '12',
      },
    ],
  },

  onLoad(options) {
    const {
      reportType = '1', month = ''
    } = options || {};
    this.getReportProfileList(reportType, month);
    this.getReportList(reportType, month);
    this.setData({
      reportType,
      dateValue: [month.slice(0, 4), month.slice(-2)],
    });
  },

  async getReportProfileList(reportType, month) {
    try {
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportProfileRes = await app.call({
        path: `/api/v1/program/enterprise/report/stats/${month}/list?report_type=${reportType}`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const {
        detail,
        list
      } = reportProfileRes.data.data;
      const reportProfileList = list.map((item) => {
        return {
          ...item,
          dateCn: `${String(item.date).slice(-4,-2)}/${String(item.date).slice(-2)}`,
          submitTime: formatTime(item.created_at, 'HH:mm'),
          total: item.passed_count + item.unpassed_count,
          unqualifiedTotal: item.unpassed_count,
          submitUser: item.employee.name,
        }
      })

      const percentage = parseInt((detail.unpassed_count / (detail.unpassed_count + detail.passed_count || 1)) * 100);
      this.setData({
        reportProfileList: reportProfileList,
        reportProfileDetail: detail,
        percentage,
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

  async getReportList(reportType, month) {
    try {
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportProfileRes = await app.call({
        path: `/api/v1/program/enterprise/report/${month}/${reportType}/attachments`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const reportList = reportProfileRes.data;
      console.log(reportList);
      // this.setData({
      //   reportList,
      // });
    } catch {
      wx.showToast({
        title: '获取详情失败，请联系管理员',
      });
      wx.redirectTo({
        url: '/pages/all-center/index',
      });
    }
  },

  goDailyStats(e) {
    console.log(e)
    wx.redirectTo({
      url: '/pages/daily-stats/index',
    });
  },

  onPickerChange(e) {
    const {
      value
    } = e.detail;
    this.getReportProfileList(this.data.reportType, value.join(''));
    this.setData({
      dateVisible: false,
      dateValue: value,
    });
  },

  onPickerCancel() {
    this.setData({
      dateVisible: false,
    });
  },

  onSeasonPicker() {
    this.setData({
      dateVisible: true,
    });
  },

  onTabsChange() {
    this.getReportProfileList(this.data.reportType, this.data.dateValue.join(''));
    this.getReportList(this.data.reportType, this.data.dateValue.join(''));
  },

  onOneTabsChange(event) {
    this.setData({
      reportType: event.detail.value,
    });
    const dateOptions = {
      1: '日管控',
      2: '周排查',
      3: '月调度',
    };
    this.setData({
      dateType: dateOptions[event.detail.value],
    });
    this.getReportProfileList(event.detail.value, this.data.dateValue.join(''));
  },

  onSecondTabsChange(event) {
    this.setData({
      reportType: event.detail.value,
    });
    const dateOptions = {
      1: '日管控',
      2: '周排查',
      3: '月调度',
    };
    this.setData({
      dateType: dateOptions[event.detail.value],
    });
    this.getReportList(event.detail.value, this.data.dateValue.join(''));
  },

  handlePreview(url) {
    wx.downloadFile({
      url,
      success: function (res) {
        const filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功');
          },
        });
      },
    });
  },
});
