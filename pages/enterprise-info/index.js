import Toast from 'tdesign-miniprogram/toast';
const app = getApp();
Page({
  data: {
    fileList: [],
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
      width: 340,
      height: 240,
    },

    personalName: '',
    submitActive: false,
    businessCode: '',
    personalPhone: '',
    isEnter: false,
    profile: {},
  },

  async onLoad(options) {
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
    const enterpriseRes = await app.call({
      path: '/api/v1/program/enterprise',
      header: {
        'x-enterprise-id': enterpriseData.enterprise_id,
      },
    });

    wx.setStorageSync('enterpriseData', enterpriseRes.data.data);
    const profile = {
      ...enterpriseRes.data.data
    };
    profile.personal = `${profile.legal_name}   ${profile.employee_mobile}`;
    if (profile.business_license_image) {
      profile.business_license_image = `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${profile.business_license_image}`;
    }

    if (profile.food_security_license) {
      profile.food_security_license = `https://7072-prod-2gdukdnr11f1f68a-1320540808.tcb.qcloud.la/${profile.food_security_license}`;
    }

    profile.baobao = '暂无';
    this.setData({
      profile,
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

  nameChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      personalName: value,
    });
  },
  phoneChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      personalPhone: value,
    });
  },
  codeChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      businessCode: value,
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

  handleAdd(e) {
    const {
      fileList
    } = this.data;
    const {
      files
    } = e.detail;

    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });
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
