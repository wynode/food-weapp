import Toast from 'tdesign-miniprogram/toast';
const app = getApp();
Page({
  data: {
    gridConfig: {
      column: 1,
      width: 200,
      height: 200,
    },
    fileList1: [],
    fileList2: [],
    fileID1: '',
    fileID2: '',
    businessTypeValue: [],
    businessTypeTitle: '',
    businessTypeText: '',
    businessTypeList: [{
        label: '餐饮服务',
        value: '餐饮服务',
      },
      {
        label: '食品销售',
        value: '食品销售',
      },
    ],
    shopTemplateValue: [],
    shopTemplateTitle: '',
    shopTemplateText: '',
    shopTemplateList: [{
        label: '（日周月）餐饮服务通用模板',
        value: '（日周月）餐饮服务通用模板',
      },
      {
        label: '（日周月）食品销售通用模板',
        value: '（日周月）食品销售通用模板',
      },
    ],

    gridConfig: {
      column: 1,
      width: 300,
      height: 240,
    },

    personalName: '',
    submitActive: false,
    businessCode: '',
    personalPhone: '',
    isEnter: false,
    profile: {},
  },

  onLoad(options) {
    // const { isEnter = false } = options || {};
    // if (isEnter) {
    //   wx.setNavigationBarTitle({
    //     title: '企业信息',
    //   });
    //   const shopData = wx.getStorageSync('shop_data');
    //   if (shopData) {
    //     this.setData({
    //       businessTypeText: shopData.businessTypeText,
    //       shopTemplateText: shopData.shopTemplateText,
    //       personalName: shopData.personalName,
    //       businessCode: shopData.businessCode,
    //       personalPhone: shopData.personalPhone,
    //       isEnter: true,
    //     });
    //   }
    // }
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const profile = {
      ...enterpriseData
    };
    profile.personal = `${profile.legal_name}   ${profile.employee_mobile}`;
    let fileList1 = []
    let fileList2 = []
    let fileID1 = ''
    let fileID2 = ''
    if (profile.business_license_image) {
      fileID1 = profile.business_license_image
      fileList1 = [{
        name: 'xxx',
        url: `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${profile.business_license_image}`
      }];
    }
    if (profile.food_security_license) {
      fileID2 = profile.food_security_license
      fileList2 = [{
        name: 'xxx',
        url: `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${profile.food_security_license}`
      }]
    }

    profile.baobao = '暂无';
    this.setData({
      profile,
      fileList1,
      fileList2,
      fileID1,
      fileID2,
    });
  },

  handlePreviewF() {
    wx.previewImage({
      urls: [this.data.profile.food_safety_license],
    });
  },
  handlePreviewB() {
    wx.previewImage({
      urls: [this.data.profile.business_license_image],
    });
  },
  goEditEnterprise() {
    wx.navigateTo({
      url: '/pages/edit-enterprise/index',
    })
  },

  async handleEditEnterprise() {
    wx.showLoading()
    const payload = {
      enterprise_name: this.data.profile.enterprise_name,
      legal_name: this.data.profile.legal_name,
      employee_mobile: this.data.profile.employee_mobile,
      business_license: this.data.profile.business_license,
      address: this.data.profile.address,
      business_license_image: this.data.fileID1,
      food_security_license: this.data.fileID2,
    }
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const res = await app.call({
      path: `/api/v1/program/enterprise/detail`,
      method: 'POST',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
      data: payload,
    });
    if (res.data.code === 0) {
      wx.showToast({
        title: '修改企业信息成功',
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/enterprise-info/index',
        })
      }, 1500)
    }

    wx.hideLoading()
  },

  nameChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      ['profile.enterprise_name']: value,
    });
  },
  addressChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      ['profile.address']: value,
    });
  },

  legalNameChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      ['profile.legal_name']: value,
    });
  },
  phoneChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      [`profile.employee_mobile`]: value,
    });
  },
  codeChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      [`profile.business_license`]: value,
    });
  },

  formSubmit() {
    const isLegal = true;
    if (isLegal) {
      wx.setStorageSync('shop_data', this.data);
      if (this.data.isEnter) {
        wx.navigateTo({
          url: '/pages/enterprise-center/index',
        });
      } else {
        wx.navigateTo({
          url: '/pages/create-user/index',
        });
      }
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请填写完整',
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

    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
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

  businessTypePicker() {
    console.log(111);
    this.setData({
      businessTypeVisible: true,
      businessTypeTitle: '选择企业主体类别',
    });
  },

  shopTemplatePicker() {
    console.log(111);
    this.setData({
      shopTemplateVisible: true,
      shopTemplateTitle: '请选择填写报告模板',
    });
    this.setData({
      submitActive: true,
    });
  },

  handleAddB(e) {
    const {
      fileList1
    } = this.data;
    const {
      files
    } = e.detail;

    this.setData({
      fileList1: [...files, ...fileList1], // 此时设置了 fileList 之后才会展示选择的图片
    });

    this.onUploadB(files[0]);
  },

  async onUploadB(file) {
    let compressResult = {};
    wx.showLoading()
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
        fileID1: `/${uploadResult.fileID.split('/').slice(-2).join('/')}`,
      });
    } catch {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '上传图片出错，请联系管理员',
      });
    }

    wx.hideLoading()
  },

  handleRemoveB(e) {
    const {
      index
    } = e.detail;
    const {
      fileList1
    } = this.data;

    fileList1.splice(index, 1);
    this.setData({
      fileList1,
    });
  },
  handleAddS(e) {
    const {
      fileList2
    } = this.data;
    const {
      files
    } = e.detail;

    this.setData({
      fileList2: [...files, ...fileList2], // 此时设置了 fileList 之后才会展示选择的图片
    });

    this.onUploadS(files[0]);
  },

  async onUploadS(file) {
    let compressResult = {};
    wx.showLoading()
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
        fileID2: `/${uploadResult.fileID.split('/').slice(-2).join('/')}`,
      });
    } catch {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '上传图片出错，请联系管理员',
      });
    }

    wx.hideLoading()
  },

  handleRemoveS(e) {
    const {
      index
    } = e.detail;
    const {
      fileList2
    } = this.data;

    fileList2.splice(index, 1);
    this.setData({
      fileList2,
    });
  },
});
