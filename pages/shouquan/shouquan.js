// 引入SDK核心类
import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'HJLBZ-RICKW-3GNRN-REOYD-4DJ3J-3NFEN' // 必填
});

const app = getApp();
// const util = require('../../utils/util');
Page({
  data: {
    userInfo: {},
    openId: '',
    checkOutFlag: false,
    sessionKey:'',
    state:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    var that = this;
 
    wx.login({
      success(res) {
        console.log(res);
        var code = res.code
        wx.request({
          url: 'https://house.hnshengen.com/mobile/wx/code2session',
          method: "get",
          data: {
            code
          },
          success: function(res) {
            console.log(res.data);
            // checkUser(res.data.openid);
            that.setData({
              sessionKey: res.data.session_key
            });
            
          },
          error: function(res) {
            console.log(res)
          }
        })
      }
    })


   
  },
  
  saveUser(obj) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/user/update";
    wx.request({
      url: surl,
      method: 'get',
      data: obj,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {

        if (res.data.code == 401) {
          console.log('插入数据失败')
        } else {
          // debugger;
          // console.log(app.globalData.userInfo);
          app.globalData.userInfo.userId = res.data.data;
          console.log(app.globalData.userInfo);
          that.goShouYe();
        }
      }
    })
  },
  //信息授权点击了允许
  // getUserInfo: function(e) {
  //   var that = this;
  //   // debugger
  //   console.log(e);
  //   if (e.detail.userInfo) {
  //     e.detail.userInfo.openId = app.globalData.openId;
  //     app.globalData.userInfo = e.detail.userInfo
  //     that.setData({
  //       userInfo: e.detail.userInfo,
  //     })

  //     console.log(e.detail.userInfo);
  //     that.saveUser(e.detail.userInfo)
  //   }else{
  //   }
  // },
  // 跳转到首页
  goShouYe() {
    // return;
    var url = "/pages/shouye/shouye";
    wx.reLaunch({
      url: url
    })
  },
  //位置授权
  onAuthLocation() {
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        // console.log('成功：', res)
        this.onGetLocation(); //获取位置
      },
      fail: (res) => {
        console.log('失败：', res)
      },
    })
  },
  //获取位置
  onGetLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        // console.log('latitude', latitude)
        // console.log('latitude', longitude)

        //根据经纬度获取所在城市
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            // console.log(res)
            console.log(res.result.address_component.city)
          }
        });
        // console.log('成功：', res)
      },
      fail: (res) => {
        console.log('失败：', res)
      },
    })
  },
  // 获取用户手机号
  getPhoneNumber(e) {
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    console.log( e.detail.encryptedData,"encryptedData----");
    console.log(e.detail.iv, "iv");
    console.log(that.data.sessionKey, "that.data.sessionKey");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: 'https://house.hnshengen.com/mobile/wx/decryptData',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: that.data.sessionKey
        },
        method: "get",
        success: function(res) {
          var result = JSON.parse(res.data);
          console.log(result.phoneNumber);
          var obj={
            phoneNumber: result.phoneNumber
          }
          app.globalData.userInfo.phoneNumber = result.phoneNumber;
          wx.setStorageSync('userInfo', app.globalData.userInfo);
          if(result.phoneNumber&&result.phoneNumber!=='undefined'){

            wx.setStorageSync('phoneNumber', result.phoneNumber);
          }
          console.log(app.globalData.userInfo);
          that.saveUser(app.globalData.userInfo)
        }
      })
    }else{
      console.log(app.globalData.userInfo)
      app.globalData.userInfo.phoneNumber = '';
      wx.showToast({
        title: '授权您的手机号以便享受更多功能',
        icon: 'none',
        duration: 1300,
      })
      setTimeout(() => {
        wx.navigateBack({
            delta: 1
        })
      }, 1300);
    }
  },
  //授权面板
  gotoSetting() {
    wx.openSetting({
      success: (res) => {
        console.log(res)
      }
    })
  },
})