import Toast from 'tdesign-miniprogram/toast';
const app = getApp();
Page({
  data: {
    fileList: [],
    titleCn: '',
    disabled: false,
    userPositionList: [{
        label: '企业负责人',
        value: '1',
      },
      {
        label: '食品总监职责',
        value: '2',
      },
      {
        label: '食品安全员',
        value: '3',
      },
      {
        label: '企业员工',
        value: '64',
      },
    ],
    gridConfig: {
      column: 1,
      width: 280,
      height: 400,
    },
    employee_name: '',
    file_type: '',
    ctype: '',
  },

  onNameInput(e) {
    this.setData({
      employee_name: e.detail.value,
    });
  },

  onLoad(options) {
    let {
      file_type,
      type,
    } = options || {};
    const pos = this.data.userPositionList.filter((item1) => item1.value === file_type)[0] || {};
    const title = pos.label || '';

    const titleCn = `请添加${title}健康证`;
    this.setData({
      file_type,
      titleCn,
      ctype: type,
    });
  },

  async goCreate() {
    try {
      wx.showLoading()
      this.setData({
        disabled: true
      })
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const res = await app.call({
        path: `/api/v1/program/enterprise/health_certificate`,
        method: 'PUT',
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
        data: {
          url: this.data.fileID,
          type: Number(this.data.ctype),
          position: Number(this.data.file_type),
          employee_name: this.data.employee_name,
        },
      });
      if (res.data.code === 0) {
        wx.hideLoading()
        wx.showToast({
          title: '新增成功',
        })
        setTimeout(() => {
          this.setData({
            disabled: false
          })
          wx.reLaunch({
            url: '/pages/health-list/index',
          })
        }, 1000)
      }
      wx.hideLoading()
    } catch (error) {
      wx.showToast({
        title: String(error),
        icon: 'error',
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
      value,
      label
    } = e.detail;

    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: label[0],
      position: value[0],
    });
  },

  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  userPositionPicker() {
    console.log(111);
    this.setData({
      userPositionVisible: true,
      userPositionTitle: '请选择员工身份',
    });
    this.setData({
      submitActive: true,
    });
  },

  handleAdd(e) {
    const {
      fileList
    } = this.data;
    const {
      files
    } = e.detail;
    console.log(e.detail, 222);

    this.setData({
      fileList: [...files, ...fileList], // 此时设置了 fileList 之后才会展示选择的图片
    });

    this.onUpload(files[0]);
  },

  async onUpload(file) {
    wx.showLoading()
    this.setData({
      disabled: true
    })
    let compressResult = {};
    try {
      compressResult = await wx.compressImage({
        src: file.url, // 图片路径
        quality: 60, // 压缩质量
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
        cloudPath: `user_image/${file.name}`,
        filePath: compressResult.tempFilePath,
      });

      this.setData({
        fileID: `/${uploadResult.fileID.split('/').slice(-2).join('/')}`,
      });
      wx.hideLoading()
      this.setData({
        disabled: false
      })
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
      fileList
    } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },
});
