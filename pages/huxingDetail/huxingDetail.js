// pages/huxingDetail/huxingDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [],
    louPanName: '',
    imgalist :[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var params = app.globalData.layoutId;
    var louPanName = app.globalData.louPanName;
    
    this.setData({
      louPanName: louPanName
    })
    // console.log(louPanName)
    // console.log(params)
    this.getData(params);
  },
  fixedBox() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  getData(params) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/LouPanInfo/layoutInfo";
    wx.request({
      url: surl,
      method: 'get',
      data: {
        layoutId: params
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        // console.log(res.data);
        var arr = res.data.data;
          arr.layoutLight = arr.layoutLight.split(",")
          var tem = [];
          tem.push(arr.layoutPic)
        that.setData({
          detail: arr,
          imgalist :tem
        })
      }
    })
  },
  previewImage: function (e) {  
    var current=e.target.dataset.src;
    wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: this.data.imgalist // 需要预览的图片http链接列表
    })
} ,
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})