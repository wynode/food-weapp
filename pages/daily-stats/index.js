Page({
  data: {
    dsList: [
      {
        date: '8月21日',
        unqualifiedTotal: '1',
        unqualifiedList: [
          {
            label: '贮存食品的库房，设备，容器，工具是否清洁，安全，无害，设备是否正常运2转，温度是否符合食品安全标准',
            reason: 'A设备运转不正常',
            fileList: ['/assets/image/shop.png'],
          },
        ],
      },
      {
        date: '8月16日',
        unqualifiedTotal: '2',
        unqualifiedList: [
          {
            label: '食品经营场所环境整洁卫生，食品（含食品添加剂、食用农产品，下同）是否有被污染的风险。',
            reason: '不达标',
            fileList: ['/assets/image/bell.png', '/assets/image/shop.png'],
          },
          {
            label: '接触直接入口或不需清洗即可加工的散装食品时，是否戴口罩、手套和帽子，头发不外露。',
            reason: '不达标',
            fileList: ['/assets/image/all_day.png'],
          },
        ],
      },
    ],
    dateText: '',
    dateValue: [2023, 8],
    years: [
      {
        label: '2023年',
        value: '2023',
      },
      {
        label: '2022年',
        value: '2022',
      },
      {
        label: '2021年',
        value: '2021',
      },
    ],
    seasons: [
      {
        label: '1月',
        value: '1',
      },
      {
        label: '2月',
        value: '2',
      },
      {
        label: '3月',
        value: '3',
      },
      {
        label: '4月',
        value: '4',
      },
      {
        label: '5月',
        value: '5月',
      },
      {
        label: '6月',
        value: '6月',
      },
      {
        label: '7月',
        value: '7月',
      },
      {
        label: '8月',
        value: '8月',
      },
    ],
  },

  onLoad(options) {},

  onColumnChange(e) {
    console.log('picker pick:', e);
  },

  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;

    console.log('picker change:', e.detail);
    const tempDsList = this.data.dsList.map((item, index) => {
      return {
        ...item,
        date: `${value[1]}月${index == 0 ? '21' : '18'}日`,
        unqualifiedList: this.data.dsList[(index + 1) % 2].unqualifiedList,
        unqualifiedTotal: this.data.dsList[(index + 1) % 2].unqualifiedList.length,
      };
    });
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
      dsList: tempDsList,
    });
  },

  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onCityPicker() {
    this.setData({
      cityVisible: true,
    });
  },

  onSeasonPicker() {
    this.setData({
      dateVisible: true,
    });
  },
});
