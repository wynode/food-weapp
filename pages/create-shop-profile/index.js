import Toast from 'tdesign-miniprogram/toast';

Page({
  data: {
    fileList: [],
    shopTypeValue: [],
    shopTypeTitle: '',
    shopTypeText: '',
    shopTypeList: [{
      label: '食品餐饮',
      value: '食品餐饮'
    }],
    shopTemplateValue: [],
    shopTemplateTitle: '',
    shopTemplateText: '',
    shopTemplateList: [{
      label: '（日周月）食品销售通用模板',
      value: '（日周月）食品销售通用模板'
    }],

    gridConfig: {
      column: 1,
      width: 300,
      height: 240,
    },

    personalName: '',
    submitActive: false,
    businessCode: '',
    personalPhone: '',
  },

  onLoad() {

  },

  formSubmit() {
    const isLegal = true
    if (isLegal) {
      wx.redirectTo({
        url: '/pages/create-user/index',
      })
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

  shopTypePicker() {
    console.log(111)
    this.setData({
      shopTypeVisible: true,
      shopTypeTitle: '选择店铺类别'
    });
  },

  shopTemplatePicker() {
    console.log(111)
    this.setData({
      shopTemplateVisible: true,
      shopTemplateTitle: '请选择填写报告模板'
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