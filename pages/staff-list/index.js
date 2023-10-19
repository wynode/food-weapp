const app = getApp()

Page({
  data: {
    staffList1: [
      {
        name: '张晓',
        phone: '18176672873',
      },
      {
        name: '李不管',
        phone: '13345343425',
      },
    ],
    staffList2: [
      {
        name: '王梅',
        phone: '15565654545',
      },
    ],
    staffList3: [
      {
        name: '花花',
        phone: '18117814545',
      },
    ],
  },
  async onLoad(options) {
    const res = await app.call({
      path: '/api/v1/program/enterprise/employees',
      method: 'GET',
    });
    if (res.list) {
      res.list.forEach((item) => {

      })
    }
  },
  onDelete() {
    wx.showToast({
      title: '你点击了删除',
      icon: 'none',
    });
  },
  onEdit() {
    wx.showToast({
      title: '你点击了编辑',
      icon: 'none',
    });
  },

  goCreateUser() {
    wx.redirectTo({
      url: `/pages/create-user/index?`,
    });
  },
});
