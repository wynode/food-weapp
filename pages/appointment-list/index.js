const app = getApp();
Page({
  data: {
    levelOptions: {
      11: '企业负责人',
      12: '食品总监职责',
      13: '食品安全员',
      14: '企业员工',
    },
    typeOptions: {
      1: '健康证',
      2: '任命书',
    },

    userPositionList: [
      // {
      //   label: '企业负责人',
      //   value: '11',
      // },
      {
        label: '食品总监职责  ',
        value: '2',
      },
      {
        label: '食品安全员',
        value: '3',
      },
      {
        label: '企业员工',
        value: '64',
      },
    ],
    dataList: [],
  },

  onLoad() {
    this.getList();
  },

  async getList() {
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: `/api/v1/program/enterprise/enterprise_appointments`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    const { list } = res.data.data;
    const userPositionList = this.data.userPositionList.map((posItem) => {
      let result = { ...posItem, list: [] };
      list.forEach((item) => {
        if (posItem.value === String(item.position)) {
          result.list.push({
            ...item,
            url: `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la${item.url}`,
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
  },

  handleGoCreate(e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/create-appointment/index?type=2&file_type=${item.value}`,
    });
  },

  async handleDelete(e) {
    const { item } = e.currentTarget.dataset;
    await app.call({
      path: `/api/v1/program/enterprise/enterprise_appointment?license_id=${item.license_id}`,
      method: 'DELETE',
      data: {
        license_id: item.license_id,
      },
    });
    wx.showToast({
      title: '删除成功',
    });
    this.getList();
  },

  handlePreview(e) {
    const { item } = e.currentTarget.dataset;
    wx.previewImage({
      current: item.url, // 当前显示图片的http链接
      urls: [item.url], // 需要预览的图片http链接列表
    });
  },
});
