import Toast from 'tdesign-miniprogram/toast';

Component({
  properties: {
    uploadTitle: {
      type: String,
      value: '',
    },
    uploadType: {
      type: String,
      value: '',
    },
  },
  data: {
    fileList: [],
    gridConfig: {
      column: 1,
      height: 240,
    },
  },
  ready() {},
  methods: {
    handleAdd(e) {
      const { files } = e.detail;
      console.log(123123123)
      files.forEach((file) => this.onUpload(file));
    },

    async onUpload(file) {
      this.setData({
        fileList: [
          {
            ...file,
            status: 'loading',
          },
        ],
      });
      let compressResult = {};
      try {
        compressResult = await wx.compressImage({
          src: file.url, // 图片路径
          quality: 60, // 压缩质量
        });
      } catch {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '压缩图片失败，请使用jpg格式图片',
        });
      }
      let uploadResult = {};
      try {
        uploadResult = await getApp().cloud.uploadFile({
          cloudPath: `business_license_image/${file.name}`,
          filePath: compressResult.tempFilePath,
        });
        this.setData({
          [`fileList[0].status`]: 'done',
          'fileList[0].fileID': `/${uploadResult.fileID.split('/').slice(-2).join('/')}`,
        });
        // task.onProgressUpdate((res) => {
        //   this.setData({
        //     [`fileList[0].percent`]: res.progress,
        //   });
        // });
      } catch {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '上传图片出错，请联系管理员',
        });
      }

      try {
        if (uploadResult.fileID && this.properties.uploadType === 'business_license') {
          wx.showLoading({
            title: '系统正在识别中，请稍后',
          });
          this.triggerEvent('start', '1');
          const ocrResult = await getApp().call({
            path: '/api/v1/program/utils/license/verify',
            method: 'POST',
            data: { license: `/${uploadResult.fileID.split('/').slice(-2).join('/')}` },
          });
          wx.hideLoading();
          if (ocrResult.data) {
            this.triggerEvent('ocr', ocrResult.data);
          }
        }
      } catch {
        wx.hideLoading();
        Toast({
          context: this,
          selector: '#t-toast',
          message: '营业执照OCR识别出错，请联系管理员',
        });
      }
    },

    handleRemove(e) {
      const { index } = e.detail;
      const { fileList } = this.data;

      fileList.splice(index, 1);
      this.setData({
        fileList,
      });
    },
  },
});
