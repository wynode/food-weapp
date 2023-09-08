import Toast from 'tdesign-miniprogram/toast';

Page({
  data: {
    fileList: [],
    userPositionValue: [],
    userPositionTitle: '',
    userPositionText: '',
    userPositionList: [
      {
        label: '食品安全员  ',
        value: '食品安全员',
      },
      {
        label: '食品安全总监',
        value: '食品安全总监',
      },
      {
        label: '负责人',
        value: '负责人',
      },
    ],

    gridConfig: {
      column: 1,
      width: 280,
      height: 280,
    },

    personalName: '',
    submitActive: false,
    businessCode: '',
    personalPhone: '',

    value1: [0, 1],
    userRole: ['day', 'week', 'month'],
  },

  onLoad() {},

  onChange1(e) {
    this.setData({
      value1: e.detail.value,
    });
  },

  avatarUrl() {
    return this.data.fileList[0]
      ? this.data.fileList[0].url
      : 'https://prod-2gdukdnr11f1f68a-1320540808.tcloudbaseapp.com/image/shop_user.png?sign=ada09695e56c3586b37e808eac1157e7&t=1694003113';
  },

  handleEditAvatar() {
    const uploadComponent = this.selectComponent('#avatar-upload');
    uploadComponent.onAddTap();
  },

  userRoleChange(e) {
    console.log(e);
  },

  goReportList() {
    const isLegal = true;
    if (isLegal) {
      wx.setStorageSync('user_data', this.data);
      wx.redirectTo({
        url: '/pages/report-list/index',
      });
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请填写完整',
      });
    }
  },

  onColumnChange(e) {
    console.log('picker pick:', e);
  },

  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;

    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
    });
  },

  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  userPositionPicker() {
    console.log(111);
    this.setData({
      userPositionVisible: true,
      userPositionTitle: '请选择员工身份',
    });
    this.setData({
      submitActive: true,
    });
  },

  handleAdd(e) {
    const { fileList } = this.data;
    const { files } = e.detail;
    console.log(e.detail, 222);

    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });
  },

  handleRemove(e) {
    const { index } = e.detail;
    const { fileList } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },
});
