const app = getApp();

Page({
  data: {
    userPositionList: [
      {
        label: '企业负责人',
        value: '1',
      },
      {
        label: '食品总监职责  ',
        value: '2',
      },
      {
        label: '食品安全员',
        value: '3',
      },
      // {
      //   label: '企业员工',
      //   value: '64',
      // },
    ],
    dataList: [],
  },
  onLoad() {
    this.getList();
  },

  async getList() {
    try {
      const res = await app.call({
        path: '/api/v1/program/enterprise/employees',
        method: 'GET',
      });
      const { list } = res.data.data;
      const userPositionList = this.data.userPositionList.map((posItem) => {
        let result = { ...posItem, list: [] };
        list.forEach((item) => {
          if (posItem.value === String(item.position)) {
            result.list.push({
              ...item,
              fullName: item.name.slice(0, 2),
              avatar: `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la${item.avatar}`,
            });
          }
        });
        console.log(result);
        return result;
      });

      console.log(userPositionList);
      this.setData({
        dataList: userPositionList,
      });
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '获取员工列表出错',
        icon: 'error',
      });
    }
  },
  async onDelete(e) {
    const { item } = e.currentTarget.dataset;
    await app.call({
      path: `/api/v1/program/enterprise/employee/${item.employee_id}`,
      method: 'DELETE',
    });
    wx.showToast({
      title: '删除成功',
    });
    this.getList();
  },
  onEdit(e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/create-user/index?edit=${JSON.stringify(item)}`,
    });
  },

  goCreateUser(e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/create-user/index?position=${item.value}`,
    });
  },
});
