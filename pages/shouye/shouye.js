// pages/shouye/shouye.js
const util = require('../../utils/util');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '', //搜索的内容
    videoPlay: null, //视频播放
    dataList: [], //视频播放
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    navSwiperList: [{
        "title": "买新房",
        "url": '/images/file_5b46f8c8a637a.png',
        'id': 1
      },
      {
        "title": "买二手房",
        "url": '/images/file_5b46f8c8bd137.png',
        'id': 2
      },
      {
        "title": "找租房",
        "url": '/images/file_5b46f9e6732a4.png',
        'id': 3
      },
      {
        "title": "商铺",
        "url": '/images/file_5b46fb235c49b.png',
        'id': 4
      },
      {
        "title": "好视频",
        "url": '/images/file_5b5198296d135.png',
        'id': 5
      },
      {
        "title": "我要卖房",
        "url": '/images/file_5b46fecbf2838.png',
        'id': 6
      },
      {
        "title": "我要出租",
        "url": '/images/file_5b46ffe172eb0.png',
        'id': 7
      },
      {
        "title": "写字楼",
        "url": '/images/file_5b4700baa08fb.png',
        'id': 8
      },
      {
        "title": "经纪人",
        "url": '/images/file_5b47022320f26.png',
        'id': 9
      },
      {
        "title": "排行榜",
        "url": '/images/file_5b5198273d9fb.png',
        'id': 10
      }
    ],
    msgList: [{
        title: '不能大涨更不许大跌，房价调控进入维稳模式'
      },
      {
        title: '楼市焦虑蔓延，专家：房价上升空间已不大'
      }
    ],
    imgList: [{
        imgSrc: "/common/images/hot_1.png",
        icon: "iconsousuoremenfenlei",
        msg: "热门活动"
      },
      {
        imgSrc: "/common/images/hot_2.png",
        icon: "icongongjijin",
        msg: "我要找房"
      },
      {
        imgSrc: "/common/images/hot_3.png",
        icon: "iconjisuanqiicon",
        msg: "房贷计算"
      },
      {
        imgSrc: "/common/images/hot_4.png",
        icon: "icontuijian",
        msg: "我要推荐"
      }
    ],
    // 数据容器
    houseList: [

    ],
    // 轮播图
    navList: [],
    //上拉加载下一页
    page: 1, //当前页数
    pageSize: 10, // 一页的数据量
    isLastPage: false, //当前是否最后一页
    tips: '上拉加载更多', //页尾提示信息
  },

  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var _index = e.currentTarget.dataset.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(_index + "")
    videoContextPrev.stop();

    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index + "")
      videoContext.play();
      $('video').css({
        'display': "block"
      })
    }, 500)
  },
  // 模拟数据加载
  getData: function (params) {
    var that = this;
    var result;
    wx.showLoading({
      title: '加载中',
    })
    var condition = params ? params : '';
    console.log(condition)
    wx.request({
      url: 'https://house.hnshengen.com/mobile/LouPanInfo/getAllLouPan',
      method: 'GET',
      data: {
        page: 1,
        limit: 10,
        condition: condition
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        var arr = res.data.data;
        for (var i = 0; i < arr.length; i++) {
          var str = arr[i].lightSpot;
          var ss = str.split(",");
          arr[i].lightSpot = ss;
        }
        result = arr;
        setTimeout(function () {
          wx.hideLoading();
          that.setData({
            houseList: result
          })
          app.globalData.houseList = result;

          var newData = {};
          if (arr.length < that.data.pageSize) {
            // 没有数据了，已经是最后一页
            newData.isLastPage = true;
            newData.tips = "已显示全部啦";

          }
          if (result.length == 0 && that.data.page == 1) {
            newData.tips = "没有数据~";
          }
          that.setData(newData);
        }, 500)
      }
    })
    wx.request({
      url: 'https://house.hnshengen.com/mobile/LouPanInfo/indexLunBo',
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        that.setData({
          navList: res.data.data
        })
      }
    })


  },
  //搜索框文本内容显示
  inputBind: function (event) {
    var that = this;
    this.setData({
      inputValue: event.detail.value
    })
    that.getData(this.data.inputValue);
    console.log('bindInput' + this.data.inputValue)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // util.loginFunc();

    var userInfo = wx.getStorageSync('userInfo');
    app.globalData.userInfo = userInfo;
    console.log('缓存数据',app.globalData.userInfo)


    this.getData();
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
    // 最后一页了，取消下拉功能
    if (this.data.isLastPage) {
      return
    }
    this.setData({
      page: this.data.page + 1
    });
    // console.log(this.data.isLastPage)
    // console.log(this.data.page)
    this.getData(this.data.page)
  },
  requestVideos: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var app = getApp();
    setTimeout(function () {

      if (res.status !== 200) {
        app.showError()
      } else {
        wx.hideLoading();
        var newData = {};
        // debugger;
        if (res.data.length < that.data.pageSize) {
          // 没有数据了，已经是最后一页
          newData.isLastPage = true;
          newData.tips = "已显示全部啦";
        }
        // 追加数据
        newData.houseList = that.data.houseList.concat(res.data);
        app.globalData.houseList = that.data.houseList.concat(res.data);
        that.setData(newData);
      }
    }, 500)

    //   }
    // })

  },

 /**
   * 用户点击右上角分享 
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 点击事件的处理
   */
  list: function (e) {

    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;

    // console.log(id);

    if (id == 5) {
      var url = "/pages/videoList/videoList";
      wx.navigateTo({
        url: url
      })
    }
    if (id == 9) {
      var url = "/pages/agent/agent";
      wx.navigateTo({
        url: url
      })
    }
    if (id > 4) {
      return;
    }
    var url = "/pages/houseList/houseList?id=" + id + "&title=" + title;
    wx.navigateTo({
      url: url
    })

  },
  detail: function (e) {

    var louPanId = e.currentTarget.dataset.index;
    app.globalData.louPanId = louPanId;
    // debugger;
    // console.log(louPanId);
    var url = "/pages/detail/detail";
    wx.navigateTo({
      url: url
    })

  },
  /**
   * 搜索执行按钮
   */
  query: function (event) {

    var that = this
    // console.log(111)
    that.getData(this.data.inputValue);
    // var url = "pages/project/project";
    // wx.navigateTo({
    //   url: url
    // })
  },
  tuijian:function(){
    var url = "/pages/tuijian/tuijian";
    wx.navigateTo({
      url: url
    })
  },
  findHouse: function (e) {
    var id = e.currentTarget.dataset.index;
    // console.log(id)
    if (id == 0) {
      var url = "/pages/hotActive/hotActive";
      // var url = "/pages/nodata/nodata";
      wx.navigateTo({
        url: url
      })
    }
    if (id == 1) {
      wx.switchTab({

        url: '/pages/project/project'

      });
    }
    if (id == 2) {
      var url = "/pages/jisuanqi/jisuanqi";
      wx.navigateTo({
        url: url
      })
    }
    if (id == 3) {
      var url = "/pages/tuijian/tuijian";
      wx.navigateTo({
        url: url
      })
    }

  }
})