Page({
  data: {},

  onLoad(options) {},
  goNext() {
    wx.showLoading({
      title: '图片生成中',
    }).then(() => {
      wx.downloadFile({
        url: 'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/7181694595633_.pic_hd.jpg?sign=da0369976dd2f21ebb6be8fb69375ca3&t=1694596023',
        success: (res) => {
          wx.hideLoading();
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              console.log(res);
              wx.showToast({
                title: '报告已经成功导出到手机相册！',
                icon: 'none',
              });
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/submit-report/index',
                });
              }, 3000);
            },
            fail: (res) => {
              console.log(res);
            },
          });
        },
      });
    });
  },
});
