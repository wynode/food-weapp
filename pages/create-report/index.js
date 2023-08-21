Page({
  data: {
    style: 'border: 2rpx solid rgba(220,220,220,1);border-radius: 12rpx;',

    templateTypeValue: [],
    templateTypeTitle: '',
    templateTypeText: '（日周月）食品销售通用模板',
    templateTypeList: [{
      label: '（日周月）食品销售通用模板',
      value: '（日周月）食品销售通用模板'
    }],


    fileList: [],
    gridConfig: {
      column: 3,
      width: 180,
      height: 180,
    },

    checkList: [],

    checkListData: [{
        checked: false,
        label: '大型企业应至少抽查22人从业人员是否掌握本单位食品安全知识是否掌握本单位。',
        checkResult: '',
        checkExceptionReason: 'A设备运转呢不正常',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '大型企业应至少抽查22人从业人员是否掌握本单位食品安全知识是否掌握本单位。',
        checkResult: '',
        checkExceptionReason: 'A设备运转呢不正常',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '大型企业应至少抽查22人从业人员是否掌握本单位食品安全知识是否掌握本单位。',
        checkResult: '',
        checkExceptionReason: 'A设备运转呢不正常',
        checkExceptionFileList: [],
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  templateTypePicker() {
    console.log(111)
    this.setData({
      templateTypeVisible: true,
      templateTypeTitle: '选择模版'
    });
  },


  onColumnChange(e) {
    console.log('picker pick:', e);
  },

  onPickerChange(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;

    console.log('picker change:', e.detail);
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
    });
  },

  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onTitlePicker() {
    this.setData({
      cityVisible: true,
      cityTitle: '选择城市'
    });
  },


  handleSuccess(e) {
    const {
      files
    } = e.detail;
    const {
      key = '0'
    } = e.currentTarget.dataset
    console.log(e)
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (index === Number(key)) {
        return {
          ...item,
          checkExceptionFileList: files,
        }
      }
      return {
        ...item
      }
    })
    this.setData({
      checkListData: tempCheckListData,
    });
  },
  handleRemove(e) {
    const {
      index: fileIndex
    } = e.detail;
    const {
      key = '0'
    } = e.currentTarget.dataset
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (index === Number(key)) {
        item.checkExceptionFileList.splice(fileIndex, 1);
      }
      return {
        ...item
      }
    })
    this.setData({
      checkListData: tempCheckListData,
    });
  },
  handleClick(e) {
    console.log(e.detail.file);
  },

  onCheckChange(e) {
    const {
      value
    } = e.detail
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (value.includes(index)) {
        return {
          ...item,
          checked: true,
        }
      }
      return {
        ...item
      }
    })

    this.setData({
      checkList: e.detail.value,
      checkListData: tempCheckListData,
    });
    console.log(e)
  },

  handleCheckResult(e) {
    const {
      key = '0 0'
    } = e.currentTarget.dataset
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (String(index) === key.split(' ')[0]) {
        return {
          ...item,
          checkResult: key.split(' ')[1]
        }
      }
      return {
        ...item
      }
    })

    this.setData({
      checkListData: tempCheckListData,
    });

  },


})