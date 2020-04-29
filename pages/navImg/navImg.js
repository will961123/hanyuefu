// pages/test/test.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    contentList: [],
    imgList:[]
  },
  getStatus(e) {
    this.setData({ status: e.currentTarget.dataset.index })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var params = app.globalData.louPanId;
    // var params = app.globalData.louPanId||'1248867654999117825';
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
 
  getData(params) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/LouPanInfo/getLouPanPic";
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
        var result =res.data.data;
        var temp=[];
        for(var i =0;i<result.length;i++){
          for(var j=0;j<result[i].list.length;j++){
            temp.push(result[i].list[j].picUrl)
          }
        }
        that.setData({
          contentList: res.data.data,
          imgList:temp
        })
      }
    })
  },
   //预览图片，放大预览
   preview(event) {
    var that =this;
    console.log(event.currentTarget.dataset.src)
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: that.data.imgList // 需要预览的图片http链接列表
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})