// pages/newsInfo/newsInfo.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:''
  },
  getData: function (params) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/LouPanInfo/selectByArtId";
    wx.request({
      url: surl,
      method: 'get',
      data: {
        id: params
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data);

        var title = res.data.data.title;

        that.setData({
          title: title
        })

        res.data.data.artContent.replace(/img/g,'images');
        var temp = WxParse.wxParse('article', 'html', res.data.data.artContent, that, 20); 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var id = app.globalData.news;
    that.getData(id);


    
    console.log(id)
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