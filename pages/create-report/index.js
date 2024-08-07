import Toast from 'tdesign-miniprogram/toast';
import Signature from 'mini-smooth-signature';
import { formatTime, sub7day } from '../../utils/util';
import { foodItems } from '../../utils/mock';

const app = getApp();
Page({
  data: {
    fullScreen: false,
    width2: 320,
    height2: 600,
    scale: 2,
    has_template: false,
    choiceUnqualified: false,

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
    currentDaySub7: '',
    checkListData: [],
    min_item_nums: 1,
    isCheckedFalse: false,
    mini: '',
    checkListBoolean: '',
  },

  handleChangeChoice() {
    // 取消不合格
    console.log(this.data.checkListData, this.data.checkList);
    if (this.data.choiceUnqualified) {
      this.setData({
        checkList: this.data.checkListData.map((item, index) => index),
        checkListData: this.data.checkListData.map((item) => {
          return {
            ...item,
            checked: true,
          };
        }),
      });
    } else {
      // 选择不合格
      this.setData({
        submitDisabled: false,
        checkList: [],
        checkListData: this.data.checkListData.map((item) => {
          return {
            ...item,
            checked: false,
          };
        }),
      });
    }
    this.setData({
      choiceUnqualified: !this.data.choiceUnqualified,
    });
  },

  async onLoad(options) {
    const isTourists = wx.getStorageSync('isTourists');
    if (isTourists) {
      this.setData({
        templateTypeList: [
          {
            template_id: '7',
            template_name: '食品销售通用模板',
            business_type: 1,
            report_type: 1,
            min_item_nums: 3,
          },
        ],
        templateTypeValue: ['7'],
        templateTypeText: '食品销售通用模板',
        min_item_nums: 3,
        isRestaurant: false,
        checkListData: foodItems.map((item) => {
          return {
            ...item,
            checked: true,
            checkResult: 'success',
            checkFileList: [],
            checkFileListR: [],
            remark: '',
          };
        }),
        checkedResultLength: foodItems.length,
        checkList: Array.from(Array(foodItems.length).keys()),
        submitDisabled: false,
        checkPercentage: 100,
        computedColor: '',
        has_template: true,
        reportType: '日管控',
      });
      return;
    }
    try {
      let allCheck = [];
      let isTemplate = false;
      const { checkList, isCheckedFalse, mini } = options || {};
      this.setData({
        isCheckedFalse,
        checkListBoolean: checkList,
        mini,
      });
      const reportData = wx.getStorageSync('reportData');
      const reportTypeOptions = {
        1: '日管控',
        2: '周排查',
        3: '月调度',
      };
      const dateString = String(reportData.date);
      const normalData = `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
      this.setData({
        currentDay: formatTime(normalData, 'YYYY.MM.DD'),
        currentDaySub7: sub7day(normalData),
      });
      const reportType = reportTypeOptions[reportData.report_type];
      wx.setNavigationBarTitle({
        title: `提交新${reportType}`,
      });
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const { business_type, enterprise_id } = enterpriseData;
      if (checkList) {
        const checkListData = wx.getStorageSync('checkListData');
        allCheck = checkListData;
        this.setData({
          min_item_nums: mini,
        });
      } else {
        const res = await app.call({
          path: `/api/v1/program/enterprise/report/template?report_type=${reportData.report_type}&business_type=${business_type}`,
          method: 'GET',
          header: {
            'x-enterprise-id': enterprise_id,
          },
        });
        const { has_template } = res.data.data;
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
        const { list } = templateRes.data.data;
        const filterList = list.map((item) => {
          return {
            label: item.template_name,
            value: item.template_id,
          };
        });

        console.log(filterList);

        if (!has_template) {
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
          const { items, min_item_nums } = profileRes.data.data;
          wx.setStorageSync('templateData', profileRes.data.data);
          allCheck = items;
          this.setData({
            templateTypeList: filterList,
            templateTypeValue: [list[0].template_id],
            templateTypeText: list[0].template_name,
            min_item_nums,
          });
        } else {
          const { template } = res.data.data;
          const { items } = template;
          isTemplate = true;
          allCheck = items;
          const profileRes = await app.call({
            path: `/api/v1/program/report/template/${template.report_template_id}`,
            method: 'GET',
            header: {
              'x-enterprise-id': enterprise_id,
            },
          });
          if (profileRes.statusCode !== 200) {
            throw error;
          }
          const { min_item_nums } = profileRes.data.data;
          wx.setStorageSync('templateData', profileRes.data.data);
          const foundItem = filterList.find((item) => item.value === template.report_template_id) || {
            label: '',
          };
          this.setData({
            checkList: allCheck.map((item, index) => index),
            templateTypeList: filterList,
            templateTypeValue: [template.report_template_id],
            templateTypeText: foundItem.label,
            min_item_nums,
          });
        }
        console.log(allCheck);
      }

      const { allqualified = 'no' } = options || {};
      console.log(allqualified, '-----');
      this.setData({
        allqualified,
      });
      if (allqualified === 'yes') {
        const tempCheckListData = allCheck.map((item) => {
          return {
            ...item,
            checked: true,
            checkResult: 'success',
            checkFileList: [],
            checkFileListR: [],
            remark: '',
          };
        });
        this.setData({
          isRestaurant: business_type === 2,
          checkListData: tempCheckListData,
          checkedResultLength: allCheck.length,
          checkList: Array.from(Array(tempCheckListData.length).keys()),
          submitDisabled: false,
          checkPercentage: 100,
          computedColor: '',
          has_template: true,
          reportType,
        });
        console.log(tempCheckListData);
      } else {
        let tempCheckListData = allCheck.map((item) => {
          return {
            ...item,
            checked: isTemplate,
            checkResult: '',
            remark: '',
            checkFileList: [],
            checkFileListR: [],
          };
        });
        // 餐饮的周报和月报只有失败的
        if (isCheckedFalse) {
          let checkList = [];
          const ress = await app.call({
            path: `/api/v1/program/enterprise/report/getFailedReports?report_type=${reportData.report_type}&date=${reportData.date}`,
            method: 'GET',
            header: {
              'x-enterprise-id': enterprise_id,
            },
          });
          const unPassItem = ress.data.data.list.reduce((acc, cur) => {
            return acc.concat(cur.unpassed_items || []);
          }, []);
          tempCheckListData = unPassItem.map((item) => {
            return {
              ...item,
              checked: true,
              checkResult: 'fail',
              checkFileList: item.spot_images.map((image) => {
                return {
                  url: `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${image}`,
                  fileID: image,
                  name: image.split('/').slice(-1)[0],
                  type: 'image',
                };
              }),
              checkFileListR: item.rectification_images.map((image) => {
                return {
                  url: `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${image}`,
                  fileID: image,
                  name: image.split('/').slice(-1)[0],
                  type: 'image',
                };
              }),
            };
          });
          tempCheckListData.forEach((item, index) => {
            checkList.push(index);
          });
          this.setData({
            checkList,
          });
          let checkedResultLength = checkList.length;
          const checkPercentage = (checkedResultLength / tempCheckListData.length) * 100;
          const submitDisabled = !(checkedResultLength >= 1);
          this.setData({
            checkedResultLength,
            submitDisabled,
            checkPercentage,
            computedColor: submitDisabled ? '#FC5B5B' : '0B82FF',
            computedColor1: submitDisabled ? 'color: #FC5B5B' : 'color: 0B82FF',
          });
        }
        this.setData({
          isRestaurant: business_type === 2,
          checkListData: tempCheckListData,
          reportType,
          has_template: true,
        });
        console.log(tempCheckListData);
      }
    } catch (error) {
      console.log(error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '获取详情出错，请联系管理员',
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/all-center/index',
        });
      });
    }
  },

  handleAddItem() {
    wx.navigateTo({
      url: `/pages/add-report-item/index?allqualified=${this.data.allqualified}&checkList=${this.data.checkListBoolean}&mini=${this.data.mini}`,
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
    }, 2000);
  },

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
    const isTourists = wx.getStorageSync('isTourists');
    if (isTourists) {
      wx.showToast({
        icon: 'none',
        title: '请先进行注册',
      });
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/create-enterprise/index',
        });
      }, 1500);
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
            rectification_images: curr.checkFileListR.map((item) => item.fileID),
          });
        }
        if (curr.checked && curr.checkResult === 'fail') {
          const unpassPaylod = {
            item_id: curr.item_id,
            title: curr.title,
            solution: curr.solution,
            anaylise: curr.anaylise,
            hidden_danger: curr.hidden_danger,
            remark: curr.remark,
            spot_images: curr.checkFileList.map((item) => item.fileID),
            rectification_images: curr.checkFileListR.map((item) => item.fileID),
          };
          const additional = ['solution', 'anaylise', 'hidden_danger'];
          additional.forEach((key) => {
            if (curr[key]) {
              unpassPaylod[key] = curr[key];
            }
          });
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
    const { files } = e.detail;
    const { key } = e.currentTarget.dataset;
    // console.log(e)
    files.forEach((file) => this.onUpload(file, key));
  },
  async handleDeleteItem(e) {
    const { key } = e.currentTarget.dataset;

    await app.call({
      method: 'POST',
      path: `/api/v1/program/report/template/item/${key}`,
    });

    wx.showToast({
      title: '删除成功',
    });

    this.setData({
      checkListData: this.data.checkListData.filter((item) => item.item_id !== key),
    });
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
    const { index } = e.detail;
    const { key } = e.currentTarget.dataset;
    const fileIndex = Number(key);
    const { checkFileList } = this.data.checkListData[fileIndex];
    const checkListData = this.data.checkListData.map((item, index1) => {
      if (index1 === fileIndex) {
        console.log(item, index1, index);
        return {
          ...item,
          checkFileList: checkFileList.filter((item, index2) => index !== index2),
        };
      } else {
        return item;
      }
    });
    console.log(checkListData);
    this.setData({
      checkListData,
    });
    // this.setData({
    //   [`checkListData[${index}].checkFileList`]: checkFileList,
    // });
  },

  handleAddR(e) {
    const { files } = e.detail;
    const { key } = e.currentTarget.dataset;
    files.forEach((file) => this.onUploadR(file, key));
  },
  async onUploadR(file, key) {
    const itemIndex = Number(key);
    console.log(this.data);
    const fileList = this.data.checkListData[itemIndex].checkFileListR;
    const length = fileList.length;

    this.setData({
      [`checkListData[${itemIndex}].checkFileListR`]: [
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
        [`checkListData[${itemIndex}].checkFileListR[${length}].status`]: 'done',
        [`checkListData[${itemIndex}].checkFileListR[${length}].fileID`]: `/${uploadResult.fileID
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
  handleRemoveR(e) {
    const { index } = e.detail;
    const { key } = e.currentTarget.dataset;
    const fileIndex = Number(key);
    const { checkFileListR } = this.data.checkListData[fileIndex];
    const checkListData = this.data.checkListData.map((item, index1) => {
      if (index1 === fileIndex) {
        console.log(item, index1, index);
        return {
          ...item,
          checkFileListR: checkFileListR.filter((item, index2) => index !== index2),
        };
      } else {
        return item;
      }
    });
    console.log(checkListData);
    this.setData({
      checkListData,
    });
    // this.setData({
    //   [`checkListData[${index}].checkFileList`]: checkFileList,
    // });
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
    const isTourists = wx.getStorageSync('isTourists');
    if (isTourists) {
      this.setData({ fullScreen: true });
      return;
    }
    if (this.data.choiceUnqualified) {
      this.setData(
        {
          checkListData: this.data.checkListData.map((item) => {
            return {
              ...item,
              checked: true,
              checkResult: item.checkResult || 'success',
            };
          }),
        },
        () => {
          this.handleSubmitFn();
        },
      );
    } else {
      this.handleSubmitFn();
    }
  },

  handleSubmitFn() {
    const reportData = wx.getStorageSync('reportData');
    if ((this.data.isRestaurant && reportData.report_type === 2) || reportData.report_type === 3) {
      let payload = {};
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
            rectification_images: curr.checkFileListR.map((item) => item.fileID),
          });
        }
        if (curr.checked && curr.checkResult === 'fail') {
          const unpassPaylod = {
            item_id: curr.item_id,
            title: curr.title,
            remark: curr.remark,
            solution: curr.solution,
            anaylise: curr.anaylise,
            hidden_danger: curr.hidden_danger,
            spot_images: curr.checkFileList.map((item) => item.fileID),
            rectification_images: curr.checkFileListR.map((item) => item.fileID),
          };
          const additional = ['solution', 'anaylise', 'hidden_danger'];
          additional.forEach((key) => {
            if (curr[key]) {
              unpassPaylod[key] = curr[key];
            }
          });
          unpassed_items.push(unpassPaylod);
        }
      });
      payload.passed_items = passed_items;
      payload.unpassed_items = unpassed_items;
      payload.item_count = passed_items.length + unpassed_items.length;
      wx.setStorageSync('reportProfileData', payload);
      wx.setStorageSync('templateTypeValue', this.data.templateTypeValue);
      wx.navigateTo({
        url: `/pages/create-report2/index`,
      });
    } else {
      this.setData({
        fullScreen: true,
      });
    }
  },

  async onPickerChange(e) {
    const { value, label } = e.detail;
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const profileRes = await app.call({
      path: `/api/v1/program/report/template/${value[0]}`,
      method: 'GET',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });
    const { items, min_item_nums } = profileRes.data.data;
    wx.setStorageSync('templateData', profileRes.data.data);
    const tempCheckListData = items.map((item) => {
      return {
        ...item,
        checked: false,
        checkResult: '',
        remark: '',
        checkFileList: [],
        checkFileListR: [],
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
    const { value } = e.detail;
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
        checkFileListR: [],
      };
    });
    this.setData({
      checkList: value,
      checkListData: tempCheckListData,
    });
  },

  onCheckResultChange(e) {
    const { key = '0 0' } = e.currentTarget.dataset;
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
    const { key = '0' } = e.currentTarget.dataset;
    const { value } = e.detail;
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
  handleHDChange(e) {
    const { key = '0' } = e.currentTarget.dataset;
    const { value } = e.detail;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (String(index) === String(key)) {
        return {
          ...item,
          hidden_danger: value,
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
  handleAAChange(e) {
    const { key = '0' } = e.currentTarget.dataset;
    const { value } = e.detail;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (String(index) === String(key)) {
        return {
          ...item,
          anaylise: value,
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
  handleSOChange(e) {
    const { key = '0' } = e.currentTarget.dataset;
    const { value } = e.detail;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (String(index) === String(key)) {
        return {
          ...item,
          solution: value,
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
