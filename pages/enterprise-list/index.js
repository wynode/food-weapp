const app = getApp();
import { formatTime } from '../../utils/util';

Page({
  data: {
    dataList: [{ enterprise: {}, report_status: [{}] }],
    progress: 10,
    monthCN: '',
  },

  async onLoad(options) {
    const { month = formatTime(new Date(), 'YYYYMM') } = options || {};
    const enterpriseData = wx.getStorageSync('enterpriseData');
    const { enterprise_id } = enterpriseData;
    const listRes = await app.call({
      path: '/api/v2/program/enterprise/getChildEnterprises',
      data: {
        enterprise_id: 1,
        month,
      },
      header: {
        'x-enterprise-id': enterprise_id,
      },
    });
    const dataList = listRes.data.data.map((item) => {
      return {
        enterprise: item.enterprise,
        report_status: Object.values(item.report_status).map((citem) => {
          const progress = Math.floor((citem.submit_report_count / citem.total_report_count) * 100);
          return {
            ...citem,
            progress,
            status: progress === 100 ? 'success' : progress < 60 ? 'warning' : '',
          };
        }),
      };
    });
    console.log(dataList);
    this.setData({
      dataList,
      monthCN: `${month.slice(0, 4)}年${month.slice(4, 6)}月`,
    });
  },

  handleGoMainPage(e) {
    const { key } = e.currentTarget.dataset;
    wx.setStorageSync('enterpriseData', key.enterprise);
    wx.redirectTo({
      url: '/pages/all-center/index',
    });
  },
});
