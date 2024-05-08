import {
  formatTime
} from '../../utils/util';
import Signature from 'mini-smooth-signature';
const app = getApp();
// base64转本地
function base64ToPath(dataURL) {
  return new Promise((resolve, reject) => {
    // const data = wx.base64ToArrayBuffer(dataURL.replace(/^data:image\/\w+;base64,/, ""));
    const data = dataURL.replace(/^data:image\/\w+;base64,/, '');
    const filePath = `${wx.env.USER_DATA_PATH}/${Math.random().toString(32).slice(2)}.png`;
    wx.getFileSystemManager().writeFile({
      filePath,
      data,
      encoding: 'base64',
      success: () => resolve(filePath),
      fail: reject,
    });
  });
}

Page({
  data: {
    fullScreen: false,
    width2: 320,
    height2: 600,
    scale: 2,
    signUrl: '',

    qualifiedDay: '21',
    topTitle: '日报',
    dateText: '',
    dateValue: [2023, 8],
    years: [{
        label: '2023年',
        value: '2023',
      },
      {
        label: '2022年',
        value: '2022',
      },
      {
        label: '2021年',
        value: '2021',
      },
    ],
    gridConfig: {
      column: 3,
      width: 180,
      height: 180,
    },
    seasons: [{
        label: '1月',
        value: '1',
      },
      {
        label: '2月',
        value: '2',
      },
      {
        label: '3月',
        value: '3',
      },
      {
        label: '4月',
        value: '4',
      },
      {
        label: '5月',
        value: '5',
      },
      {
        label: '6月',
        value: '6',
      },
      {
        label: '7月',
        value: '7',
      },
      {
        label: '8月',
        value: '8',
      },
    ],
    isRes: true,
    date: '',
    report_type: '',
    profile: {},
    unPassList: [],
    passList: [],
  },

  // 样例2伪全屏输出旋转图片
  async getRotateImage() {
    const dataURL = this.signature2.toDataURL();
    const url = await base64ToPath(dataURL);
    const ctx = wx.createCanvasContext('signature3');
    const width = this.signature2.width;
    const height = this.signature2.height;
    ctx.restore();
    ctx.save();
    ctx.translate(0, height);
    ctx.rotate((270 * Math.PI) / 180);
    ctx.drawImage(url, 0, 0, width, height);
    ctx.draw();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'signature3',
          x: 0,
          y: height - width,
          width: height,
          height: width,
          success: (res) => resolve(res.tempFilePath),
          fail: reject,
        });
      }, 50);
    });
  },

  /**
   * 样例2事件绑定
   */
  handleTouchStart2(e) {
    const pos = e.touches[0];
    this.signature2.onDrawStart(pos.x, pos.y);
  },
  handleTouchMove2(e) {
    const pos = e.touches[0];
    this.signature2.onDrawMove(pos.x, pos.y);
  },
  handleTouchEnd2() {
    this.signature2.onDrawEnd();
  },

  /**
   * 样例2按钮事件
   */
  handleFullScreen2() {
    this.setData({
      fullScreen: false,
    });
    setTimeout(() => this.initSignature1(), 50);
  },
  handleClear2() {
    this.signature2.clear();
  },
  handleUndo2() {
    this.signature2.undo();
  },
  handleColor2() {
    this.signature2.color = '#' + Math.random().toString(16).slice(-6);
  },
  async handleFinal(signUrl) {
    try {
      if (!signUrl) {
        throw '请先签名';
      }
      wx.showLoading({
        title: '正在生成报告中，请耐心等待',
      });
      const uploadResult = await getApp().cloud.uploadFile({
        cloudPath: `sign_image/${signUrl.slice(-10)}`,
        filePath: signUrl,
      });
      const signer = `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la/${uploadResult.fileID
        .split('/')
        .slice(-2)
        .join('/')}`;
      const payload = {
        date: this.data.profile.date,
        report_type: this.data.profile.report_type,
        params: {
          template_id: '0',
          item_count: this.data.profile.item_count,
          passed_items: this.data.profile.passed_items,
          unpassed_items: this.data.profile.unpassed_items.map((item, index) => {
            return {
              ...item,
              rectification_images: this.data.unPassList[index].rectification_images.map((itemm) => itemm.fileID),
            };
          }),
          signer: signer,
          content: this.data.profile.content,
          skip: false,
        },
      };

      const enterpriseData = wx.getStorageSync('enterpriseData');
      await app.call({
        path: `/api/v1/program/enterprise/report`,
        method: 'POST',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
        data: payload,
      });

      wx.hideLoading();
      wx.showToast({
        title: '整改成功',
        icon: 'success',
        duration: 2000,
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: `${error}`,
        icon: 'error',
        duration: 2000,
      });
    }
  },
  async handlePreview2() {
    if (this.signature2.isEmpty()) {
      wx.showToast({
        icon: 'none',
        title: '未签名',
      });
      return;
    }

    this.getRotateImage().then((url) => {
      if (url) {
        this.handleFinal(url);
      }
    });
  },

  // 样例2初始化（伪全屏）
  initSignature2() {
    wx.createSelectorQuery()
      .select('#signature2')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const canvas = res[0].node;
        this.canvas2 = canvas;
        canvas.width = this.data.width2 * this.data.scale;
        canvas.height = this.data.height2 * this.data.scale;
        const ctx = canvas.getContext('2d');
        this.signature2 = new Signature(ctx, {
          width: this.data.width2,
          height: this.data.height2,
          scale: this.data.scale,
          minWidth: 4,
          maxWidth: 10,
          bgColor: '#ffffff',
          toDataURL: (type, quality) => canvas.toDataURL(type, quality),
          requestAnimationFrame: (fn) => canvas.requestAnimationFrame(fn),
          getImagePath: () =>
            new Promise((resolve, reject) => {
              const img = canvas.createImage();
              img.onerror = reject;
              img.onload = () => resolve(img);
              img.src = canvas.toDataURL();
            }),
        });
      });
  },

  onReady() {
    try {
      const {
        windowWidth,
        windowHeight,
        pixelRatio
      } = wx.getSystemInfoSync();
      this.setData({
        width1: windowWidth - 30,
        height1: 200,
        width2: windowWidth - 80,
        height2: windowHeight - 50,
        scale: Math.max(pixelRatio || 1, 2),
      });
    } catch (e) {}

    setTimeout(() => {
      this.initSignature2();
    }, 1000);
  },

  handleAdd(e) {
    const {
      files
    } = e.detail;
    const {
      key
    } = e.currentTarget.dataset;
    files.forEach((file) => this.onUpload(file, key));
  },
  async onUpload(file, key) {
    const itemIndex = Number(key);
    console.log(this.data);
    const fileList = this.data.unPassList[itemIndex].rectification_images;
    const length = fileList.length;
    this.setData({
      [`unPassList[${itemIndex}].rectification_images`]: [
        ...fileList,
        {
          ...file,
          status: 'loading',
        },
      ],
    });
    let compressResult = {};
    try {
      compressResult = await wx.compressImage({
        src: file.url, // 图片路径
        quality: 40, // 压缩质量
      });
    } catch {
      wx.showToast({
        icon: 'none',
        title: '压缩图片失败，请使用jpg格式图片',
      });
    }
    let uploadResult = {};
    try {
      uploadResult = await getApp().cloud.uploadFile({
        cloudPath: `report_image/${file.name}`,
        filePath: compressResult.tempFilePath,
      });
      this.setData({
        [`unPassList[${itemIndex}].rectification_images[${length}].status`]: 'done',
        [`unPassList[${itemIndex}].rectification_images[${length}].fileID`]: `/${uploadResult.fileID
          .split('/')
          .slice(-2)
          .join('/')}`,
      });
      setTimeout(() => {
        console.log(this.data.unPassList);
      }, 2000);
      console.log(`/${uploadResult.fileID
        .split('/')
        .slice(-2)
        .join('/')}`)
      console.log(key)
      console.log(this.data.unPassList[key])
    } catch (error) {
      console.log(error);
      wx.showToast({
        icon: 'none',
        title: '上传图片出错，请联系管理员',
      });
    }
  },

  async handleConfirmEdit() {
    this.setData({
      fullScreen: true,
    });
  },
  handleRemove(e) {
    const {
      index
    } = e.detail;
    const {
      key
    } = e.currentTarget.dataset;
    const fileIndex = Number(key);
    console.log(this.data.unPassList, fileIndex, index);
    const {
      rectification_images
    } = this.data.unPassList[fileIndex];

    rectification_images.splice(index, 1);
    this.setData({
      [`unPassList[${index}].rectification_images`]: rectification_images,
    });
  },

  onLoad(options) {
    const {
      date,
      report_type = 'day'
    } = options || {};
    if (report_type === '2') {
      wx.setNavigationBarTitle({
        title: '周排查整改',
      });
      this.setData({
        qualifiedDay: '3',
        topTitle: '周报',
      });
    } else if (report_type === '3') {
      wx.setNavigationBarTitle({
        title: '月调度整改',
      });
      this.setData({
        qualifiedDay: '21',
        topTitle: '月报',
      });
    }
    this.setData({
      date,
      report_type,
    });
    this.getProfileList(date, report_type);
  },

  async getProfileList(date, report_type) {
    try {
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportProfileRes = await app.call({
        path: `/api/v1/program/enterprise/report/${date}/${report_type}`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const profile = reportProfileRes.data.data;
      const list = profile.unpassed_items;
      const list2 = profile.passed_items;
      const unPassList = list.map((item) => {
        const items = profile.items.filter((item2) => item2.item_id === item.item_id)[0];
        return {
          ...item,
          ...items,
          spot_images: item.spot_images.map(
            (url) => `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${url}`,
          ),
          rectification_images: item.rectification_images.map((url) => {
            return {
              url: `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${url}`,
              fileID: url,
              name: url.split('/').slice(-1)[0],
              type: 'image',
            };
          }),
        };
      });
      const passList = list2.map((item) => {
        const items = profile.items.filter((item2) => item2.item_id === item.item_id)[0];
        return {
          ...item,
          ...items,
          spot_images: item.spot_images.map(
            (url) => `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${url}`,
          ),
        };
      });
      profile.month = String(profile.date).slice(4, 6);
      profile.day = String(profile.date).slice(6, 8);
      profile.title = this.data.topTitle;
      console.log(unPassList);
      this.setData({
        profile,
        unPassList,
        passList,
      });
    } catch (error) {
      console.log(error);
      wx.showToast({
        icon: 'error',
        title: '获取详情失败，请联系管理员',
      });
    }
  },

  onColumnChange(e) {
    console.log('picker pick:', e);
  },

  onPickerChange(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;

    console.log('picker change:', e.detail);
    const tempDsList = this.data.dsList.map((item, index) => {
      return {
        ...item,
        date: `${value[1]}月${index == 0 ? '21' : '18'}日`,
        unqualifiedList: this.data.dsList[(index + 1) % 2].unqualifiedList,
        unqualifiedTotal: this.data.dsList[(index + 1) % 2].unqualifiedList.length,
      };
    });
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
      dsList: tempDsList,
    });
  },

  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onCityPicker() {
    this.setData({
      cityVisible: true,
    });
  },

  onSeasonPicker() {
    this.setData({
      dateVisible: true,
    });
  },
});
