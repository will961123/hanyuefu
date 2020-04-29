// pages/userInfoSetting/userInfoSetting.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {

    },
    array: ['男', '女'],
    flag: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData)
    that.setData({
      userInfo: app.globalData.userInfo
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'userInfo.sex': e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'userInfo.birthday': e.detail.value
    })
  },

  // 处理 input 数据双向绑定
  handleInputChange: function (e) {

    // 取出实时的变量值
    let value = e.detail.value;

    this.setData({
      'userInfo.name': value
    })

    // 这里用于测试
    // console.log(name, ':', this.data[name]) // 显示 page 内 data 的实际数据
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 手机号验证
  blurPhone: function (e) {
    var phone = e.detail.value;
    let that = this
    if (!(/^1[34578]\d{9}$/.test(phone))) {

      this.setData({
        ajxtrue: false
      })
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 500
      })
    } else {
      this.setData({
        flag: true
      })
      console.log('验证成功', that.data.ajxtrue)
    }
  },
  primary: function () {
    console.log(this.data.userInfo)
  },
  changeAvatar: function () {
    var that = this;
    // var childId = wx.getStorageSync("child_id");
    // var token = wx.getStorageSync('token');
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths + "修改页面")
        var avatar = res.tempFilePaths;
        that.setData({
          'userInfo.avatar': avatar,
          upAvatar: true
        })
        // 上传头像
        // app.uploadimg({
        //   url: 'URL地址',
        //   path: avatar,
        //   header: {
        //     'Content-Type': 'multipart/form-data',
        //     "Authorization": "Bearer " + token
        //   },
        //   isShow: false
        // })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  }



})