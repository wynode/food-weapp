import Toast from 'tdesign-miniprogram/toast';
import Signature from 'mini-smooth-signature';
import {
  formatTime
} from '../../utils/util';
const app = getApp();
Page({
  data: {
    fullScreen: false,
    width2: 320,
    height2: 600,
    scale: 2,
    has_template: false,
    allqualified: 'no',
    style: 'border: 2rpx solid rgba(220,220,220,1);border-radius: 12rpx;',
    restaurantList: [],
    isRestaurant: false,
    templateTypeValue: [],
    templateTypeTitle: '',
    templateTypeText: '',
    templateTypeList: [],
    reportType: '',

    submitDisabled: true,
    computedColor: '#FC5B5B',
    computedColor1: 'color: #FC5B5B',

    fileList: [],
    gridConfig: {
      column: 3,
      width: 180,
      height: 180,
    },

    checkList: [],
    checkedResultLength: 0,
    checkPercentage: 0,
    currentDay: formatTime(new Date(), 'YYYY.MM.DD'),
    checkListData: [],
    min_item_nums: 3,
  },

  async onLoad(options) {
    try {
      const {
        allqualified = 'no'
      } = options || {};
      this.setData({
        allqualified,
      });
      const reportData = wx.getStorageSync('reportData');
      const dateString = String(reportData.date)
      this.setData({
        currentDay: formatTime(`${dateString.slice(0,4)}-${dateString.slice(4,6)}-${dateString.slice(6,8)}`, 'YYYY.MM.DD')
      })
      const reportTypeOptions = {
        1: '日管控',
        2: '周排查',
        3: '月调度',
      };
      const reportType = reportTypeOptions[reportData.report_type];
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const {
        business_type,
        enterprise_id
      } = enterpriseData;
      const templateRes = await app.call({
        path: `/api/v1/program/report/templates?report_type=${reportData.report_type}&business_type=${business_type}`,
        method: 'GET',
        header: {
          'x-enterprise-id': enterprise_id,
        },
      });
      if (templateRes.statusCode !== 200) {
        throw error;
      }
      const {
        list
      } = templateRes.data.data;
      const filterList = list.map((item) => {
        return {
          label: item.template_name,
          value: item.template_id,
        };
      });
      const profileRes = await app.call({
        path: `/api/v1/program/report/template/${list[0].template_id}`,
        method: 'GET',
        header: {
          'x-enterprise-id': enterprise_id,
        },
      });
      if (profileRes.statusCode !== 200) {
        throw error;
      }
      const {
        items,
        min_item_nums
      } = profileRes.data.data;
      wx.setStorageSync('templateData', profileRes.data.data);
      let allCheck = []
      // const allCheck = items;
      this.setData({
        templateTypeList: filterList,
        // templateTypeValue: [list[0].template_id],
        // templateTypeText: list[0].template_name,
        min_item_nums,
      });
      const tempCheckListData = allCheck.map((item) => {
        return {
          ...item,
          checked: false,
          checkResult: '',
          remark: '',
          checkFileList: [],
        };
      });
      this.setData({
        isRestaurant: business_type === 2,
        checkListData: tempCheckListData,
        reportType,
        has_template: true,
      });
      console.log(tempCheckListData);
    } catch (error) {
      console.log(error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '获取详情出错，请联系管理员',
      });
      // setTimeout(() => {
      //   wx.navigateTo({
      //     url: '/pages/all-center/index',
      //   });
      // });
    }
  },

  // onReady() {
  //   try {
  //     const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync();
  //     this.setData({
  //       width1: windowWidth - 30,
  //       height1: 200,
  //       width2: windowWidth - 80,
  //       height2: windowHeight - 50,
  //       scale: Math.max(pixelRatio || 1, 2),
  //     });
  //   } catch (e) {}

  //   setTimeout(() => {
  //     this.initSignature2();
  //   }, 2000);
  // },

  handleBack() {
    this.setData({
      fullScreen: false,
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
        console.log(res);
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
  async handlePreview2() {
    if (this.signature2.isEmpty()) {
      wx.showToast({
        icon: 'none',
        title: '未签名',
      });
      return;
    }
    try {
      const getImgUrlRes = await this.getRotateImage();
      wx.showLoading({
        title: '正在生成报告中，请耐心等待',
      });
      const uploadResult = await getApp().cloud.uploadFile({
        cloudPath: `sign_image/${getImgUrlRes.slice(-10)}`,
        filePath: getImgUrlRes,
      });
      console.log(uploadResult);
      const signer = `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la/${uploadResult.fileID
        .split('/')
        .slice(-2)
        .join('/')}`;
      const reportData = wx.getStorageSync('reportData');
      const templateData = wx.getStorageSync('templateData');
      const payload = {
        report_type: reportData.report_type,
        date: reportData.date,
        params: {
          signer,
          template_id: templateData.template_id,
        },
      };
      let passed_items = [];
      let unpassed_items = [];
      this.data.checkListData.forEach((curr) => {
        if (curr.checked && curr.checkResult === 'success') {
          passed_items.push({
            item_id: curr.item_id,
            title: curr.title,
            remark: curr.remark,
            solution: '',
            anaylise: '',
            hidden_danger: '',
            spot_images: curr.checkFileList.map((item) => item.fileID),
            rectification_images: [],
          });
        }
        if (curr.checked && curr.checkResult === 'fail') {
          const unpassPaylod = {
            item_id: curr.item_id,
            title: curr.title,
            remark: curr.remark,
            spot_images: curr.checkFileList.map((item) => item.fileID),
            rectification_images: [],
          }
          const additional = ['solution', 'anaylise', 'hidden_danger']
          additional.forEach((key) => {
            if (curr[key]) {
              unpassPaylod[key] = curr[key]
            }
          })
          unpassed_items.push(unpassPaylod);
        }
      });
      payload.params.passed_items = passed_items;
      payload.params.unpassed_items = unpassed_items;
      payload.params.item_count = passed_items.length + unpassed_items.length;
      payload.params.content = {};
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
      setTimeout(() => {
        wx.reLaunch({
          url: `/pages/all-center/index?date=${reportData.date}`,
        });
      }, 1500);
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '生成报告失败',
        icon: 'error',
        duration: 2000,
      });
    }
    // Toast({
    //   context: this,
    //   selector: '#t-toast',
    //   message: '提交成功',
    // });
    // const report_type = wx.getStorageSync('report_type');
    // wx.setStorageSync('reportData', this.data.checkListData);
    // if ((this.isRestaurant && report_type === 2) || report_type === 3) {
    //   wx.navigateTo({
    //     url: 'pages/e-signature/index',
    //   });
    // } else {
    // }
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
    const fileList = this.data.checkListData[itemIndex].checkFileList;
    const length = fileList.length;

    this.setData({
      [`checkListData[${itemIndex}].checkFileList`]: [
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
      Toast({
        context: this,
        selector: '#t-toast',
        message: '压缩图片失败，请使用jpg格式图片',
      });
    }
    let uploadResult = {};
    try {
      uploadResult = await getApp().cloud.uploadFile({
        cloudPath: `report_image/${file.name}`,
        filePath: compressResult.tempFilePath,
      });
      this.setData({
        [`checkListData[${itemIndex}].checkFileList[${length}].status`]: 'done',
        [`checkListData[${itemIndex}].checkFileList[${length}].fileID`]: `/${uploadResult.fileID
          .split('/')
          .slice(-2)
          .join('/')}`,
      });
      setTimeout(() => {
        console.log(this.data.checkListData);
      }, 2000);
    } catch {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '上传图片出错，请联系管理员',
      });
    }
  },
  handleRemove(e) {
    const {
      index
    } = e.detail;
    const {
      key
    } = e.currentTarget.dataset;
    const fileIndex = Number(key);
    const {
      checkFileList
    } = this.data.checkListData[fileIndex];

    checkFileList.splice(index, 1);
    this.setData({
      [`checkListData[${index}].checkFileList`]: checkFileList,
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

  templateTypePicker() {
    this.setData({
      templateTypeVisible: true,
      templateTypeTitle: '选择模版',
    });
  },

  handleSubmit() {
    const checkListData = this.data.checkListData.filter((item) => item.checked);
    wx.setStorageSync('checkListData', checkListData);
    wx.navigateTo({
      url: `/pages/create-report/index?allqualified=${this.data.allqualified}&checkList=yes&mini=${this.data.min_item_nums}`,
    });
  },

  async onPickerChange(e) {
    const {
      value,
      label
    } = e.detail;
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const profileRes = await app.call({
      path: `/api/v1/program/report/template/${value[0]}`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    const {
      items,
      min_item_nums
    } = profileRes.data.data;
    wx.setStorageSync('templateData', profileRes.data.data);
    const tempCheckListData = items.map((item) => {
      return {
        ...item,
        checked: false,
        checkResult: '',
        remark: '',
        checkFileList: [],
      };
    });
    console.log(tempCheckListData);
    this.setData({
      checkPercentage: 0,
      min_item_nums,
      checkListData: tempCheckListData,
      checkList: [],
    });
    this.setData({
      templateTypeVisible: false,
      templateTypeValue: value,
      templateTypeText: label.join(' '),
    });
  },

  onPickerCancel(e) {
    this.setData({
      templateTypeVisible: false,
    });
  },

  onCheckChange(e) {
    const {
      value
    } = e.detail;
    let checkedResultLength = 0;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (value.includes(index)) {
        return {
          ...item,
          checked: true,
        };
      }
      return {
        ...item,
        checked: false,
        checkResult: '',
        remark: '',
        checkFileList: [],
      };
    });
    checkedResultLength = value.length
    console.log(tempCheckListData);
    this.setData({
      checkList: value,
      checkListData: tempCheckListData,
    });
    const checkPercentage = (checkedResultLength / this.data.checkListData.length) * 100;
    const submitDisabled = !(checkedResultLength >= this.data.min_item_nums);
    this.setData({
      checkedResultLength,
      submitDisabled,
      checkPercentage,
      computedColor: submitDisabled ? '#FC5B5B' : '0B82FF',
      computedColor1: submitDisabled ? 'color: #FC5B5B' : 'color: 0B82FF',
      checkListData: tempCheckListData,
    });
  },

  onCheckResultChange(e) {
    const {
      key = '0 0'
    } = e.currentTarget.dataset;
    const checkIndex = key.split(' ')[0];
    const checkResult = key.split(' ')[1];
    let checkedResultLength = 0;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (String(index) === String(checkIndex)) {
        checkedResultLength += 1;
        return {
          ...item,
          checkResult: checkResult,
        };
      }
      if (item.checkResult) {
        checkedResultLength += 1;
      }
      return {
        ...item,
      };
    });
    const checkPercentage = (checkedResultLength / this.data.checkListData.length) * 100;
    const submitDisabled = !(checkedResultLength >= this.data.min_item_nums);
    this.setData({
      checkedResultLength,
      submitDisabled,
      checkPercentage,
      computedColor: submitDisabled ? '#FC5B5B' : '0B82FF',
      computedColor1: submitDisabled ? 'color: #FC5B5B' : 'color: 0B82FF',
      checkListData: tempCheckListData,
    });
  },

  handleReasonChange(e) {
    const {
      key = '0'
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (String(index) === String(key)) {
        return {
          ...item,
          remark: value,
        };
      }
      return {
        ...item,
      };
    });

    this.setData({
      checkListData: tempCheckListData,
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
