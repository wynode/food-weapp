const app = getApp();
Page({
  data: {
    fileTypeOptions: {
      11: '食品安全管理制度',
      12: '餐饮具清洗消毒保洁管理制度',
      21: '食品安全风险日管控管理制度',
      22: '食品安全风险周管控管理制度',
      23: '食品安全风险月管控管理制度',
      31: '负责人食品安全职责',
      32: '安全总监职责',
      33: '安全员守则',
    },
    day: {
      url: '/report_doc/%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A3%E5%93%88.docx?sign=1a9cf9d60bdddf23987fb937bc982af5&t=1699187366',
    },
    week: {
      document_id: 1,
      url: '/report_doc/%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A3%E5%93%88.docx?sign=1a9cf9d60bdddf23987fb937bc982af5&t=1699187366',
    },
    mouth: {},
  },

  onLoad() {
    this.fetchInstitutionList();
  },

  async fetchInstitutionList() {
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: `/api/v1/program/enterprise/management_regimes`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    console.log(res);
    this.data.day =
      res.data.data.filter((item) => {
        item.file_type === '21';
      })[0] || {};
    this.data.week =
      res.data.data.filter((item) => {
        item.file_type === '22';
      })[0] || {};
    this.data.month =
      res.data.data.filter((item) => {
        item.file_type === '23';
      })[0] || {};
  },

  async uploadFn(id, tempFile, document_id) {
    try {
      wx.showLoading({
        title: '正在上传中',
      });
      const uploadResult = await getApp().cloud.uploadFile({
        cloudPath: `report_doc/${tempFile.name}`,
        filePath: tempFile.path,
      });
      const enterpriseData = wx.getStorageSync('enterpriseData');
      if (document_id) {
        await app.call({
          path: `/api/v1/program/enterprise/management_collection`,
          method: 'POST',
          header: {
            'x-enterprise-id': enterpriseData.enterprise_id,
          },
          data: {
            document_id,
            url: `/${uploadResult.fileID.split('/').slice(-2).join('/')}`,
          },
        });
      } else {
        await app.call({
          path: `/api/v1/program/enterprise/management_collection`,
          method: 'PUT',
          header: {
            'x-enterprise-id': enterpriseData.enterprise_id,
          },
          data: {
            type: 1,
            file_type: id,
            url: `/${uploadResult.fileID.split('/').slice(-2).join('/')}`,
          },
        });
      }
      wx.hideLoading();
      this.fetchInstitutionList();
      wx.showToast({
        title: '上传成功',
        icon: 'success',
      });
    } catch (error) {
      console.dir(error);
      wx.hideLoading();
      wx.showToast({
        title: '上传出错',
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
      const { id } = e.currentTarget.dataset;
      const idMap = {
        21: 'day',
        22: 'week',
        23: 'month',
      };
      const idToName = idMap[id];
      const document_id = this.data[idToName].document_id;
      const that = this;
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['doc', 'docx', 'txt'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFile = res.tempFiles[0];
          that.uploadFn(id, tempFile, document_id);
        },
      });
    } catch {
      wx.hideLoading();
      wx.showToast({
        title: '上传出错',
      });
    }
  },

  handlePreview(e) {
    const { id } = e.currentTarget.dataset;
    const idMap = {
      21: 'day',
      22: 'week',
      23: 'month',
    };
    const idToName = idMap[id];
    const url = `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la${this.data[idToName].url}`;
    wx.showLoading();
    wx.downloadFile({
      url,
      success: function (res) {
        wx.hideLoading();
        const filePath = res.tempFilePath;
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
    });
  },
});
