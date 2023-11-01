import { formatTime } from '../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';
const app = getApp();
Page({
  data: {
    isOvertime: true,
    currentTime: '',
    intervalId: '',
    remainingHours: '',
    remainingMinutes: '',
    progress: 0,
    switchValue: false,
    waitlist: [{}],
    reportTypeMap: {
      1: '日管控',
      2: '周排查',
      3: '月调度',
    },
  },

  async onLoad() {
    try {
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
      const { waitlist } = res.data.data;
      if (waitlist.length === 0) {
        throw error;
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
        const text = remainingDays
          ? `${Math.abs(remainingDays)}天${Math.abs(remainingHours)}小时`
          : `${Math.abs(remainingHours)}小时${Math.abs(remainingMinutes)}分钟`;
        return {
          ...item,
          showDate: date.slice(0, 4) + '年' + date.slice(4, 6) + '月' + date.slice(6, 8) + '日',
          remain: `${remainingHours > 0 ? '剩余' : '已超时'}${text}`,
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
      this.setData({
        intervalId,
        waitlist: filterwait,
      });
    } catch {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '暂无需要提交的报告',
      });
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/all-center/index`,
        });
      }, 1000);
    }
  },

  async goCreateReport() {
    wx.navigateTo({
      url: `/pages/create-report/index`,
    });
  },

  goCreateReportQualify() {
    wx.navigateTo({
      url: `/pages/create-report/index?allqualified=true`,
    });
  },

  async onUnload() {
    clearInterval(this.data.intervalId);
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
    const currentTime = formatTime(now, 'HH:mm');
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
