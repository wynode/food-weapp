import { formatTime } from '../../utils/util';

Page({
  data: {
    messageInfo: {
      time: '',
      content: '',
      images: [],
    },

    visible: false,
    showIndex: false,
    closeBtn: false,
    deleteBtn: false,
    images: [],
  },

  onClick(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({
      images: [key],
      showIndex: true,
      visible: true,
    });
  },
  onChange(e) {
    const { index } = e.detail;

    console.log('change', index);
  },

  onDelete(e) {
    const { index } = e.detail;

    Toast({
      context: this,
      selector: '#t-toast',
      message: `删除第${index + 1}个`,
    });
  },

  onClose(e) {
    const { trigger } = e.detail;
    console.log(trigger);
    this.setData({
      visible: false,
    });
  },

  onUnload() {
    const pages = getCurrentPages(); //获取当前界面的所有信息
    const prevPage = pages[pages.length - 2];
    prevPage.onLoad();
  },

  async onLoad() {
    const messageInfo = wx.getStorageSync('messageInfo');
    const urlRegex = /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const urls = messageInfo.content.match(urlRegex);
    const employeeInfo = messageInfo.sender_employee_info || {};
    const govermentInfo = messageInfo.sender_government_info || {};
    this.setData({
      messageInfo: {
        ...messageInfo,
        date: formatTime(messageInfo.created_at, 'YYYY年MM月DD日'),
        title: '消息通知',
        links: urls || [],
        sendName: messageInfo.source === 1 ? employeeInfo.name : govermentInfo.name,
        images: messageInfo.extend_params.images
          ? messageInfo.extend_params.images.map(
              (item) => `https://666f-food-security-prod-9dgw61d56a7e8-1320540808.tcb.qcloud.la/${item}`,
            )
          : [],
      },
    });
  },
});
