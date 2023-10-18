import Toast from 'tdesign-miniprogram/toast/index';
const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';
const app = getApp()
Page({
  data: {
    csForm: {
      enterprise_name: '',
      address: '',
      business_license: '',
      employee_name: '',
      employee_mobile: '',
    },
    submitActive: false,
    businessTypeVisible: '',
    businessTypeValue: [],
    businessTypeTitle: '',
    businessTypeText: '',
    businessTypeList: [{
        label: '餐饮服务',
        value: '1',
      },
      {
        label: '食品销售',
        value: '2',
      },
    ],

    areaText: '',
    areaValue: [],
    provinces: [],
    cities: [],
    counties: [],
  },

  onLoad() {
    this.getAreaData()
  },

  getAreaData() {
    const url = "https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/area_options_data.json?sign=8f3f994ed96184b3630ac913424df901&t=1697522987";
    wx.request({
      url: url,
      method: "GET",
      success: (res) => {
        this.areaData = res.data
        this.setData({
          provinces: res.data,
          cities: res.data[0].childs,
          counties: res.data[0].childs[0].childs
        })
      }
    })
  },

  onAreaColumnChange(e) {
    console.log('pick:', e.detail);
    const {
      column,
      index
    } = e.detail;

    if (column === 0) {
      this.setCitiesFromProvinceIndex(index)
    }

    if (column === 1) {
      this.setData({
        counties: this.data.cities[index].childs
      })
    }

    if (column === 2) {
      // 更改区县
    }
  },

  setCitiesFromProvinceIndex(provinceIndex) {
    const cities = this.areaData[provinceIndex].childs
    const counties = this.areaData[provinceIndex].childs[0].childs
    this.setData({
      cities,
      counties
    })
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
      areaVisible: true
    });
  },

  async formSubmit() {
    const {
      isLegal,
      tips
    } = this.onVerifyInputLegal();
    if (isLegal) {
      const payload = {
        ...this.data.csForm,
        province: this.data.areaValue[0],
        city: this.data.areaValue[1],
        district: this.data.areaValue[2],
        business_type: this.data.businessTypeValue[0],
      }
      const upload = this.selectComponent('#upload')
      const fileID = upload.data.fileList[0].fileID
      payload.business_license_image = fileID
      const res = await app.call({
        path: '/api/v1/program/enterprise',
        method: 'PUT',
        data: payload,
      })
      if (res) {
        // wx.redirectTo({
        //   url: '/pages/create-shop-profile/index',
        // });
      }
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
      },
      () => {
        if (Object.keys(this.data.csForm).every((item) => this.data.csForm[item])) {
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
    } = this.data.csForm;
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
      businessTypeTitle: '选择企业主体类别',
    });
  },

  async scanAddIn() {
    const res = await app.call({
      path: '/api/v1/program/enterprise',
    })
    console.log(res)
    console.log(this.selectComponent('#upload'))
  }
});
