// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    psd: "",
    newPwd:'',
    towNewPwd:'',
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

  bindNewPwd: function (e) {
    this.setData({
      newPwd: e.detail.value
    });
  },
  bindNewTwoPwd: function (e) {
    this.setData({
      towNewPwd: e.detail.value
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


  onFocusNewPwd: function () {
    this.setData({
      newPwdFocus: 'nameFocus'
    })
  },
  onFocusTwoNewPwd: function () {
    this.setData({
      twoNewPwdFocus: 'nameFocus'
    })
  },
  onBlurNewPwd: function () {
    this.setData({
      newPwdFocus: ''
    })
  },
  onBlurTwoNewPwd: function () {
    this.setData({
      twoNewPwdFocus: ''
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
    else if (this.data.psd == ""||!this.data.psd) {
      wx.showToast({
        title: '请输入原密码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (this.data.newPwd == ""||!this.data.newPwd) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (this.data.towNewPwd == ""||!this.data.towNewPwd) {
      wx.showToast({
        title: '请再次输入新密码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (this.data.towNewPwd !== this.data.newPwd) {
      wx.showToast({
        title: '请输入相同的新密码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var obj = {
      phone: this.data.name,
      oldPassword:this.data.psd,
      newPassword:this.data.towNewPwd
    }
    // console.log(obj);
   
    var url = "https://house.hnshengen.com/mobile/cons/password";
    //  var url = "http://192.168.0.111:8091/mobile/cons/password";
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
          var url = "/pages/login/login"; 
          wx.showToast({
            title: '修改成功',
            icon:'none'
          })
          wx.redirectTo({
            url: url,
          })
          // wx.navigateTo({
          //   url: url
          // })

        }else if(res.data.code === 401) {
          wx.showToast({
            title: '账号或密码错误!',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '修改失败',
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