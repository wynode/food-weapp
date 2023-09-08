Page({
  data: {
    qualifiedDay: '21',
    topTitle: '日管控',
    dsList: [
      {
        date: '8月21日',
        unqualifiedTotal: '1',
        unqualifiedList: [
          {
            label: '贮存食品的库房，设备，容器，工具是否清洁，安全，无害，设备是否正常运2转，温度是否符合食品安全标准',
            checkProject: '食品经营许可证合法有效、与经营场所（实体门店）地址一致。',
            reason: 'A设备运转不正常',
            maybeRisk: '无证违法经营。',
            reasonAnalysis: '对食品安全法及相关规定不熟悉，经营上会有风险。',
            measures: '增强法律意识，依法经营。',
            fileList: [
              'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/shop.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
            ],
          },
        ],
      },
      {
        date: '8月16日',
        unqualifiedTotal: '2',
        unqualifiedList: [
          {
            checkProject: '未超出许可经营项目开展餐饮服务活动。',
            label: '食品经营场所环境整洁卫生，食品（含食品添加剂、食用农产品，下同）是否有被污染的风险。',
            reason: '不达标',
            maybeRisk: '超出许可范围经营。',
            reasonAnalysis: '对食品安全法及相关规定不熟悉，经营上会有风险。',
            measures: '增强法律意识，依法经营。',
            fileList: [
              'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/bell.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
              'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/shop.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
            ],
          },
          {
            checkProject: '在经营场所的显著位置悬挂或者摆放食品经营许可证正本，或以电子形式公示。',
            label: '接触直接入口或不需清洗即可加工的散装食品时，是否戴口罩、手套和帽子，头发不外露。',
            reason: '不达标',
            maybeRisk: '降低消费者对门店认可对，不利于监管部门检查，容易引起投诉。',
            reasonAnalysis: '对相关法律法规掌握不熟。',
            measures: '按要求悬挂或摆放。',
            fileList: [
              'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/all_day.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
            ],
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
        value: '5',
      },
      {
        label: '6月',
        value: '6',
      },
      {
        label: '7月',
        value: '7',
      },
      {
        label: '8月',
        value: '8',
      },
    ],
    isRes: true,
  },

  onLoad(options) {
    const { pageType = 'day' } = options || {};
    if (pageType === 'week') {
      wx.setNavigationBarTitle({
        title: '周排查统计',
      });
      this.setData({
        qualifiedDay: '3',
        topTitle: '周排查',
      });
    } else if (pageType === 'month') {
      wx.setNavigationBarTitle({
        title: '月调度统计',
      });
      this.setData({
        qualifiedDay: '21',
        topTitle: '月调度',
      });
    }
  },

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
