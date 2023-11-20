import { formatTime } from '../../utils/util';
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
    years: [
      {
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
    seasons: [
      {
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
    key: 'detail',
  },

  onLoad(options) {
    const { reportType = '1', month = '' } = options || {};
    this.getReportProfileList(reportType, month);
    this.getReportList(reportType, month);
    this.setData({
      reportType,
      dateValue: [month.slice(0, 4), month.slice(-2)],
    });
  },

  async handleShowImage(e) {
    const { date } = e.currentTarget.dataset;
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const reportProfileRes = await app.call({
      path: `/api/v1/program/enterprise/report/${date}/${this.data.reportType}/images`,
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    console.log(reportProfileRes);
  },

  handleRectify(e) {
    const { date } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/rectify-list/index?date=${date}&report_type=${this.data.reportType}`,
    });
  },

  async getReportProfileList(reportType, month) {
    try {
      this.setData({ reportProfileList: [] });
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportProfileRes = await app.call({
        path: `/api/v1/program/enterprise/report/stats/${month}/list?report_type=${reportType}`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const { detail, list } = reportProfileRes.data.data;
      const reportProfileList = list.map((item) => {
        return {
          ...item,
          dateCn: `${String(item.date).slice(-4, -2)}/${String(item.date).slice(-2)}`,
          submitTime: formatTime(item.created_at, 'HH:mm'),
          total: item.passed_count + item.unpassed_count,
          unqualifiedTotal: item.unpassed_count,
          submitUser: item.employee.name,
        };
      });

      const percentage = parseInt((detail.unpassed_count / (detail.unpassed_count + detail.passed_count || 1)) * 100);
      this.setData({
        reportProfileList: reportProfileList,
        reportProfileDetail: detail,
        percentage,
      });
    } catch {
      wx.showToast({
        icon: 'error',
        title: '获取详情失败，请联系管理员',
      });
    }
  },

  async getReportList(reportType, month) {
    try {
      this.setData({ reportList: [] });
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportProfileRes = await app.call({
        path: `/api/v1/program/enterprise/report/${month}/${reportType}/attachments`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const { list } = reportProfileRes.data.data;
      const dateOptions = {
        1: '日',
        2: '周',
        3: '月',
      };
      const reportList = list.map((item) => {
        return {
          ...item,
          dateCn: `${String(item.date).slice(-4, -2)}/${String(item.date).slice(-2)}`,
          submitTime: formatTime(item.created_at, 'HH:mm'),
          showText: dateOptions[item.report_type],
        };
      });
      console.log(list, reportList);
      this.setData({
        reportList,
      });
    } catch (error) {
      console.log(error);
      wx.showToast({
        icon: 'error',
        title: '获取详情失败，请联系管理员',
      });
    }
  },

  goDailyStats(e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/daily-stats/index?date=${item.date}&report_type=${item.report_type}`,
    });
  },

  onPickerChange(e) {
    const { value } = e.detail;
    if (this.data.key === 'detail') {
      this.getReportProfileList(this.data.reportType, value.join(''));
    } else if (this.data.key === 'report') {
      this.getReportList(this.data.reportType, value.join(''));
    }
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

  onSeasonPicker(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({
      dateVisible: true,
      key,
    });
  },

  onTabsChange(e) {
    const { value } = e.detail;
    if (value === '1') {
      this.getReportProfileList(this.data.reportType, this.data.dateValue.join(''));
    } else if (value === '2') {
      this.getReportList(this.data.reportType, this.data.dateValue.join(''));
    }
    console.log(this.data.reportType, this.data.dateValue);
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
    console.log(event);
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
    console.log(event);
    this.getReportList(event.detail.value, this.data.dateValue.join(''));
  },

  async handlePreviewCheckList(e) {
    wx.showLoading()
    const { date } = e.currentTarget.dataset;
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const reportProfileRes = await app.call({
      path: `/api/v1/program/enterprise/report/${date}/${this.data.reportType}/images?type=checklist`,
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    if (reportProfileRes.data.data.picture_path) {
      const url = `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${reportProfileRes.data.data.picture_path}`;
      wx.previewImage({
        current: url,
        urls: [url], // 需要预览的图片http链接列表
      });
    }
    wx.hideLoading()
    console.log(reportProfileRes);
  },

  async handlePreviewDocument(e) {
    wx.showLoading();
    const { item } = e.currentTarget.dataset;
    if (item.document_picture_path) {
      const url = `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${item.document_picture_path}`;
      wx.previewImage({
        current: url,
        urls: [url], // 需要预览的图片http链接列表
      });
    } else {
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportProfileRes = await app.call({
        path: `/api/v1/program/enterprise/report/${item.date}/${this.data.reportType}/images?type=document`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      if (reportProfileRes.data.data.picture_path) {
        const url = `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${reportProfileRes.data.data.picture_path}`;
        wx.previewImage({
          current: url,
          urls: [url], // 需要预览的图片http链接列表
        });
      }
    }

    wx.hideLoading();
  },

  handleDownload(e) {
    wx.showLoading({
      title: '下载文档中',
    });
    const { item } = e.currentTarget.dataset;
    wx.downloadFile({
      url: `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${item.document_path}`,
      success: function (res) {
        const filePath = res.tempFilePath;
        wx.hideLoading();
        wx.openDocument({
          filePath: filePath,
          showMenu: true,
          success: function (res) {
            console.log('打开文档成功');
          },
        });
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          icon: 'error',
          title: '打开文档失败',
        });
      },
    });
  },
});
