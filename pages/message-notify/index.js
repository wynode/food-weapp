// pages/message-notify/index.js
const app = getApp();
import { formatTime } from '../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    messageList: [
      // {
      //   title: '今日',
      //   children: [
      //     {
      //       title: '市场监管局通知',
      //       content:
      //         '这是一条超过两行就会自动省略的文本这是一条超过两行就会自动省略的文本这是一条超过两行就会自动省略的文本,这是隐藏之后的内容',
      //       messageType: 'scjgjtz',
      //       showHidden: false,
      //       image:
      //         'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/scjgjtz.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
      //     },
      //     {
      //       title: '消息通知',
      //       content: '这是一条通知内容，这是一条整改回馈回这是一条通知内容',
      //       messageType: 'xttz',
      //       image:
      //         'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/xttz.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
      //     },
      //   ],
      // },
      // {
      //   title: '昨日',
      //   children: [
      //     {
      //       title: '日管控填写通知',
      //       content: '距离您本周二日管控填写时间仅剩余3个小时啦！！！',
      //       messageType: 'rbtxtz',
      //       image:
      //         'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/xttz.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
      //     },
      //   ],
      // },
      // {
      //   title: '2023年07月30日',
      //   children: [
      //     {
      //       title: '本月月调度已生成',
      //       content: '点击此处查看您本月日管控',
      //       messageType: 'ybsc',
      //       image:
      //         'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/ybsc.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
      //     },
      //     {
      //       title: '本月月调度已生成',
      //       content: '点击此处查看您本月日管控',
      //       messageType: 'ybsc',
      //       image:
      //         'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/ybsc.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113',
      //     },
      //   ],
      // },
    ],
  },

  async handleInit() {
    try {
      wx.showLoading();
      const { enterprise_id } = wx.getStorageSync('enterpriseData');
      const messageRes = await app.call({
        path: `/api/v2/program/station/list?enterprise_id=${enterprise_id}`,
      });
      const today = new Date();
      const todayDate = formatTime(today, 'YYYY-MM-DD');
      today.setDate(today.getDate() - 1);
      const lastDate = formatTime(today, 'YYYY-MM-DD');

      const groupedByDate = messageRes.data.data.reduce((acc, item) => {
        // 使用 create_at 值作为键
        const key = item.created_at && item.created_at.slice(0, 10);
        // 如果键不存在于累加器中，初始化为空数组
        if (!acc[key]) {
          acc[key] = [];
        }
        // 将当前项添加到对应键的数组中
        acc[key].push(item);
        return acc;
      }, {});
      const messageList = Object.keys(groupedByDate).map((item) => {
        let title = formatTime(new Date(item), 'YYYY年MM月DD日');
        if (item === todayDate) {
          title = '今日';
        }
        if (item === lastDate) {
          title = '昨日';
        }
        return {
          title,
          children: groupedByDate[item],
        };
      });
      this.setData({
        messageList,
      });

      console.log(messageList);
    } finally {
      wx.hideLoading();
    }
  },

  async handleGoProfile(e) {
    const { key } = e.currentTarget.dataset;
    wx.setStorageSync('messageInfo', key);
    await app.call({
      method: 'POST',
      path: `/api/v2/program/station/read`,
      data: {
        id: Number(key.id),
      },
    });

    wx.navigateTo({
      url: `/pages/message-profile/index`,
    });
  },

  onLoad() {
    this.handleInit();
  },

  showHiddenChange(e) {
    const { key = '0 0' } = e.currentTarget.dataset;
    const tempList = this.data.messageList.map((messageItem, index) => {
      if (index === Number(key.split(' ')[0])) {
        const tempChildren = messageItem.children.map((childrenItem, childrenIndex) => {
          if (childrenIndex === Number(key.split(' ')[1])) {
            return {
              ...childrenItem,
              showHidden: !childrenItem.showHidden,
            };
          }
          return childrenItem;
        });
        return {
          ...messageItem,
          children: tempChildren,
        };
      }
      return messageItem;
    });
    this.setData({
      messageList: tempList,
    });
  },
});
