// import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    fileList: [],
    shopTypeValue: [],
    shopTypeTitle: '',
    shopTypeText: '',
    shopTypeList: [{
      label: '食品餐饮',
      value: '食品餐饮'
    }],

    gridConfig: {
      column: 1,
      width: 300,
      height: 240,
    }
  },

  onLoad() {

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
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  shopTypePicker() {
    this.setData({
      shopTypeVisible: true,
      shopTypeTitle: '选择店铺类别'
    });
  },


  handleAdd(e) {
    const {
      fileList
    } = this.data;
    const {
      files
    } = e.detail;

    // 方法1：选择完所有图片之后，统一上传，因此选择完就直接展示
    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });

    // 方法2：每次选择图片都上传，展示每次上传图片的进度
    // files.forEach(file => this.uploadFile(file))
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

});