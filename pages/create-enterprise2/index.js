import Toast from 'tdesign-miniprogram/toast/index';
const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';
const app = getApp();
Page({
  data: {
    enterpriseForm: {
      enterprise_name: '',
      address: '',
      business_license: '',
      employee_name: '',
      employee_mobile: '',
    },
    submitActive: true,

    businessTypeVisible: '',
    businessTypeValue: [],
    businessTypeText: '',
    businessTypeList: [{
        label: '食品销售',
        value: '1',
      },
      {
        label: '餐饮服务',
        value: '2',
      },
    ],

    areaVisible: false,
    areaText: '',
    areaValue: [],
    provinces: [],
    cities: [],
    counties: [],
    areaData: [],
  },

  onLoad() {
    this.getAreaData();
  },

  async getAreaData() {
    const res = await app.call({
      path: '/api/v1/program/utils/district',
      method: 'POST',
    });
    
    const areaData = res.data.data.list;
    this.setData({
      areaData,
      provinces: areaData,
      cities: areaData[0].childs,
      counties: areaData[0].childs[0].childs,
    });
    // const url =
    //   'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/area_options_data.json?sign=8f3f994ed96184b3630ac913424df901&t=1697522987';
    // wx.request({
    //   url: url,
    //   method: 'GET',
    //   success: (res) => {
    //     this.areaData = res.data;
    //     this.setData({
    //       provinces: res.data,
    //       cities: res.data[0].childs,
    //       counties: res.data[0].childs[0].childs,
    //     });
    //   },
    // });
  },

  onAreaColumnChange(e) {
    console.log('pick:', e.detail);
    const {
      column,
      index
    } = e.detail;

    if (column === 0) {
      this.setCitiesFromProvinceIndex(index);
    }

    if (column === 1) {
      this.setData({
        counties: this.data.cities[index].childs,
      });
    }

    if (column === 2) {
      // 更改区县
    }
  },

  setCitiesFromProvinceIndex(provinceIndex) {
    const cities = this.data.areaData[provinceIndex].childs;
    const counties = this.data.areaData[provinceIndex].childs[0].childs;
    this.setData({
      cities,
      counties,
    });
  },

  onAreaPickerChange(e) {
    const {
      value,
      label
    } = e.detail;

    console.log('picker confirm:', e.detail);
    this.setData({
      areaVisible: false,
      areaValue: value,
      areaText: label.join(' '),
    });
  },

  onAreaPickerCancel(e) {
    console.log('picker cancel', e.detail);
    this.setData({
      areaVisible: false,
    });
  },

  onAreaPicker() {
    this.setData({
      areaVisible: true,
    });
  },

  async formSubmit() {
    const enterpriseForm = wx.getStorageSync('licenseData')
    const payload = {
      ...enterpriseForm,
      province: Number(this.data.areaValue[0]),
      city: Number(this.data.areaValue[1]),
      district: Number(this.data.areaValue[2]),
      business_type: Number(this.data.businessTypeValue[0]),
      employee_name: this.data.enterpriseForm.employee_name,
      employee_mobile: this.data.enterpriseForm.employee_mobile,
    };
    try {
      const res = await app.call({
        path: '/api/v1/program/enterprise',
        method: 'PUT',
        data: payload,
      });
      console.log(res);
      if (res.data.code === 0) {
        wx.reLaunch({
          url: '/pages/all-center/index',
        });
      }
    } catch (error) {
      console.log(error);
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
        [`enterpriseForm.${item}`]: value,
      },
      () => {
        if (Object.keys(this.data.enterpriseForm).every((item) => this.data.enterpriseForm[item])) {
          this.setData({
            submitActive: true,
          });
        }
      },
    );
  },

  onVerifyInputLegal() {
    const {
      legal_name,
      employee_mobile
    } = this.data.enterpriseForm;
    const prefixPhoneReg = String(this.properties.phoneReg || innerPhoneReg);
    const prefixNameReg = String(this.properties.nameReg || innerNameReg);
    const nameRegExp = new RegExp(prefixNameReg);
    const phoneRegExp = new RegExp(prefixPhoneReg);
    if (!nameRegExp.test(legal_name)) {
      return {
        isLegal: false,
        tips: '负责人名称仅支持输入中文、英文（区分大小写）、数字',
      };
    }
    if (!phoneRegExp.test(employee_mobile)) {
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

  onPickerChange(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      label,
      value
    } = e.detail;

    this.setData({
      businessTypeVisible: false,
      businessTypeValue: value,
      businessTypeText: label.join(' '),
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
    this.setData({
      businessTypeVisible: true,
    });
  },

  async scanAddIn() {
    wx.reLaunch({
      url: '/pages/all-center/index',
    });
    // const res = await app.call({
    //   path: '/api/v1/program/enterprise',
    // });
    // console.log(res);
    // console.log(this.selectComponent('#upload'));
  },

  handleOCRResult(e) {
    if (e.detail) {
      const {
        company_address,
        company_name,
        legal_person,
        license_no
      } = e.detail.data;
      this.setData({
        'enterpriseForm.enterprise_name': company_name,
        'enterpriseForm.address': company_address,
        'enterpriseForm.employee_name': legal_person,
        'enterpriseForm.business_license': license_no,
      });
    }
  },
});
