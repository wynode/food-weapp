/*
 * @Author: wynode bugeikela@gmail.com
 * @Date: 2023-10-19 00:11:55
 * @LastEditors: wynode bugeikela@gmail.com
 * @LastEditTime: 2023-10-19 00:13:29
 * @FilePath: \weapp\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import updateManager from './common/updateManager';

App({
  // onLaunch: function () {},
  onShow: function () {
    updateManager();
  },
  async onLaunch() {
    const c1 = new wx.cloud.Cloud({
      resourceAppid: 'wx48a4230fe919bc57', // 环境所属的账号appid
      resourceEnv: 'prod-2gdukdnr11f1f68a', // 微信云托管的环境ID
    });
    await c1.init();
    this.cloud = c1;
    // 在页面js中，可以使用getApp().cloud
  },
  async call(obj, number = 0) {
    const c1 = new wx.cloud.Cloud({
      resourceAppid: 'wx48a4230fe919bc57', // 环境所属的账号appid
      resourceEnv: 'prod-2gdukdnr11f1f68a', // 微信云托管的环境ID
    });
    await c1.init();
    this.cloud = c1;
    const that = this;
    if (that.cloud === null) {
      that.cloud = new wx.cloud.Cloud({
        resourceAppid: 'wx48a4230fe919bc57', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
        resourceEnv: 'prod-2gdukdnr11f1f68a', // 微信云托管的环境ID
      });
      await that.cloud.init(); // init过程是异步的，需要等待init完成才可以发起调用
    }
    try {
      obj.header = obj.header || {};
      const result = await that.cloud.callContainer({
        ...obj,
        path: obj.path, // 填入业务自定义路径和参数，根目录，就是 /
        method: obj.method || 'GET', // 按照自己的业务开发，选择对应的方法
        // dataType:'text', // 如果返回的不是json格式，需要添加此项
        header: {
          ...obj.header,
          'X-WX-SERVICE': 'koa-nu2x', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 'x-wx-openid': 'wx48a4230fe919bc57',
          // 'x-wx-unionid': '1',
          // 其他header参数
        },
        // 其余参数同 wx.request
      });
      console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`);
      console.log(result)
      if (result.data.code && result.data.code !== 0) {
        wx.showToast({
          icon: 'none',
          title: result.data.message,
        })
      }
      return result; // 业务数据在data中
    } catch (e) {
      const error = e.toString();
      // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
      if (error.indexOf("Cloud API isn't enabled") !== -1 && number < 3) {
        return new Promise((resolve) => {
          setTimeout(function () {
            resolve(that.call(obj, number + 1));
          }, 300);
        });
      } else {
        throw new Error(`微信云托管调用失败${error}`);
      }
    }
  },
});
