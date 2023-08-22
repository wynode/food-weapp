import {
  formatTime
} from '../../utils/util'

Page({
  data: {
    currentTime: '',
    intervalId: '',
    remainingHours: '',
    remainingMinutes: '',
    progress: 0,
  },

  onLoad() {
    this.updateTime();
    const intervalId = setInterval(() => {
      this.updateTime()
    }, 20000);
    this.setData({
      intervalId
    })
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
    clearInterval(this.data.intervalId)
  },

  updateTime() {
    const now = new Date();
    const currentTime = formatTime(now, 'HH:mm');
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diff = targetTime.getTime() - now.getTime();
    const remainingHours = Math.floor(diff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const progress = Math.floor((24 - remainingHours) / 24 * 100)
    this.setData({
      currentTime,
      remainingHours,
      remainingMinutes,
      progress,
    });
  }
})