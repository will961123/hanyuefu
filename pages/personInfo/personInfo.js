// pages/personInfo/personInfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.userInfo);
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
          success: function (res) {
            console.log(res.data);

            that.setData({
              openId: res.data.openid
            })
            that.checkUser(res.data.openid);
            // wx.getUserInfo({
            //   success: function(res) {
            //     that.setData({
            //       nickName: res.userInfo.nickName,
            //       avatarUrl: res.userInfo.avatarUrl,
            //     })
            //   },
            //   fail: function() {
            //     // fail
            //     console.log("获取失败！")
            //   },
            //   success: function(res) {
            //     console.log(res)
            //     console.log("获取用户信息成功！");
            //     app.globalData.userInfo = res.userInfo;
            //     that.setData({
            //       userInfo: res.userInfo
            //     })
            //     console.log(app.globalData.userInfo);
            //   }
            // })


            that.setData(res.data);
          },
          error: function (res) {
            console.log(res)
          }
        })
      }
    })




    that.setData({
      userInfo: app.globalData.userInfo
    })
  },
  checkUser(openId) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/user/userInfo";
    wx.request({
      url: surl,
      method: 'get',
      data: {
        openId: openId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('是否在数据库', res.data.code);
        console.log('是否在数据库', res.data.data);
        if (res.data.code !== 401) {
          that.setData({
            checkOutFlag: true,
            userInfo: res.data.data
          })
          app.globalData.userInfo = res.data.data;
          wx.setStorageSync('userInfo', res.data.data)
          console.log('手机号', res.data.data.phoneNumber);
          if (res.data.data.phoneNumber && res.data.data.phoneNumber !== 'undefined') { 
            wx.setStorageSync('phoneNumber', res.data.data.phoneNumber)
          }
          if (res.data.data.phoneNumber == undefined) {
            setTimeout(() => {
              var url = "/pages/shouquan/shouquan";
              wx.reLaunch({
                url: url
              })
            }, 1000);

          }
        } else {
          that.setData({
            checkOutFlag: false,
            userInfo: {}
          })
          app.globalData.userInfo = {};
          // that.saveUser(that.data.userInfo)
          // that.goShouYe();

        }
        // that.goShouYe();
      }

    })
  },
  //信息授权点击了允许
  getUserInfo: function (e) {
    var that = this;
    // debugger
    console.log(e);
    if (e.detail.userInfo) {
      e.detail.userInfo.openId = that.data.openId;
      app.globalData.userInfo = e.detail.userInfo
      // wx.setStorageSync('userInfo', e.detail.userInfo)
      that.setData({
        userInfo: e.detail.userInfo,
      })

      // console.log(e.detail.userInfo);
      that.saveUser(e.detail.userInfo)
      // return;
    } else {

    }
  },
  saveUser(obj) {

    var that = this;
    var surl = "https://house.hnshengen.com/mobile/user/saveUserInfo";
    wx.request({
      url: surl,
      method: 'get',
      data: obj,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.setStorageSync('userInfo', app.globalData.userInfo);
        if (res.data.code == 401) {
          console.log('插入数据失败')
        } else {

          app.globalData.userInfo.userId = res.data.data;


          wx.switchTab({
            url: '/pages/shouye/shouye'
          });
          console.log(app.globalData.userInfo);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  zhiyeguwen: function () {
    app.globalData.isZYGW = true;
    var url = "/pages/login/login";
    wx.navigateTo({
      url: url
    })
  },
  detail: function () {
    console.log('11981');
    // var url = "/pages/mingpianjia/mingpianjia";
    var url = "/pages/nodata/nodata";
    wx.navigateTo({
      url: url
    })
  }
})