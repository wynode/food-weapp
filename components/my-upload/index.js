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

  },
  methods: {
    handleAdd(e) {
      const {
        files
      } = e.detail;
      files.forEach(file => this.onUpload(file))
    },
    onUpload(file) {
      this.setData({
        fileList: [{
          ...file,
          status: 'loading'
        }],
      });

      wx.compressImage({
        src: file.url, // 图片路径
        quality: 80, // 压缩质量
        success: (result) => {
          console.log(result.tempFilePath)
          const task = getApp().cloud.uploadFile({
            cloudPath: `business_license_image/${file.name}`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
            filePath: result.tempFilePath, // 微信本地文件，通过选择图片，聊天文件等接口获取
            success: async (res) => {
              this.setData({
                [`fileList[0].status`]: 'done',
                'fileList[0].fileID': `/${res.fileID.split('/').slice(-2).join('/')}`
              });
              const liinfo = await getApp().call({
                path: '/api/v1/program/utils/license/verify',
                method: 'POST',
                data: { license: `/${res.fileID.split('/').slice(-2).join('/')}`},
              })
              console.log(liinfo)
            },
            fail: err => {
              console.error(err)
            }
          })

          task.onProgressUpdate((res) => {
            this.setData({
              [`fileList[0].percent`]: res.progress,
            });
          });
        }
      })


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
