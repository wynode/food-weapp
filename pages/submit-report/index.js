import { formatTime } from '../../utils/util';

Page({
  data: {
    currentTime: '',
    intervalId: '',
    remainingHours: '',
    remainingMinutes: '',
    progress: 0,
    switchValue: false,
  },

  onLoad() {
    this.updateTime();
    const intervalId = setInterval(() => {
      this.updateTime();
    }, 20000);
    this.setData({
      intervalId,
    });
    const shopData = wx.getStorageSync('shop_data');
    if (shopData.shopTypeText === '餐饮服务') {
      this.setData({
        switchValue: true,
      });
    }
  },

  goCreateReport() {
    wx.navigateTo({
      url: `/pages/create-report/index`,
    });
  },

  goCreateReportQualify() {
    wx.navigateTo({
      url: `/pages/create-report/index?allqualified=true`,
    });
  },

  onUnload() {
    clearInterval(this.data.intervalId);
  },

  goCreateWeek() {
    wx.navigateTo({
      url: `/pages/daily-stats/index?pageType=week`,
    });
  },

  goCreateMonth() {
    wx.navigateTo({
      url: `/pages/daily-stats/index?pageType=month`,
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
        shopTypeText: '餐饮服务',
        shopTemplateText: '（日周月）餐饮服务通用模板',
      });
    } else {
      const shopData = wx.getStorageSync('shop_data');
      wx.setStorageSync('shop_data', {
        ...shopData,
        shopTypeText: '食品销售',
        shopTemplateText: '（日周月）食品销售通用模板',
      });
    }
  },

  updateTime() {
    const now = new Date();
    const currentTime = formatTime(now, 'HH:mm');
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
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
