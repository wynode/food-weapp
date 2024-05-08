import {
  formatTime,
  sub7day
} from '../../utils/util';
const app = getApp();

Page({
  data: {
    qualifiedDay: '21',
    topTitle: '日报',
    isRes: true,
    date: '',
    report_type: '',
    profile: {},
    unPassList: [],
    passList: [],
    currentDay: '',
    currentDaySub7: '',
  },

  goEditReport() {
    const url = `/pages/edit-report/index?report_type=${this.data.report_type}&template_id=${this.data.profile.template_id}&date=${this.data.profile.date}`;
    wx.navigateTo({
      url,
    });
  },

  onLoad(options) {
    const { date, report_type = 'day' } = options || {};
    if (report_type === '2') {
      wx.setNavigationBarTitle({
        title: '周排查统计',
      });
      this.setData({
        qualifiedDay: '3',
        topTitle: '周排查详情',
      });
    } else if (report_type === '3') {
      wx.setNavigationBarTitle({
        title: '月调度统计',
      });
      this.setData({
        qualifiedDay: '21',
        topTitle: '月调度详情',
      });
    }
    this.setData({
      date,
      report_type,
    });
    this.getProfileList(date, report_type);
  },

  handlePreviewImage(e) {
    const { item } = e.currentTarget.dataset;
    console.log(item, e);
    wx.previewImage({
      urls: item,
    });
  },

  async getProfileList(date, report_type) {
    try {
      const enterpriseData = wx.getStorageSync('enterpriseData');
      const reportProfileRes = await app.call({
        path: `/api/v1/program/enterprise/report/${date}/${report_type}`,
        header: {
          'x-enterprise-id': enterpriseData.enterprise_id,
        },
      });
      const profile = reportProfileRes.data.data;
      const list = profile.unpassed_items;
      const list2 = profile.passed_items;
      const unPassList = list.map((item) => {
        const items = profile.items.filter((item2) => item2.item_id === item.item_id)[0];
        return {
          ...items,
          ...item,
          spot_images: item.spot_images.map(
            (url) => `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${url}`,
          ),
          rectification_images: item.rectification_images.map(
            (url) => `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${url}`,
          ),
        };
      });
      const passList = list2.map((item) => {
        const items = profile.items.filter((item2) => item2.item_id === item.item_id)[0];
        return {
          ...items,
          ...item,
          spot_images: item.spot_images.map(
            (url) => `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la${url}`,
          ),
        };
      });
      profile.month = String(profile.date).slice(4, 6);
      profile.day = String(profile.date).slice(6, 8);
      profile.title = this.data.topTitle;
      const dateString = String(profile.date)
      const normalData = `${dateString.slice(0,4)}-${dateString.slice(4,6)}-${dateString.slice(6,8)}`
      this.setData({
        currentDay: formatTime(normalData, 'YYYY.MM.DD'),
        currentDaySub7: sub7day(normalData),
      })

      this.setData({
        profile,
        unPassList,
        passList,
      });
    } catch (error) {
      console.log(error);
      wx.showToast({
        icon: 'error',
        title: '获取详情失败，请联系管理员',
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
