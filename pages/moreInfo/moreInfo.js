// pages/moreInfo/moreInfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },
  getData(params) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/LouPanInfo/detail";
    wx.request({
      url: surl,
      method: 'get',
      data: {
        louPanId: params
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        that.setData({
          detail: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var params = app.globalData.louPanId;
    this.getData(params);
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

  }
})