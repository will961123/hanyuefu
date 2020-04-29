// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    psd: "",
    grant_type: "password"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.closeSocket();

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
  bindUsername: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  bindPassword: function (e) {
    this.setData({
      psd: e.detail.value
    });
  },
  onFocusPsd: function () {
    this.setData({
      psdFocus: 'psdFocus'
    })
  },
  onBlurPsd: function () {
    this.setData({
      psdFocus: ''
    })
  },
  onFocusName: function () {
    this.setData({
      nameFocus: 'nameFocus'
    })
  },
  onBlurName: function () {
    this.setData({
      nameFocus: ''
    })
  },
  login: function () {
    if (this.data.name == "") {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    // else if (this.data.psd == "") {
    //   wx.showToast({
    //     title: '请输入密码',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return;
    // }
    var obj = {
      phone: this.data.name
    }
    // console.log(obj);
   
    var url = "https://house.hnshengen.com/mobile/cons/login";
    wx.request({
      url: url,
      method: 'GET',
      data: obj,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        if (res.data.code == 200) {
          app.globalData.zhiyeguwenInfo = res.data.data;
          var url = "/pages/chatList/chatList";
          wx.navigateTo({
            url: url
          })

        } else {
          wx.showToast({
            title: '登陆失败',
            icon: 'none',
            duration: 1000
          })
        }


      }
    })
    // wx.setStorage({
    //   key: "myUsername",
    //   data: __test_account__ || this.data.name.toLowerCase()
    // });


  }
})