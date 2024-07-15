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

    title: [''],
    allqualified: '',
    checkList: '',
    mini: '',
  },

  handleAdd(e) {
    // const { fileList } = this.data;
    const { files } = e.detail;

    //方法2：每次选择图片都上传，展示每次上传图片的进度
    files.forEach((file) => this.onUpload(file));
  },

  handleAddItem() {
    this.setData({
      title: this.data.title.concat(['']),
    });
  },

  handleContentChange(e) {
    const { value } = e.detail;
    const { key } = e.target.dataset;
    const newtitle = this.data.title;
    newtitle[key] = value;
    this.setData({
      title: newtitle,
    });
  },

  async onLoad(options) {
    console.log(options);
    const { allqualified, checkList, mini } = options || {};
    console.log(allqualified, 'xxxx');
    this.setData({
      allqualified,
      checkList,
      mini,
    });
  },

  async handleSubmit() {
    const payload = this.data.title
      .filter((item) => item)
      .map((item2) => {
        return {
          title: item2,
        };
      });
    const template_id = wx.getStorageSync('templateData').template_id;
    await app.call({
      method: 'PUT',
      path: '/api/v1/program/report/template/item',
      data: {
        items: payload,
        template_id: Number(template_id),
      },
    });
    wx.showToast({
      title: '新增成功',
    });
    setTimeout(() => {
      const pages = getCurrentPages(); //获取当前界面的所有信息
      const prevPage = pages[pages.length - 2];
      prevPage.onLoad({ allqualified: this.data.allqualified, checkList: this.checkList, mini: this.mini });
    }, 500);
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
    // setTimeout(() => {
    //   wx.reLaunch({
    //     url: `/pages/create-report/index?allqualified=${this.data.allqualified}&checkList=${this.data.checkList}&mini=${this.data.mini}`,
    //   });
    // }, 1500);
  },
});
