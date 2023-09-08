import Signature from 'mini-smooth-signature';
import { formatTime } from '../../utils/util';

Page({
  data: {
    signUrl: '',
    notShow: false,
    reportData: [],
    fullScreen: false,
    width1: 320,
    height1: 240,
    width2: 320,
    height2: 600,
    canvasWidth: 800,
    canvasHeight: 4660,
    scale: 2,
    border: {
      color: '#333',
    },
    currentDay: formatTime(new Date(), 'YYYY.MM.DD'),
  },
  onReady() {
    const reportData = wx.getStorageSync('report_data');
    this.setData({
      reportData,
    });
    try {
      const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync();
      this.setData({
        width1: windowWidth - 30,
        height1: 240,
        width2: windowWidth - 80,
        height2: windowHeight - 50,
        scale: Math.max(pixelRatio || 1, 2),
      });
    } catch (e) {}
    this.initSignature2();
    // if (this.data.fullScreen) {
    //   this.initSignature2();
    // } else {
    //   this.initSignature1();
    // }
  },

  onLoad() {
    this.widget = this.selectComponent('.widget');
    setTimeout(() => {
      if (this.data.isRestaurant) {
        const query = wx.createSelectorQuery();
        query
          .select('.ssignResult')
          .boundingClientRect((res) => {
            console.log(res, 111);
            this.setData({
              canvasWidth: res.width,
              canvasHeight: res.height,
            });
          })
          .exec();
      } else {
        const query = wx.createSelectorQuery();
        query
          .select('.signResult')
          .boundingClientRect((res) => {
            console.log(res);
            this.setData({
              canvasHeight: res.height,
            });
          })
          .exec();
      }
    }, 5000);
  },
  handleCheckboxChange(event) {
    const { index } = event.currentTarget.dataset;
    const checked = event.detail.value;

    const { data } = this.data;
    data[index].checked = checked;

    this.setData({
      data: data,
    });
  },

  // 样例1初始化
  initSignature1() {
    wx.createSelectorQuery()
      .select('#signature1')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const canvas = res[0].node;
        canvas.width = this.data.width1 * this.data.scale;
        canvas.height = this.data.height1 * this.data.scale;
        const ctx = canvas.getContext('2d');
        this.signature1 = new Signature(ctx, {
          width: this.data.width1,
          height: this.data.height1,
          scale: this.data.scale,
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

  /**
   * 样例1事件绑定
   */
  handleTouchStart1(e) {
    const pos = e.touches[0];
    this.signature1.onDrawStart(pos.x, pos.y);
  },
  handleTouchMove1(e) {
    const pos = e.touches[0];
    this.signature1.onDrawMove(pos.x, pos.y);
  },
  handleTouchEnd1() {
    this.signature1.onDrawEnd();
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
   * 样例1按钮事件
   */
  handleFullScreen1() {
    this.setData({
      fullScreen: true,
    });
    // setTimeout(() => this.initSignature2(), 50);
  },
  handleClear1() {
    this.signature1.clear();
  },
  handleUndo1() {
    this.signature1.undo();
  },
  handleColor1() {
    this.signature1.color = `#${Math.random().toString(16).slice(-6)}`;
  },
  handlePreview1() {
    if (this.signature1.isEmpty()) {
      wx.showToast({
        icon: 'none',
        title: '未签名',
      });
      return;
    }
    const dataURL = this.signature1.toDataURL();
    console.log(dataURL);
    base64ToPath(dataURL).then((url) => {
      console.log(url);
      // url && wx.previewImage({
      //   current: 0,
      //   urls: [url],
      // });
    });
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
    this.signature2.color = `#${Math.random().toString(16).slice(-6)}`;
  },
  handlePreview2() {
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
      // url &&
      //   wx.previewImage({
      //     current: 0,
      //     urls: [url],
      //   });
    });
  },

  // 样例2伪全屏输出旋转图片
  async getRotateImage() {
    const dataURL = this.signature2.toDataURL();
    const url = await base64ToPath(dataURL);
    const ctx = wx.createCanvasContext('signature3');
    const { width } = this.signature2;
    const { height } = this.signature2;
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

  exportReport2() {
    console.log(111);
    const query = wx.createSelectorQuery();
    const wxml = `
    <view class="signResult">
      <view class="signTable">
        <view class="signTitle">
          <text class="signTitle1">餐饮服务日检查记录</text>
        </view>
        <view class="signTrb1"></view>
        <view class="signHeader">
          <view class="signTh1b"></view>
          <view class="signTh1"><text class="signTh1">序号</text></view>
          <view class="signTh1b"></view>
          <view class="signTh2"><text class="signTh2">检查项目</text></view>
          <view class="signTh1b"></view>
          <view class="signTh3"><text class="signTh3">检查结果</text></view>
          <view class="signTh1b"></view>
          <view class="signTh4"><text class="signTh4">可能存在的风险隐患</text></view>
          <view class="signTh1b"></view>
          <view class="signTh5"><text class="signTh4">产生的原因分析</text></view>
          <view class="signTh1b"></view>
          <view class="signTh6"><text class="signTh4">防范措施</text></view>
          <view class="signTh1b"></view>
        </view>
        <view class="signTrb1"></view>
        ${this.data.reportData
          .map((item, index) => {
            return `
        <view class="signTr">
          <view class="signTr${index * 6 + 1}b"></view>
          <view class="signTd${index * 6 + 1}"><text class="signTd${index * 6 + 1}">${index + 1}</text></view>
          <view class="signTr${index * 6 + 1}b"></view>
          <view class="signTd${index * 6 + 2}"><text class="signTd${index * 6 + 2}">${item.checkProject}</text></view>
          <view class="signTr${index * 6 + 2}b"></view>
          <view class="signTd${index * 6 + 3}"><text class="signTd${index * 6 + 3}">${
              item.checkResult === 'success' ? '合格' : '不合格'
            }</text></view>
          <view class="signTr${index * 6 + 3}b"></view>
          <view class="signTd${index * 6 + 4}"><text class="signTd${index * 6 + 4}">${item.maybeRisk}</text></view>
          <view class="signTr${index * 6 + 4}b"></view>
          <view class="signTd${index * 6 + 5}"><text class="signTd${index * 6 + 5}">${item.reasonAnalysis}</text></view>
        <view class="signTr${index * 6 + 5}b"></view>
        <view class="signTd${index * 6 + 6}"><text class="signTd${index * 6 + 6}">${item.measures}</text></view>
      <view class="signTr${index * 6 + 6}b"></view>
        </view>
        <view class="signTrb1"></view>
          `;
          })
          .join('')}
      </view>
      <view class="signBottom">
        <view class="signLeft">
          <text class="signDate">检查日期：${this.data.currentDay}</text>
        </view>
        <view class="signRight">
          <text class="signText">报告人：</text>
          <image class="signImage" src="${this.data.signUrl}"></image>
        </view>
      </view>
    </view>
      `;
    let style = {
      signTr: {
        flexDirection: 'row',
      },
      signHeader: {
        flexDirection: 'row',
      },
      signTh1b: {
        width: 1,
        height: 22,
        backgroundColor: '#000',
      },
      signTrb1: {
        width: 778,
        height: 1,
        backgroundColor: '#000',
      },
      signBottom: {
        width: 340,
        height: 70,
        margin: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      signTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
        width: 780,
        height: 24,
      },
      signTitle1: {
        width: 146,
        height: 24,
        fontSize: 14,
      },
      signLeft: {
        width: 132,
        height: 24,
      },
      signDate: {
        width: 132,
        height: 24,
        fontSize: 12,
      },
      signRight: {
        width: 474,
        height: 70,
        fontSize: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      signText: {
        width: 64,
        height: 28,
        fontSize: 12,
      },
      signImage: {
        width: 124,
        height: 66,
      },
      signTh1: {
        width: 64.25,
        height: 22,
        fontSize: 12,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      signTh2: {
        width: 192.75,
        height: 22,
        fontSize: 12,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      signTh3: {
        width: 96.38,
        height: 22,
        fontSize: 12,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      signTh4: {
        width: 160.63,
        height: 22,
        fontSize: 12,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      signTh5: {
        width: 128.5,
        height: 22,
        fontSize: 12,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
      signTh6: {
        width: 128.5,
        height: 22,
        fontSize: 12,
        textAlign: 'center',
        verticalAlign: 'middle',
      },
    };
    query
      .select('.ssignResult')
      .boundingClientRect((res) => {
        const elementWidth = res.width;
        const elementHeight = res.height;
        style = {
          ...style,
          signResult: {
            width: elementWidth,
            height: elementHeight + 40,
            backgroundColor: '#fff',
            padding: 8,
            position: 'absolute',
            top: 60,
            fontSize: 12,
          },
        };
      })
      .exec();
    query
      .selectAll('.ssignTd')
      .boundingClientRect((tdArray) => {
        tdArray.forEach((item, index) => {
          style[`signTd${index + 1}`] = {
            width: item.width,
            height: item.height < 22 ? 22 : item.height,
            fontSize: 12,
            textAlign: item.width > 120 ? 'left' : 'center',
          };
          style[`signTr${index + 1}b`] = {
            width: 1,
            height: item.height < 22 ? 22 : item.height,
            backgroundColor: '#000',
          };
        });
        this.widget.renderToCanvas({
          wxml,
          style,
        });
      })
      .exec();

    wx.showLoading({
      title: '图片生成中',
    }).then(() => {
      setTimeout(() => {
        const p2 = this.widget.canvasToTempFilePath();
        p2.then((res) => {
          wx.hideLoading();
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              console.log(res);
              wx.showToast({
                title: '报告已经成功导出到手机相册！',
                icon: 'none',
              });
              // setTimeout(() => {
              //   wx.redirectTo({
              //     url: '/pages/report-list/index',
              //   });
              // }, 3000);
            },
            fail: (res) => {
              console.log(res);
            },
          });
        });
      }, 1000);
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
