const app = getApp();
import { formatTime } from '../../utils/util';

Page({
  data: {
    messageObj: {
      receive_enterprise_id: '',
      content: '',
      extend_params: '',
    },
    receive_enterprise_id: '',

    fileList: [],
    fileID: '',

    shopText: '',
    shopValue: [],
    shops: [],
  },

  handleAdd(e) {
    // const { fileList } = this.data;
    const { files } = e.detail;

    //方法2：每次选择图片都上传，展示每次上传图片的进度
    files.forEach((file) => this.onUpload(file));
  },

  handleContentChange(e) {
    const { value } = e.detail;
    this.setData({
      content: value,
    });
  },

  async onUpload(file) {
    try {
      const { fileList } = this.data;

      this.setData({
        fileList: [
          ...fileList,
          {
            ...file,
            status: 'loading',
          },
        ],
      });
      const { length } = fileList;
      const compressResult = await wx.compressImage({
        src: file.url, // 图片路径
        quality: 40, // 压缩质量
      });
      const uploadResult = await getApp().cloud.uploadFile({
        cloudPath: `user_image/${file.name}`,
        filePath: compressResult.tempFilePath,
      });

      this.setData({
        [`fileList[${length}].status`]: 'done',
        [`fileList[${length}].fileID`]: `/${uploadResult.fileID.split('/').slice(-2).join('/')}`,
      });
    } catch {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '上传图片出错，请重试或联系管理员',
      });
    }
  },
  handleRemove(e) {
    const { index } = e.detail;
    const { fileList } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },

  async onLoad(options) {
    wx.showLoading();
    const childEnterprise = wx.getStorageSync('childEnterprise');
    const sendMessageEnterprise = wx.getStorageSync('sendMessageEnterprise');
    this.setData({
      receive_enterprise_id: sendMessageEnterprise.enterprise_id,
      shopText: sendMessageEnterprise.enterprise_name,
      shopValue: [sendMessageEnterprise.enterprise_id],
      shops: childEnterprise.map((item) => {
        return {
          label: item.enterprise.enterprise_name,
          value: item.enterprise.enterprise_id,
        };
      }),
    });

    wx.hideLoading();
  },

  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value, label } = e.detail;

    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      receive_enterprise_id: value.join(''),
      [`${key}Text`]: label.join(' '),
    });
  },

  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;

    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onShopPicker() {
    this.setData({
      shopVisible: true,
    });
    console.log('xxx');
  },

  async handleSubmit() {
    const messageObj = {
      receive_enterprise_id: Number(this.data.receive_enterprise_id),
      content: this.data.content,
      extend_params: {
        images: this.data.fileList.map((item) => item.fileID),
      },
    };

    await app.call({
      method: 'POST',
      path: '/api/v2/program/station/create',
      data: {
        ...messageObj,
      },
    });
    wx.showToast({
      title: '发送消息成功',
    });
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/enterprise-list/index',
      });
    }, 1500);
  },
});
