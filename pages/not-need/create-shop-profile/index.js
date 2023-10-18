import Toast from 'tdesign-miniprogram/toast';

Page({
  data: {
    fileList: [],
    businessTypeValue: [],
    businessTypeTitle: '',
    businessTypeText: '',
    businessTypeList: [
      {
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
    shopTemplateList: [
      {
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
  },

  onLoad(options) {
    const { isEnter = false } = options || {};
    if (isEnter) {
      wx.setNavigationBarTitle({
        title: '企业信息',
      });
      const shopData = wx.getStorageSync('shop_data');
      if (shopData) {
        this.setData({
          businessTypeText: shopData.businessTypeText,
          shopTemplateText: shopData.shopTemplateText,
          personalName: shopData.personalName,
          businessCode: shopData.businessCode,
          personalPhone: shopData.personalPhone,
          isEnter: true,
        });
      }
    }
  },

  nameChange(e) {
    const { value } = e.detail;
    this.setData({
      personalName: value,
    });
  },
  phoneChange(e) {
    const { value } = e.detail;
    this.setData({
      personalPhone: value,
    });
  },
  codeChange(e) {
    const { value } = e.detail;
    this.setData({
      businessCode: value,
    });
  },

  formSubmit() {
    const isLegal = true;
    if (isLegal) {
      wx.setStorageSync('shop_data', this.data);
      if (this.data.isEnter) {
        wx.redirectTo({
          url: '/pages/enterprise-center/index',
        });
      } else {
        wx.redirectTo({
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
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;

    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
    });
  },

  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
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
    const { fileList } = this.data;
    const { files } = e.detail;

    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });
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
