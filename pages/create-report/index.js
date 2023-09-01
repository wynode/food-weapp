import Toast from 'tdesign-miniprogram/toast';
import { formatTime } from '../../utils/util';

Page({
  data: {
    style: 'border: 2rpx solid rgba(220,220,220,1);border-radius: 12rpx;',

    templateTypeValue: [],
    templateTypeTitle: '',
    templateTypeText: '（日周月）食品销售通用模板',
    templateTypeList: [
      {
        label: '（日周月）食品销售通用模板',
        value: '（日周月）食品销售通用模板',
      },
    ],

    showAllQualified: false,
    submitDisabled: true,
    computedColor: '#0B82FF',

    fileList: [],
    gridConfig: {
      column: 3,
      width: 180,
      height: 180,
    },

    checkList: [],
    checkPercentage: 0,
    currentDay: formatTime(new Date(), 'YYYY.MM.DD'),
    checkListData: [
      {
        checked: false,
        label: '听取周排查、日管控中发现问题汇报，研判是否存在有食品安全事故潜在风险。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '研究周排查、日管控发现问题存在的原因，整改措施是否有效，提出完善制度措施建议。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '检查公司统一信用代码证、食品经营许可（备案）证明是否在有效期内，并依法公示。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '检查公司所有从事直接入口食品制售从业人员健康证是否在有效期内。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label:
          '组织开展公司食品安全管理人员、从业人员开展食品安全培训考核，评估公司各岗位人员食品安全知识是否胜任岗位要求。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '评估公司食品贮存场所、冷藏冷冻设施设备、销售场所是否满足食品安全要求。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '每周评价是否配备与冷藏冷冻食品品种、数量相适应的设施设备。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label:
          '查验公司供应商、贮存和运输服务提供者资质合格情况，评估其遵守食品安全有关规定情况，其产品、服务是否存在食品安全潜在风险。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '评估公司其他各项食品安全管理制度执行情况，是否存在潜在食品安全风险。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '委托生产者生产食品、食品添加剂的，对受托方遵守食品安全情况开展检查，评估其生产的产品是否存在安全风险。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
      {
        checked: false,
        label: '月调度后，认为存在发生事故潜在风险隐患的，应立即采取应急处置措施，依法及时向属地监管部门报告。',
        checkResult: '',
        checkExceptionReason: '',
        checkExceptionFileList: [],
      },
    ],
  },

  onLoad(options) {
    const { allqualified = 0 } = options || {};
    if (allqualified) {
      const tempCheckListData = this.data.checkListData.map((item) => {
        return {
          ...item,
          checked: true,
          checkResult: 'success',
        };
      });
      this.setData({
        checkListData: tempCheckListData,
        checkList: Array.from(Array(11).keys()),
        showAllQualified: true,
        submitDisabled: false,
        checkPercentage: 100,
        computedColor: '',
      });
    }
  },

  templateTypePicker() {
    console.log(111);
    this.setData({
      templateTypeVisible: true,
      templateTypeTitle: '选择模版',
    });
  },

  handleSubmit() {
    wx.setStorageSync('report_data', this.data.checkListData);
    Toast({
      context: this,
      selector: '#t-toast',
      message: '提交成功',
    });
    wx.redirectTo({
      url: '/pages/e-signature/index',
    });
  },

  onColumnChange(e) {
    console.log('picker pick:', e);
  },

  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;

    console.log('picker change:', e.detail);
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
    });
  },

  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onTitlePicker() {
    this.setData({
      cityVisible: true,
      cityTitle: '选择城市',
    });
  },

  handleSuccess(e) {
    const { files } = e.detail;
    const { key = '0' } = e.currentTarget.dataset;
    console.log(e);
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (index === Number(key)) {
        return {
          ...item,
          checkExceptionFileList: files,
        };
      }
      return {
        ...item,
      };
    });
    this.setData({
      checkListData: tempCheckListData,
    });
  },
  handleRemove(e) {
    const { index: fileIndex } = e.detail;
    const { key = '0' } = e.currentTarget.dataset;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (index === Number(key)) {
        item.checkExceptionFileList.splice(fileIndex, 1);
      }
      return {
        ...item,
      };
    });
    this.setData({
      checkListData: tempCheckListData,
    });
  },
  handleClick(e) {
    console.log(e.detail.file);
  },

  onCheckChange(e) {
    const { value } = e.detail;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (value.includes(index)) {
        return {
          ...item,
          checked: true,
        };
      }
      return {
        ...item,
        checked: false,
        checkResult: '',
        checkExceptionFileList: [],
      };
    });
    const checkPercentage = (e.detail.value.length / this.data.checkListData.length) * 100;
    const submitDisabled = !(e.detail.value.length >= 5);
    this.setData({
      checkList: e.detail.value,
      checkListData: tempCheckListData,
      checkPercentage,
      submitDisabled,
      computedColor: submitDisabled ? '#FC5B5B' : '0B82FF',
    });
    console.log(e);
  },

  handleCheckResult(e) {
    const { key = '0 0' } = e.currentTarget.dataset;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (String(index) === key.split(' ')[0]) {
        return {
          ...item,
          checkResult: key.split(' ')[1],
        };
      }
      return {
        ...item,
      };
    });

    this.setData({
      checkListData: tempCheckListData,
    });
  },
  handleReasonChange(e) {
    const { key = '0' } = e.currentTarget.dataset;
    const { value } = e.detail;
    const tempCheckListData = this.data.checkListData.map((item, index) => {
      if (String(index) === String(key)) {
        return {
          ...item,
          checkExceptionReason: value,
        };
      }
      return {
        ...item,
      };
    });

    this.setData({
      checkListData: tempCheckListData,
    });
  },
});
