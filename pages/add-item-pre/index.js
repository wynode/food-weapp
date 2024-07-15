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

  async onLoad(options) {},

  async handleSubmit() {
    const payload = this.data.title
      .filter((item) => item)
      .map((item2) => {
        return {
          title: item2,
          item_id: '0',
        };
      });
    wx.setStorageSync('preNewContent', payload);
    wx.showToast({
      title: '新增成功',
    });

    setTimeout(() => {
      const pages = getCurrentPages(); //获取当前界面的所有信息
      const prevPage = pages[pages.length - 2];
      console.log(prevPage);
      prevPage.addPreNewContent(payload);
    }, 500);
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },
});
