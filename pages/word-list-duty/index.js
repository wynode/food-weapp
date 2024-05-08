import {
  formatTime
} from '../../utils/util';

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
    dataList: [],
  },

  onLoad() {
    this.fetchInstitutionList();
  },

  async fetchInstitutionList() {
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: `/api/v1/program/enterprise/attachments`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    this.setData({
      dataList: res.data.data.list[1].files.map((item) => {
        return {
          ...item,
          template_up_at: item.template_up_at ? formatTime(item.template_up_at, '更新时间：YYYY-MM-DD HH:mm:ss') : '',
        }
      })
    })
  },

  async uploadFn(id, tempFile) {
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
        path: `/api/v1/program/enterprise/attachment/${id}`,
        method: 'POST',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
        data: {
          user_uploaded_url: `${uploadResult.fileID.split('/').slice(-2).join('/')}`,
        },
      });

      wx.hideLoading();
      this.fetchInstitutionList();
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
  async handlePreviewReset(e) {
    const {
      id
    } = e.currentTarget.dataset;
    wx.showLoading()
    try {
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const res = await app.call({
        path: `/api/v1/program/enterprise/attachment/${id}/reset`,
        method: 'POST',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      if (res.data.data) {
        this.fetchInstitutionList()
        wx.hideLoading()
        wx.showToast({
          title: '重置成功',
        })
      }
    } catch(error) {
      console.log(error)
      wx.hideLoading()
      wx.showToast({
        icon: 'error',
        title: '重置失败',
      })
    }
  },

  handleReplace(e) {
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

  async handlePreview(e) {
    wx.showLoading()
    const {
      id
    } = e.currentTarget.dataset;
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: `/api/v1/program/enterprise/attachment/${id}/url`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    const urlpre = res.data.data.user_uploaded_url

    const url = `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la/${urlpre}`;
    wx.downloadFile({
      url,
      filePath: wx.env.USER_DATA_PATH + "/" + `${urlpre.split('/').pop()}`,
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
        wx.hideLoading()
      }
    });
  },
});
