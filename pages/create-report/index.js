import Toast from 'tdesign-miniprogram/toast';
import {
  formatTime
} from '../../utils/util'

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

    showAllQualified: false,
    submitDisabled: true,

    fileList: [],
    gridConfig: {
      column: 3,
      width: 180,
      height: 180,
    },

    checkList: [],
    checkPercentage: 0,
    currentDay: formatTime(new Date(), 'YYYY.MM.DD'),
    checkListData: [{
        checked: false,
        label: '大型企业应至少抽查2名从业人员是否掌握本单位食品安全知识。',
        checkResult: '',
        checkExceptionReason: '没有达标',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '食品经营场所环境整洁卫生，食品（含食品添加剂、食用农产品，下同）是否有被污染的风险。',
        checkResult: '',
        checkExceptionReason: '没有达标',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '接触直接入口或不需清洗即可加工的散装食品时，是否戴口罩、手套和帽子，头发不外露。',
        checkResult: '',
        checkExceptionReason: '没有达标',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '贮存食品的库房、设备、容器、工具是否清洁、安全、无害，设备运转是否正常，温度是否度符合食品安全要求。',
        checkResult: '',
        checkExceptionReason: 'A设备运转呢不正常',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '贮存食品的库房、设备、容器、工具是否清洁、安全、无害，设备运转是否正常，温度是否度符合食品安全要求。',
        checkResult: '',
        checkExceptionReason: 'A设备运转呢不正常',
        checkExceptionFileList: [],
      }
    ],
  },

  onLoad(options) {
    const {
      allqualified = 0
    } = options || {};
    if (allqualified) {
      const tempCheckListData = this.data.checkListData.map((item) => {
        return {
          ...item,
          checked: true,
          checkResult: 'success'
        }
      })
      this.setData({
        checkListData: tempCheckListData,
        checkList: Array.from(Array(5).keys()),
        showAllQualified: true,
        submitDisabled: false,
      });
    }
  },

  templateTypePicker() {
    console.log(111)
    this.setData({
      templateTypeVisible: true,
      templateTypeTitle: '选择模版'
    });
  },

  handleSubmit() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '提交成功',
    });
    wx.redirectTo({
      url: '/pages/report-list/index',
    })
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
        ...item,
        checked: false,
        checkResult: '',
        checkExceptionFileList: [],
      }
    })
    const checkPercentage = e.detail.value.length / this.data.checkListData.length * 100
    const submitDisabled = e.detail.value.length >= 2 ? false : true
    this.setData({
      checkList: e.detail.value,
      checkListData: tempCheckListData,
      checkPercentage,
      submitDisabled,
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