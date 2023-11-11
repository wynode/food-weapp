// pages/create-report2.js
import { formatTime } from '../../utils/util';
import Signature from 'mini-smooth-signature';
const app = getApp();
Page({
  data: {
    report_type: '',
    business_type: '',
    currentDay: formatTime(new Date(), 'YYYY年MM月DD日'),
    judgement: 1,
    next_week_point: '',
    address: '',
    content: '',
    decision: '',
    options: [
      {
        value: 1,
        label: '1.食品安全风险可控，无较大食品安全隐患',
      },
      {
        value: 2,
        label: '2.存在食品安全风险，需尽快采取措施防范',
      },
      {
        value: 3,
        label: '3.存在严重食品安全风险隐患，需尽快采取防范措施，请单位负责人重视。',
      },
    ],

    fullScreen: false,
    width2: 320,
    height2: 600,
    scale: 2,
    signUrl: '',
  },

  onLoad() {
    const reportData = wx.getStorageSync('reportData');
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const { business_type } = enterpriseData;
    const { report_type } = reportData;

    this.setData({
      business_type,
      report_type,
    });
  },

  onRadioChange(event) {
    const { value } = event.detail;
    this.setData({
      judgement: value,
    });
  },
  handleTextAreaChange(event) {
    const { value } = event.detail;
    this.setData({
      next_week_point: value,
    });
  },
  handleAddressChange(event) {
    const { value } = event.detail;
    this.setData({
      address: value,
    });
  },
  handleContentChange(event) {
    const { value } = event.detail;
    this.setData({
      content: value,
    });
  },
  handleDecisionChange(event) {
    const { value } = event.detail;
    this.setData({
      decision: value,
    });
  },

  onReady() {
    try {
      const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync();
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

  handleFullScreen1() {
    this.setData({
      fullScreen: true,
    });
    // setTimeout(() => this.initSignature2(), 50);
  },

  handleBack() {
    this.setData({
      fullScreen: false,
    });
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
  async handleFinal() {
    try {
      wx.showLoading({
        title: '正在生成报告中，请耐心等待',
      });
      const uploadResult = await getApp().cloud.uploadFile({
        cloudPath: `sign_image/${this.data.signUrl.slice(-10)}`,
        filePath: this.data.signUrl,
      });
      console.log(uploadResult);
      const signer = `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${uploadResult.fileID
        .split('/')
        .slice(-2)
        .join('/')}`;
      const reportData = wx.getStorageSync('reportData');
      const templateData = wx.getStorageSync('templateData');
      const reportProfileData = wx.getStorageSync('reportProfileData');
      const payload = {
        report_type: reportData.report_type,
        date: reportData.date,
        params: {
          signer,
          template_id: templateData.template_id,
          ...reportProfileData,
        },
      };

      if (this.data.business_type === 1) {
        payload.params.content = {
          decision: this.data.decision,
        };
      } else if (this.data.business_type === 2 && this.data.report_type === 2) {
        payload.params.content = {
          judgement: String(this.data.judgement),
          next_week_point: String(this.data.next_week_point),
        };
      } else if (this.data.business_type === 2 && this.data.report_type === 3) {
        payload.params.content = {
          content: String(this.data.content),
          address: String(this.data.address),
        };
      }
      console.log(payload);
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportRes = await app.call({
        path: `/api/v1/program/enterprise/report`,
        method: 'PUT',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
        data: payload,
      });
      if (reportRes.statusCode !== 200) {
        throw error;
      }
      wx.hideLoading();
      wx.showToast({
        title: '生成报告成功',
        icon: 'success',
        duration: 2000,
      });
      wx.redirectTo({
        url: '/pages/all-center/index',
      });
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '生成报告失败',
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
        this.setData({
          fullScreen: false,
          signUrl: url,
        });
      }
    });
  },
});

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
