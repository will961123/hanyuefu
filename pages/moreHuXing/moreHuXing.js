// pages/moreHuXing/moreHuXing.js
const app = getApp();
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    tabListWidth: '20',
    tabList: [],
    contentList: [

    ]

  },
  onLoad: function () {
    var that = this;
    var params = app.globalData.louPanId;
    that.getData(params);

  },
  // 模拟数据加载
  getData: function (params) {
    var that = this;
    var result;
    wx.showLoading({
      title: '加载中',
    })
    // console.log(params)
    var louPanId = params ? params : '';
    // var louPanId = '1225308345691283457';
    // console.log(condition)
    wx.request({
      url: 'https://house.hnshengen.com/mobile/LouPanInfo/layout',
      method: 'GET',
      data: {
        louPanId: louPanId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var arr = res.data.data;
        // console.log(arr);
        for (var i = 0; i < arr.length; i++) {
          // console.log(arr[i], '---------------')
          that.getDetail(louPanId, arr[i].key)
        }
        setTimeout(function () {
          wx.hideLoading();
          that.setData({
            tabList: arr
          })
        }, 500)
      }
    })
  },
  huxingClick: function (e) {

    var louPanName = e.currentTarget.dataset.name;
    // console.log(louPanName)
    var layoutId = e.currentTarget.dataset.index;
    app.globalData.layoutId = layoutId;
    app.globalData.louPanName = louPanName;
    // debugger;
    // console.log(layoutId);
    // var url = "/pages/huxingDetail/huxingDetail";
    var url = "/pages/huxingDetail/huxingDetail";
    wx.navigateTo({
      url: url
    })
  },
  // 模拟数据加载
  getDetail: function (params, params2) {
    var that = this;
    var result;
    wx.showLoading({
      title: '加载中',
    })  
    // console.log(params2, '*********')
    // console.log(condition)
    wx.request({
      // url: 'http://192.168.0.103:8091/mobile/LouPanInfo/layoutKey',
      url: 'https://house.hnshengen.com/mobile/LouPanInfo/layoutKey',
      method: 'GET',
      data: { 
        louPanId: params,
        key: params2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var arr = res.data.data;
        var obj = {};

        // console.log(arr);
        for (var j = 0; j < arr.length; j++) {
          arr[j].layoutLight = arr[j].layoutLight.split(",")
        }
        obj.huxing = arr;
        that.data.contentList.push(obj);
        // console.log(that.data.contentList, '///////////////')
        setTimeout(function () {
          wx.hideLoading();
          that.setData({
            contentList: that.data.contentList
          })
        }, 500)
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('onReachBottom')
  },
  //  tab切换逻辑
  swichNav: function (e) {

    var that = this;
    // console.log(e.target.dataset.current)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  bindChange: function (e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
})