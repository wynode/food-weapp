// pages/message-notify/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [{
        title: '今日',
        children: [{
            title: '市场监管局通知',
            info: '这是一条超过两行就会自动省略的文本这是一条超过两行就会自动省略的文本这是一条超过两行就会自动省略的文本,这是隐藏之后的内容',
            messageType: 'scjgjtz',
            showHidden: false,
            image: '/assets/image/scjgjtz.png'
          },
          {
            title: '系统通知',
            info: '这是一条通知内容，这是一条整改回馈回这是一条通知内容',
            messageType: 'xttz',
            image: '/assets/image/xttz.png'
          },
        ]
      },
      {
        title: '昨日',
        children: [{
          title: '日报填写通知',
          info: '距离您本周二日报填写时间仅剩余3个小时啦！！！',
          messageType: 'rbtxtz',
          image: '/assets/image/xttz.png'
        }]
      },
      {
        title: '2023年07月30日',
        children: [{
            title: '本月月报已生成',
            info: '点击此处查看您本月日报',
            messageType: 'ybsc',
            image: '/assets/image/ybsc.png'
          }, {
            title: '本月月报已生成',
            info: '点击此处查看您本月日报',
            messageType: 'ybsc',
            image: '/assets/image/ybsc.png'
          },

        ]
      },

    ]
  },


  showHiddenChange(e) {
    const {
      key = '0 0'
    } = e.currentTarget.dataset
    const tempList = this.data.messageList.map((messageItem, index) => {
      if (index === Number(key.split(' ')[0])) {
        const tempChildren = messageItem.children.map((childrenItem, childrenIndex) => {
          if (childrenIndex === Number(key.split(' ')[1])) {
            return {
              ...childrenItem,
              showHidden: !childrenItem.showHidden
            }
          }
          return childrenItem
        })
        return {
          ...messageItem,
          children: tempChildren
        }
      }
      return messageItem
    })
    this.setData({
      messageList: tempList,
    });
  }

})