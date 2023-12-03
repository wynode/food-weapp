const app = getApp();
Page({
  data: {
    levelOptions: {
      1: '企业负责人',
      2: '食品总监职责',
      3: '食品安全员',
      64: '企业员工',
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
      path: `/api/v1/program/enterprise/enterprise_appointment/${item.license_id}`,
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

  async uploadFn(item, tempFile) {
    try {
      wx.showLoading({
        title: '正在上传中',
      });
      const uploadResult = await getApp().cloud.uploadFile({
        cloudPath: `manage_doc/${tempFile.name}`,
        filePath: tempFile.path,
      });
      const enterpriseData = wx.getStorageSync('enterpriseData');
      await app.call({
        path: `/api/v1/program/enterprise/enterprise_appointment`,
        method: 'POST',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
        data: {
          license_id: item.license_id,
          url: `${uploadResult.fileID.split('/').slice(-2).join('/')}`,
        },
      });

      wx.hideLoading();
      this.getList();
      wx.showToast({
        title: '替换成功',
        icon: 'success',
      });
    } catch (error) {
      console.dir(error);
      wx.hideLoading();
      wx.showToast({
        title: '替换出错',
        icon: 'error',
      });
    }
  },

  handleUpload(e) {
    try {
      const { id } = e.currentTarget.dataset;
      const that = this;
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['doc', 'docx', 'txt'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFile = res.tempFiles[0];
          that.uploadFn(id, tempFile);
        },
      });
    } catch {
      wx.hideLoading();
      wx.showToast({
        title: '上传出错',
      });
    }
  },

  handleReplace(e) {
    try {
      const { item } = e.currentTarget.dataset;
      const that = this;
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['doc', 'docx', 'txt'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFile = res.tempFiles[0];
          that.uploadFn(item, tempFile);
        },
      });
    } catch {
      wx.hideLoading();
      wx.showToast({
        title: '上传出错',
      });
    }
  },

  async handlePreview(e) {
    wx.showLoading();
    const { item } = e.currentTarget.dataset;
    // const enterpriseData = wx.getStorageSync('enterpriseData');
    // const res = await app.call({
    //   path: `/api/v1/program/enterprise/attachment/${item.id}/url`,
    //   method: 'GET',
    //   header: {
    //     'x-enterprise-id': enterpriseData.enterprise_id,
    //   },
    // });
    // const urlpre = res.data.data.user_uploaded_url;

    const url = `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${item.url}`;
    wx.downloadFile({
      url,
      filePath: wx.env.USER_DATA_PATH + "/" + `${item.url.split('/').pop()}`,
      success: function (res) {
        wx.hideLoading();
        const filePath = res.filePath;
        wx.openDocument({
          filePath: filePath,
          showMenu: true,
          success: function (res) {
            console.log('打开文档成功');
          },
          fail: function () {
            wx.hideLoading();
          },
        });
      },
      fail: function (res) {
        wx.hideLoading();
      },
    });
  },
});
