import Toast from 'tdesign-miniprogram/toast';
const app = getApp();
Page({
  data: {
    fileList: [],
    userPositionValue: [],
    userPositionTitle: '',
    userPositionText: '',
    disabled: false,
    userPositionList: [
      // {
      //   label: '企业负责人',
      //   value: '1',
      // },
      {
        label: '食品安全总监',
        value: '2',
      },
      {
        label: '食品安全员',
        value: '3',
      },
      // {
      //   label: '企业员工',
      //   value: '64',
      // },
    ],

    gridConfig: {
      column: 1,
      width: 280,
      height: 280,
    },
    enterprise_id: '',
    enterprise_name: '',
    userName: '',
    submitActive: false,
    businessCode: '',
    userPhone: '',
    fileID: '',
    position: '',
    title: '',
    edit: {},

    value1: [0, 1],
    userRole: ['day', 'week', 'month'],
  },

  async onLoad(query) {
    const scene = decodeURIComponent(query.scene);
    // let { position, edit } = options || {};
    console.log(scene);

    if (scene) {
      const enterprise_id = scene.split('=')[1];
      const res = await app.call({
        path: `/api/v1/program/enterprise/name?enterprise_id=${enterprise_id}`,
        header: {
          'x-enterprise-id': enterprise_id,
        },
      });
      const enterprise_name = res.data.data.enterprise_name;
      this.setData({
        enterprise_id,
        enterprise_name,
      });
    }
    // if (edit) {
    //   const editObj = JSON.parse(edit);
    //   position = String(editObj.position);
    //   console.log(position, editObj);
    //   this.setData({
    //     userName: editObj.name,
    //     userPhone: editObj.mobile,
    //     fileList: [{ url: editObj.avatar }],
    //     position: String(editObj.position),
    //     editObj,
    //   });
    // }
    // const pos = this.data.userPositionList.filter((item1) => item1.value === position)[0] || {};
    // const title = pos.label || '';
    // this.setData({ position, title, userPositionText: title, userPositionValue: [position] });
  },

  onChange1(e) {
    this.setData({
      value1: e.detail.value,
    });
  },

  avatarUrl() {
    return this.data.fileList[0]
      ? this.data.fileList[0].url
      : 'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/shop_user.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113';
  },

  handleEditAvatar() {
    const uploadComponent = this.selectComponent('#avatar-upload');
    uploadComponent.onAddTap();
  },

  userRoleChange(e) {
    console.log(e);
  },

  onNameInput(e) {
    this.setData({
      userName: e.detail.value,
    });
  },

  onPhoneInput(e) {
    this.setData({
      userPhone: e.detail.value,
    });
  },

  async goReportList() {
    // const isLegal = true;
    // if (isLegal) {
    // wx.setStorageSync('user_data', this.data);
    try {
      wx.showLoading();
      this.setData({
        disabled: true,
      });
      // const enterpriseData = wx.getStorageSync('enterpriseData');
      let res = {};

      res = await app.call({
        path: `/api/v1/program/enterprise/relationship`,
        method: 'POST',
        header: {
          'x-enterprise-id': this.data.enterprise_id,
        },
        data: {
          enterprise_id: this.data.enterprise_id,
          params: {
            name: this.data.userName,
            mobile: this.data.userPhone,
            avatar: this.data.fileID,
            position: Number(this.data.position),
            permission: 7,
          },
        },
      });

      wx.hideLoading();
      this.setData({
        disabled: false,
      });
      if (res.data.code === 0) {
        wx.showToast({
          title: '操作成功',
        });
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/all-center/index',
          });
        }, 1000);
      }
      if (res.data.code !== 0) {
        // wx.showToast({
        //   duration: 3000,
        //   icon: 'none',
        //   title: res.data.message,
        // });
        Toast({
          context: this,
          duration: 3000,
          selector: '#t-toast',
          message: res.data.message || JSON.stringify(res.data),
        });
      }
    } catch (error) {
      console.log(error);
      wx.showToast({
        icon: 'error',
        title: '添加员工失败，请联系管理员',
      });
    }
    // wx.navigateTo({
    //   url: '/pages/all-center/index',
    // });
    // } else {
    //   Toast({
    //     context: this,
    //     selector: '#t-toast',
    //     message: '请填写完整',
    //   });
    // }
  },

  async handleGG() {
    const enterpriseData = wx.getStorageSync('enterpriseData');
    await app.call({
      path: `/api/v1/program/enterprise/health_certificate`,
      method: 'PUT',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
      data: {
        url: '/user_image/gqeognb3o4.png',
        type: 1,
        file_type: 11,
        employee_name: '测试',
      },
    });
  },

  onColumnChange(e) {
    console.log('picker pick:', e);
  },

  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;

    const { value, label } = e.detail;

    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: label[0],
      position: value[0],
    });
  },

  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
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
    const { fileList } = this.data;
    const { files } = e.detail;
    console.log(e.detail, 222);

    this.setData({
      fileList: [...files, ...fileList], // 此时设置了 fileList 之后才会展示选择的图片
    });

    this.onUpload(files[0]);
  },

  async onUpload(file) {
    let compressResult = {};
    try {
      wx.showLoading();
      this.setData({
        disabled: true,
      });
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
        cloudPath: `user_image/${file.name}`,
        filePath: compressResult.tempFilePath,
      });

      this.setData({
        fileID: `/${uploadResult.fileID.split('/').slice(-2).join('/')}`,
      });
      wx.hideLoading();
      this.setData({
        disabled: false,
      });
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
    const { fileList } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },
});
