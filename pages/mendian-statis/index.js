const app = getApp();

function getStatus(count) {
  if (count < 50) {
    return 'warning';
  }
  if (count === 100) {
    return 'success';
  }
  if (count >= 50) {
    return '';
  }
}

function calculatePercentage(numerator, denominator) {
  if (denominator === 0) {
    return 0; // 如果分母是0，则返回0%
  }
  const ratio = (numerator / denominator) * 100;
  return Number(ratio.toFixed(0)); // toFixed(0) 保证没有小数点，并四舍五入到最接近的整数
}

Page({
  data: {
    optionsKeys: {
      label: 'name',
      value: 'id',
    },
    tabBarValue: 'data-show',
    list: [
      {
        value: 'data-all',
        icon: 'chart-pie',
        ariaLabel: '覆盖率',
      },
      {
        value: 'data-show',
        icon: 'chart-line-multi',
        ariaLabel: '数据统计',
      },
      // {
      //   value: 'submit-report',
      //   icon: 'add-circle',
      // },
      {
        value: 'shop-list',
        icon: 'city-10',
        ariaLabel: '商铺列表',
      },
    ],

    // 区域相关
    areaVisible: false,
    areaText: '四川省 成都市 ',
    areaValue: ['51', '5101', 'all'],
    provinces: [],
    cities: [],
    counties: [],

    // 月份相关
    mode: '',
    monthVisible: false,
    month: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,
    monthText: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,

    // 指定选择区间起始值
    start: '2000-01-01 00:00:00',
    end: '2030-09-09 12:12:12',

    dataList: [],
    progress: 10,
  },

  onLoad() {
    this.initPage();
  },

  transformData(data) {
    return data.map(({ label, value, childs }) => ({
      name: label,
      id: value,
      childs: childs ? this.transformData(childs) : [], // 递归处理子节点
    }));
  },

  async setAreaData() {
    const res = await app.call({
      path: '/api/v1/program/utils/district',
      method: 'POST',
    });

    const areaData = this.transformData(res.data.data.list);
    console.log(areaData);
    const childs = areaData[0].childs[0].childs;
    childs.unshift({
      id: 'all',
      name: '全部',
    });
    this.setData({
      areaData,
      provinces: areaData,
      cities: areaData[0].childs,
      counties: childs,

      areaText: `${areaData[0].name} ${areaData[0]?.childs[0]?.name}`,
      areaValue: [areaData[0].id, areaData[0]?.childs[0]?.id, 'all'],
    });
  },

  async initPage() {
    await this.setAreaData();
    await this.getPanelData();
  },

  async oldSetAreaData() {
    // await app.userLogin()
    // const res = await app.request('/api/v1/government/console/getCity', 'GET');
    const res = await app.call({
      method: 'GET',
      path: '/api/v1/government/console/getCity',
    });
    // 组装完整areaData数据
    if (res[0]) {
      // 得到省份
      // const provinceList = await app.request('/api/v1/government/utils/getCityList', 'GET', {
      //   parentId: 0,
      // });
      const provinceList = await app.call({
        method: 'GET',
        path: '/api/v1/government/utils/getCityList',
        data: {
          parentId: 0,
        },
      });
      const haveProvince = res.map((item) => item.province);
      const finalAreaData = provinceList.filter((item) => haveProvince.includes(item.id));
      for (const cityItem of res) {
        // const cityList = await app.request('/api/v1/government/utils/getCityList', 'GET', {
        //   parentId: cityItem.province,
        // });
        const cityList = await app.call({
          method: 'GET',
          path: '/api/v1/government/utils/getCityList',
          data: {
            parentId: cityItem.province,
          },
        });
        // let areaList = await app.request('/api/v1/government/utils/getCityList', 'GET', {
        //   parentId: cityItem.city,
        // });
        const areaList = await app.call({
          method: 'GET',
          path: '/api/v1/government/utils/getCityList',
          data: {
            parentId: cityItem.city,
          },
        });
        areaList.unshift({
          id: 'all',
          name: '全部',
        });
        const cityObj = {
          id: cityItem.city,
          name: cityList.filter((item) => item.id === cityItem.city)[0].name,
          childs: areaList,
        };
        // 拼接完整
        finalAreaData.forEach((item) => {
          if (item.id === cityItem.province) {
            if (!item.childs) {
              item.childs = [];
            }
            item.childs.push(cityObj);
          }
        });
        console.log(finalAreaData);
      }

      this.setData({
        provinces: finalAreaData,
        cities: finalAreaData[0].childs,
        counties: finalAreaData[0]?.childs[0]?.childs,
        areaText: `${finalAreaData[0].name} ${finalAreaData[0]?.childs[0]?.name}`,
        areaValue: [finalAreaData[0].id, finalAreaData[0]?.childs[0]?.id, 'all'],
      });
    } else {
      wx.showToast({
        icon: 'none',
        title: '当前没有区域，请先选择区域',
      });
    }
  },

  async getPanelData() {
    const payload = {
      province: Number(this.data.areaValue[0]),
      city: Number(this.data.areaValue[1]),
      month: Number(this.data.month.replace('-', '')),
    };
    if (this.data.areaValue[2]) {
      payload.district = Number(this.data.areaValue[2]);
    }
    if (this.data.areaValue[2] === 'all') {
      payload.district = 0;
    }
    // const res = await app.request('/api/v1/government/console/panel', 'POST', payload);
    payload.city = payload.district;
    delete payload.district;
    delete payload.province;
    const ress = await app.call({
      method: 'POST',
      path: '/api/v2/program/enterprise/report/stats/fill_rate',
      data: {
        ...payload,
      },
    });
    const dataList = [];
    const res = ress.data.data
    console.log(res);
    res.forEach((item) => {
      dataList.push({
        title: item.enterprise_name,
        childrenList: [
          {
            title: '整体合格率',
            progress: item.hegelv,
            status: getStatus(item.hegelv),
            btype: item,
          },
          {
            title: '填报率',
            progress: item.tianbaolv,
            status: getStatus(item.tianbaolv),
            btype: item,
          },
          {
            title: '填报数量',
            progress: 100,
            // status: getStatus(item.total_report_count),
            btype: item,
            isCount: true,
            total: '100',
          },
          // {
          //   title: '覆盖率',
          //   progress: calculatePercentage(res[item].fugailv_count, res[item].fugailv_total),
          //   status: getStatus(calculatePercentage(res[item].fugailv_count, res[item].fugailv_total)),
          //   total: `共${res[item].fugailv_count}家`,
          //   btype: item,
          // },


        ],
      });
    });
    this.setData({
      dataList,
    });
  },

  handleGoShopList(e) {
    const { item } = e.currentTarget.dataset;
    if (item.title === '整体合格率') {
      wx.navigateTo({
        url: `/pages/shop-list-filter/index?order=hegelv&btype=${item.btype}&month=${this.data.month}`,
      });
    } else if (item.title === '填报率') {
      wx.navigateTo({
        url: `/pages/shop-list-filter/index?order=tianbaolv&btype=${item.btype}&month=${this.data.month}`,
      });
    }
  },
  getAreaData() {
    return new Promise((resolve, reject) => {
      const url =
        'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/area_options_data.json?sign=8f3f994ed96184b3630ac913424df901&t=1697522987';
      wx.request({
        url: url,
        method: 'GET',
        success: (res) => {
          this.areaData = res.data;
          this.setData({
            provinces: res.data,
            cities: res.data[0].childs,
            // counties: res.data[0].childs[0].childs,
          });
          resolve('success');
        },
      });
    });
  },

  onTabBarChange(e) {
    console.log(e);
    const { value } = e.detail;
    wx.redirectTo({
      url: `/pages/${value}/index`,
    });
  },

  onAreaColumnChange(e) {
    console.log('pick:', e.detail);
    const { column, index } = e.detail;

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
    const cities = this.areaData[provinceIndex].childs;
    const counties = this.areaData[provinceIndex].childs[0].childs;
    this.setData({
      cities,
      counties,
    });
  },

  onAreaPickerChange(e) {
    const { value, label } = e.detail;

    console.log('picker confirm:', e.detail);
    this.setData({
      areaVisible: false,
      areaValue: value,
      areaText: label.join(' '),
    });
    this.getPanelData();
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

  showPicker(e) {
    const { mode } = e.currentTarget.dataset;
    this.setData({
      mode,
      [`${mode}Visible`]: true,
    });
  },
  hidePicker() {
    const { mode } = this.data;
    this.setData({
      [`${mode}Visible`]: false,
    });
  },
  onConfirm(e) {
    const { value } = e.detail;
    const { mode } = this.data;

    console.log('confirm', value);

    this.setData({
      [mode]: value,
      [`${mode}Text`]: value,
    });

    this.hidePicker();
    this.getPanelData();
  },

  onColumnChange(e) {
    console.log('pick', e.detail.value);
  },
});
