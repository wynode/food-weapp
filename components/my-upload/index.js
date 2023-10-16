Component({
  properties: {
    uploadTitle: {
      type: String,
      value: '',
    },
    showLocalData: {
      type: String,
      value: '0',
    }
  },
  data: {
    fileList: [],
    // uploadTitle: '',
    gridConfig: {
      column: 2,
      width: 300,
      height: 240,
    }
  },
  ready() {
    const value = wx.getStorageSync(this.data.uploadTitle)
    if (value) {
      this.setData({
        fileList: value,
      })
    }
  },
  methods: {
    handleAdd(e) {
      const {
        files
      } = e.detail;

      // 方法1：选择完所有图片之后，统一上传，因此选择完就直接展示
      // this.setData({
      //   fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
      // });
      // wx.setStorageSync(this.data.uploadTitle, files)

      // 方法2：每次选择图片都上传，展示每次上传图片的进度
      files.forEach(file => this.onUpload(file))
    },
    onUpload(file) {
      const {
        fileList
      } = this.data;

      this.setData({
        fileList: [...fileList, {
          ...file,
          status: 'loading'
        }],
      });
      const {
        length
      } = fileList;

      // const task = wx.uploadFile({
      //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      //   filePath: file.url,
      //   name: 'file',
      //   formData: {
      //     user: 'test'
      //   },
      //   success: () => {
      //     this.setData({
      //       [`fileList[${length}].status`]: 'done',
      //     });
      //   },
      // });
      const task = wx.cloud.uploadFile({
        cloudPath: file.name, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
        filePath: file.url, // 微信本地文件，通过选择图片，聊天文件等接口获取
        config: {
          env: 'prod-2gdukdnr11f1f68a' // 需要替换成自己的微信云托管环境ID
        },
        success: (res) => {
          console.log(res.fileID)
        },
        fail: err => {
          console.error(err)
        }
      })

      task.onProgressUpdate((res) => {
        this.setData({
          [`fileList[${length}].percent`]: res.progress,
        });
      });
    },

    handleRemove(e) {
      const {
        index
      } = e.detail;
      const {
        fileList
      } = this.data;

      fileList.splice(index, 1);
      this.setData({
        fileList,
      });
    },
  },
});
