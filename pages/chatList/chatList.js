// pages/chatList/chatList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends: [
      // {
      //   userId: '3',
      //   avatarUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2220134554,1179617424&fm=26&gp=0.jpg',
      //   nickName: '菲',
      //   nums: 3,
      //   time: '11:45',
      //   message: '我今天回来了，你来接我吧'
      // },
      // {
      //   userId: '4',
      //   avatarUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2220134554,1179617424&fm=26&gp=0.jpg',
      //   nickName: 'Rider',
      //   nums: 12,
      //   time: '11:46',
      //   message: '晚上好好虐你'
      // }
    ]
  },
  gotoChat(event) {
    const item = event.currentTarget.dataset.item;
    app.globalData.userInfo = item;
    // console.log(item);
    // console.log(app.globalData.zhiyeguwenInfo);
    wx.navigateTo({
      url: '/pages/chatAgent/chatAgent'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var zhiyeguwenInfo = app.globalData.zhiyeguwenInfo;
    // console.log(zhiyeguwenInfo.id)
    that.initData(zhiyeguwenInfo.id)
  },

  initData: function (params) {
    var that =this;
    var url = "https://house.hnshengen.com/mobile/cons/message";
    wx.request({
      url: url,
      method: 'GET',
      data: {
        id:params
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data);

        if (res.data.code == 200) {
          that.setData({
            friends:res.data.data
          });

        } else {
          wx.showToast({
            title: '没有数据',
            icon: 'none',
            duration: 1000
          })
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

  }
})