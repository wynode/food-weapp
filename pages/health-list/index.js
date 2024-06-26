const app = getApp();
Page({
  data: {
    levelOptions: {
      1: '企业负责人',
      2: '食品安全总监',
      3: '食品安全员',
      64: '企业员工',
    },
    typeOptions: {
      1: '健康证',
      2: '任命书',
    },

    userPositionList: [
      {
        label: '企业负责人',
        value: '1',
      },
      {
        label: '食品安全总监',
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
      path: `/api/v1/program/enterprise/health_certificates`,
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
            url: `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${item.pic_url}`,
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
      url: `/pages/create-health/index?type=1&file_type=${item.value}`,
    });
  },

  async handleDelete(e) {
    const { item } = e.currentTarget.dataset;
    await app.call({
      path: `/api/v1/program/enterprise/health_certificate/${item.license_id}`,
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
