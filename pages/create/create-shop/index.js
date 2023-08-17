import Toast from 'tdesign-miniprogram/toast/index';
const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';

Page({
  data: {
    csForm: {
      shopName: '',
      shopAddress: '',
      shopUser: '',
      shopPhone: '',
    },
    submitActive: false,
  },

  onLoad() {

  },

  formSubmit() {
    const {
      isLegal,
      tips
    } = this.onVerifyInputLegal();
    if (isLegal) {
      wx.navigateTo({
        url: '/pages/create/create-shop-profile/index',
      })
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: tips,
      });
    }
  },

  onInputValue(e) {
    const {
      value = ''
    } = e.detail;
    const {
      item
    } = e.currentTarget.dataset;
    this.setData({
      [`csForm.${item}`]: value,
    }, () => {
      if (Object.keys(this.data.csForm).every((item) => this.data.csForm[item])) {
        this.setData({
          submitActive: true,
        });
      }
    });
  },

  onVerifyInputLegal() {
    const {
      shopUser,
      shopPhone
    } = this.data.csForm;
    const prefixPhoneReg = String(this.properties.phoneReg || innerPhoneReg);
    const prefixNameReg = String(this.properties.nameReg || innerNameReg);
    const nameRegExp = new RegExp(prefixNameReg);
    const phoneRegExp = new RegExp(prefixPhoneReg);
    if (!nameRegExp.test(shopUser)) {
      return {
        isLegal: false,
        tips: '负责人名称仅支持输入中文、英文（区分大小写）、数字',
      };
    }
    if (!phoneRegExp.test(shopPhone)) {
      return {
        isLegal: false,
        tips: '请填写正确的手机号',
      };
    }
    return {
      isLegal: true,
      tips: '添加成功',
    };
  },

});