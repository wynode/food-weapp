import {
  formatTime
} from '../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';
const app = getApp();
Page({
  data: {
    dialoge: '',
    isOvertime: true,
    currentTime: '',
    intervalId: '',
    remainingHours: '',
    remainingMinutes: '',
    progress: 0,
    switchValue: false,
    showAllQualify: true,
    waitlist: [],
    firstWait: {},
    reportTypeMap: {
      1: '日管控',
      2: '周排查',
      3: '月调度',
    },
  },

  onLoad() {
    this.getList()
  },

  async getList() {
    try {
      wx.showLoading();
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const res = await app.call({
        path: '/api/v1/program/enterprise/report/waitlist',
        method: 'GET',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      if (res.statusCode !== 200) {
        throw error;
      }
      const {
        waitlist
      } = res.data.data;
      wx.hideLoading();
      if (waitlist.length === 0) {
        if (this.data.showWarnConfirm) {
          this.setData({
            showWarnConfirm: false
          })
          wx.navigateTo({
            url: '/pages/submit-report/index',
          })
        }
        Toast({
          context: this,
          selector: '#t-toast',
          message: '暂无需要提交的报告',
        });
        return
      }
      if (this.data.showWarnConfirm) {
        this.setData({
          showWarnConfirm: false
        })
      }
      const filterwait = waitlist.map((item) => {
        const now = new Date();
        const targetTime = new Date(formatTime(item.deadline, 'YYYY/MM/DD HH:mm:ss'));
        const diff = targetTime.getTime() - now.getTime();
        const remainingDays = parseInt(diff / (1000 * 60 * 60 * 24));
        let remainingHours = '';
        if (remainingDays) {
          remainingHours = parseInt((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        } else {
          remainingHours = parseInt(diff / (1000 * 60 * 60));
        }
        const remainingMinutes = parseInt((diff % (1000 * 60 * 60)) / (1000 * 60));
        const date = String(item.date);
        const text = remainingDays ?
          `${Math.abs(remainingDays)}天${Math.abs(remainingHours)}小时` :
          `${Math.abs(remainingHours)}小时${Math.abs(remainingMinutes)}分钟`;
        return {
          ...item,
          showDate: date.slice(0, 4) + '年' + date.slice(4, 6) + '月' + date.slice(6, 8) + '日',
          remain: `${remainingHours >= 0 ? '剩余' : '已超时'}${text}`,
        };
      });
      if (filterwait[0].remain.includes('已超时')) {
        this.setData({
          isOvertime: true,
        });
      }
      this.updateTime(filterwait[0].deadline);
      const intervalId = setInterval(() => {
        this.updateTime(filterwait[0].deadline);
      }, 1000);
      wx.setStorageSync('reportData', filterwait[0]);
      let showAllQualify = true;
      if (filterwait[0].report_type === 3) {
        showAllQualify = false;
      }
      if (enterpriseData.business_type === 2 && filterwait[0].report_type === 2) {
        showAllQualify = false;
      }
      this.setData({
        intervalId,
        firstWait: filterwait[0],
        waitlist: filterwait,
        showAllQualify,
      });
    } catch {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '暂无需要提交的报告',
      });
      // setTimeout(() => {
      //   wx.navigateTo({
      //     url: `/pages/all-center/index`,
      //   });
      // }, 1000);
    }
  },

  async handleSkip() {
    wx.showLoading()
    const {
      item
    } = this.data.dialoge.currentTarget.dataset
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: '/api/v1/program/enterprise/report/skip',
      method: 'POST',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
      showWarnConfirm: false,
      data: {
        date: item.date,
        report_type: item.report_type,
      }
    });
    if (res.data.code === 0) {
      this.getList()
    }
  },

  handleClickWaitList(e) {
    const {
      item
    } = e.currentTarget.dataset;
    const enterpriseData = wx.getStorageSync('enterpriseData')
    const data = this.data.waitlist;
    // 使用findIndex找到要移动的项在数组中的索引
    const index = data.findIndex((item1) => item1.report_id === item.report_id);

    // 检查找到的索引是否有效
    if (index !== -1) {
      // 使用splice将该项移动到数组最前面
      const itemToMove = data.splice(index, 1)[0];
      data.unshift(itemToMove);

      // 现在，data数组中的第一项就是刚刚移动的项
      console.log(data);
    } else {
      console.log('未找到要移动的项');
    }
    if (item.remain.includes('已超时')) {
      this.setData({
        isOvertime: true,
      });
    }
    this.updateTime(item.deadline);
    const intervalId = setInterval(() => {
      this.updateTime(item.deadline);
    }, 1000);
    wx.setStorageSync('reportData', item);
    let showAllQualify = true;
    if (item.report_type === 3) {
      showAllQualify = false;
    }
    if (enterpriseData.business_type === 2 && item.report_type === 2) {
      showAllQualify = false;
    }
    this.setData({
      intervalId,
      firstWait: data[0],
      showAllQualify,
    });
  },

  async goCreateReport() {
    wx.showLoading()
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const reportData = wx.getStorageSync('reportData');
    const {
      business_type,
      enterprise_id
    } = enterpriseData;
    if (enterpriseData.business_type === 2 && (reportData.report_type === 2 || reportData.report_type === 3)) {
      const ress = await app.call({
        path: `/api/v1/program/enterprise/report/getFailedReports?report_type=${reportData.report_type}&date=${reportData.date}`,
        method: 'GET',
        header: {
          'x-enterprise-id': enterprise_id,
        },
      });
      if (ress.data.data.list && ress.data.data.list.length) {
        const checkListDat = ress.data.data.list.reduce((acc, cur) => {
          return acc.concat(cur.unpassed_items || [])
        },[])
        wx.setStorageSync('checkListData', checkListDat)
        wx.navigateTo({
          url: `/pages/create-report/index?checkList=yes&isCheckedFalse=yes`,
        });
        return
      } else {
        if (reportData.report_type === 2) {
          wx.navigateTo({
            url: `/pages/create-report/index`,
          });
          return
        }
        wx.navigateTo({
          url: `/pages/create-report2/index`,
        });
        return
      }
    }
    const res = await app.call({
      path: `/api/v1/program/enterprise/report/template?report_type=${reportData.report_type}&business_type=${business_type}`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterprise_id,
      },
    });
    const {
      has_template
    } = res.data.data;
    wx.hideLoading()
    // if (enterpriseData.business_type === 2 && this.data.firstWait.report_type === 3) {
    //   wx.navigateTo({
    //     url: `/pages/create-report2/index`,
    //   });
    // } else {
    //   console.log(has_template);

    // }
    if (has_template) {
      wx.navigateTo({
        url: `/pages/create-report/index`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/create-report-pre/index`,
      });
    }
  },

  async goCreateReportQualify() {
    wx.showLoading()
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const reportData = wx.getStorageSync('reportData');
    const {
      business_type,
      enterprise_id
    } = enterpriseData;
    const res = await app.call({
      path: `/api/v1/program/enterprise/report/template?report_type=${reportData.report_type}&business_type=${business_type}`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterprise_id,
      },
    });
    const {
      has_template
    } = res.data.data;
    wx.hideLoading()
    if (has_template) {
      wx.navigateTo({
        url: `/pages/create-report/index?allqualified=yes`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/create-report-pre/index?allqualified=yes`,
      });
    }
  },

  async onUnload() {
    clearInterval(this.data.intervalId);
  },

  showDialog(e) {
    this.setData({
      dialoge: e,
      showWarnConfirm: true
    });
  },

  closeDialog() {
    this.setData({
      showWarnConfirm: false
    });
  },

  goCreateWeek() {
    wx.navigateTo({
      url: `/pages/week-check1/index?pageType=week`,
    });
  },

  goCreateMonth() {
    wx.navigateTo({
      url: `/pages/week-check1/index?pageType=month`,
    });
  },

  handleSwitchChange(e) {
    this.setData({
      switchValue: e.detail.value,
    });
    if (e.detail.value) {
      const shopData = wx.getStorageSync('shop_data');
      wx.setStorageSync('shop_data', {
        ...shopData,
        businessTypeText: '餐饮服务',
        shopTemplateText: '（日周月）餐饮服务通用模板',
      });
    } else {
      const shopData = wx.getStorageSync('shop_data');
      wx.setStorageSync('shop_data', {
        ...shopData,
        businessTypeText: '食品销售',
        shopTemplateText: '（日周月）食品销售通用模板',
      });
    }
  },

  updateTime(deadline) {
    const now = new Date();
    const currentTime = formatTime(now.getTime(), 'HH:mm');
    const targetTime = new Date(formatTime(deadline, 'YYYY/MM/DD HH:mm:ss'));
    const diff = targetTime.getTime() - now.getTime();
    const remainingHours = Math.floor(diff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const progress = Math.floor(((24 - remainingHours) / 24) * 100);
    this.setData({
      currentTime,
      remainingHours,
      remainingMinutes,
      progress,
    });
  },
});
