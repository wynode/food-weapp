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
    Principal: [],
    Director: [],
    SafetyOfficer: [
    {
      "license_id": "string",
      "enterprise_id": "string",
      "url": "https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/report_image/gq2fwd965a.jpg",
      "type": 1,
      "file_type": 11,
      "template_url": "string",
      "employee_id": "string",
      "employee_name": "测绘"
    },
    {
      "license_id": "string",
      "enterprise_id": "string",
      "url": "https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/report_image/gq2fwd965a.jpg",
      "type": 1,
      "file_type": 11,
      "template_url": "string",
      "employee_id": "string",
      "employee_name": "员工名字"
    },
    {
      "license_id": "string",
      "enterprise_id": "string",
      "url": "https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/report_image/gq2fwd965a.jpg",
      "type": 1,
      "file_type": 11,
      "template_url": "string",
      "employee_id": "string",
      "employee_name": "老板名字"
    },
  
  ],
    Staff: [],
  },

  onLoad() {
    this.fetchCertList();
  },

  async fetchCertList() {
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: `/api/v1/program/enterprise/employees`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    console.log(res)
    this.data.Principal = res.data.data.filter((item) => {
      item.file_type === '11'
    })
    this.data.Director = res.data.data.filter((item) => {
      item.file_type === '12'
    })
    this.data.SafetyOfficer = res.data.data.filter((item) => {
      item.file_type === '13'
    })
    this.data.Staff = res.data.data.filter((item) => {
      item.file_type === '14'
    })
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
      this.fetchCertList();
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
      const {
        id
      } = e.currentTarget.dataset;
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
      const {
        id
      } = e.currentTarget.dataset;
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
    const {
      id
    } = e.currentTarget.dataset;
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
