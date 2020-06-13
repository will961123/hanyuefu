// pages/hotActive/hotActive.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews('1248867654999117825')
  },
  newsInfo: function (event) {
    var news = event.currentTarget.dataset.news;
    // console.log(news);

    var url = "/pages/newsInfo/newsInfo";
    app.globalData.news = news;
    wx.navigateTo({
      url: url
    })
  },
  getNews: function (params) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/LouPanInfo/selectArticleById";
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
        // console.log(res.data.data)
        var list = res.data.data;

        that.setData({
          newsList: list
        })
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

  }
})