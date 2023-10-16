import Toast from 'tdesign-miniprogram/toast/index';
const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';
const areaList = {
  provinces: {
    110000: '北京市',
    440000: '广东省',
  },
  cities: {
    110100: '北京市',
    440100: '广州市',
    440200: '韶关市',
    440300: '深圳市',
    440400: '珠海市',
    440500: '汕头市',
    440600: '佛山市',
  },
  counties: {
    110101: '东城区',
    110102: '西城区',
    110105: '朝阳区',
    110106: '丰台区',
    110107: '石景山区',
    110108: '海淀区',
    110109: '门头沟区',
    110111: '房山区',
    110112: '通州区',
    110113: '顺义区',
    110114: '昌平区',
    110115: '大兴区',
    110116: '怀柔区',
    110117: '平谷区',
    110118: '密云区',
    110119: '延庆区',
    440103: '荔湾区',
    440104: '越秀区',
    440105: '海珠区',
    440106: '天河区',
    440111: '白云区',
    440112: '黄埔区',
    440113: '番禺区',
    440114: '花都区',
    440115: '南沙区',
    440117: '从化区',
    440118: '增城区',
    440203: '武江区',
    440204: '浈江区',
    440205: '曲江区',
    440222: '始兴县',
    440224: '仁化县',
    440229: '翁源县',
    440232: '乳源瑶族自治县',
    440233: '新丰县',
    440281: '乐昌市',
    440282: '南雄市',
    440303: '罗湖区',
    440304: '福田区',
    440305: '南山区',
    440306: '宝安区',
    440307: '龙岗区',
    440308: '盐田区',
    440309: '龙华区',
    440310: '坪山区',
    440311: '光明区',
    440402: '香洲区',
    440403: '斗门区',
    440404: '金湾区',
    440507: '龙湖区',
    440511: '金平区',
    440512: '濠江区',
    440513: '潮阳区',
    440514: '潮南区',
    440515: '澄海区',
    440523: '南澳县',
    440604: '禅城区',
    440605: '南海区',
    440606: '顺德区',
    440607: '三水区',
    440608: '高明区',
  },
};

const getOptions = (obj, filter) => {
  const res = Object.keys(obj).map((key) => ({
    value: key,
    label: obj[key]
  }));

  if (filter) {
    return res.filter(filter);
  }

  return res;
};

const match = (v1, v2, size) => v1.toString().slice(0, size) === v2.toString().slice(0, size);


Page({
  data: {
    csForm: {
      shopName: '',
      shopAddress: '',
      shopUser: '',
      shopPhone: '',
      shopcert: '',
    },
    submitActive: false,
    shopTypeVisible: '',
    shopTypeValue: [],
    shopTypeTitle: '',
    shopTypeText: '',
    shopTypeList: [{
        label: '餐饮服务',
        value: '餐饮服务',
      },
      {
        label: '食品销售',
        value: '食品销售',
      },
    ],

    areaText: '',
    areaValue: [],
    provinces: getOptions(areaList.provinces),
    cities: [],
    counties: [],
  },

  onLoad() {
    const {
      provinces
    } = this.data;
    const {
      cities,
      counties
    } = this.getCities(provinces[0].value);

    this.setData({
      cities,
      counties
    });
  },

  onAreaColumnChange(e) {
    console.log('pick:', e.detail);
    const {
      column,
      index
    } = e.detail;
    const {
      provinces,
      cities
    } = this.data;

    if (column === 0) {
      // 更改省份
      const {
        cities,
        counties
      } = this.getCities(provinces[index].value);

      this.setData({
        cities,
        counties
      });
    }

    if (column === 1) {
      // 更改城市
      const counties = this.getCounties(cities[index].value);

      this.setData({
        counties
      });
    }

    if (column === 2) {
      // 更改区县
    }
  },

  getCities(provinceValue) {
    const cities = getOptions(areaList.cities, (city) => match(city.value, provinceValue, 2));
    const counties = this.getCounties(cities[0].value);

    return {
      cities,
      counties
    };
  },

  getCounties(cityValue) {
    return getOptions(areaList.counties, (county) => match(county.value, cityValue, 4));
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

  formSubmit() {
    const {
      isLegal,
      tips
    } = this.onVerifyInputLegal();
    if (isLegal) {
      wx.setStorageSync('shop_form', this.data.csForm);
      wx.redirectTo({
        url: '/pages/create-shop-profile/index',
      });
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
    this.setData({
      shopTypeVisible: true,
      shopTypeTitle: '选择企业主体类别',
    });
  },
});
