// pages/detail/detail.js
// 引入SDK核心类
import QQMapWX from '../../utils/qqmap-wx-jssdk.js';


// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'HJLBZ-RICKW-3GNRN-REOYD-4DJ3J-3NFEN' // 必填
});
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {
      picUrlList: [],
      remark: [],
      louPanName: '',
      watch: [],
      num: '',
      price: '',
      telephone: '',
      address: '',
      masterList: [],
      timeLine: [],
      bg: '',
      showB: false,

      around: [{
          'title': '交通',
          'icon': 'iconjiaotong'
        },
        {
          'title': '学校',
          'icon': 'iconxuexiao'
        },
        {
          'title': '医疗',
          'icon': 'iconyiliao'
        },
        {
          'title': '购物',
          'icon': 'icongouwu'
        },
        {
          'title': '餐饮',
          'icon': 'iconcanyin'
        }
      ],

    },
    aroundList: [],
    hxList: [],
    article: '',
    newsList: [],
    flag: 0,
    zygwList: []
  },
  toggle: function (e) {

    // console.log(e.currentTarget.dataset.index)
    // console.log(e.currentTarget.dataset.title)
    var that = this;
    var index = e.currentTarget.dataset.index;
    var title = e.currentTarget.dataset.title;
    that.setData({

      //设置active的值为用户点击按钮的索引值
      flag: index,

    });
    that.getAround(that.data.detail.address, title)


  },
  huxingClick: function (e) {

    var layoutId = e.currentTarget.dataset.index;
    app.globalData.layoutId = layoutId;
    // debugger;
    // console.log(layoutId);
    // var url = "/pages/huxingDetail/huxingDetail";
    var url = "/pages/huxingDetail/huxingDetail";
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
  zhiyeguwenAll: function () {
    var that = this;
    // debugger;
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo.phoneNumber) {
      that.setData({
        showB: true
      })
    } else {
      var phoneNumber = wx.getStorageSync('phoneNumber')
      if(phoneNumber&&phoneNumber!=='undefined'){
        app.globalData.userInfo.phoneNumber = phoneNumber
      }
      if (!app.globalData.userInfo.userId) {
        wx.showToast({
          title: '请先登录,正在跳转到登录页',
          icon: 'none',
          duration: 1300,
        })
        setTimeout(() => {
          wx.switchTab({

            url: '/pages/personInfo/personInfo'

          });
        }, 1300);
      } else if (!app.globalData.userInfo.phoneNumber) {
        wx.showToast({
          title: '正在跳转到授权页',
          icon: 'none',
          duration: 1300,
        })
        setTimeout(() => {
          var url = "/pages/shouquan/shouquan";
          wx.reLaunch({
            url: url
          })
        }, 1300);
      }




    }

  },
  closeB() {
    var that = this;
    that.setData({
      showB: false
    })
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
  // 自定义防止点透效果
  noTouch: function () {
    return;
  },
  zhiYeGuWenDetail: function (event) {
    var zhiyeguwenid = event.currentTarget.dataset.zhiyeguwenid;
    // console.log(zhiyeguwenid);

    var url = "/pages/agent/agent";
    app.globalData.zhiyeguwenid = zhiyeguwenid;
    wx.navigateTo({
      url: url
    })
  },
  chat: function (event) {
    var item = event.currentTarget.dataset.item;
    app.globalData.zhiyeguwenInfo = item;
    // console.log(app.globalData.zhiyeguwenInfo);

    var url = "/pages/chat/chat";
    wx.navigateTo({
      url: url
    })
  },

  cellPhone: function (event) {
    var phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  getZYGW(params) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/LouPanInfo/allProp";
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
        // console.log(res.data)

        that.setData({
          zygwList: res.data.data
        })
      }
    })
  },
  getLPDT(params) {
    var that = this;
    var surl = "https://house.hnshengen.com/mobile/LouPanInfo/findAll";
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

        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].dynTime = res.data.data[i].dynTime.substring(0, 10)
        }
        // console.log(res.data)
        that.setData({
          timeLine: res.data.data
        })
      }
    })
  },
  // 定位
  map: function (event) {
    var _this = this;
    var location1 = event.currentTarget.dataset.location;
    var location2 = '河南省漯河市召陵区庐山路和湘江路交叉口';

    qqmapsdk.geocoder({
      address: location1, //用户输入的地址（注：地址中请包含城市名称，否则会影响解析效果），如：'北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {
        // console.log(res)
      },
      complete: function (res) {
        // console.log(res); //经纬度对象
      }
    })

    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: location1, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) { //成功后的回调
        // console.log(res)
        var res = res.result;
        if (location1 == location2) {
          var latitude = 33.5589950000;
          var longitude = 114.1000050000;
        } else {
          var latitude = res.location.lat;
          var longitude = res.location.lng;
        }
        // console.log(latitude)
        // console.log(longitude)
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: latitude, //要去的纬度-地址
          longitude: longitude, //要去的经度-地址
          address: location1
        })
      },
      fail: function (error) {
        console.error(error);
      }
    })
  },
  moreInfo: function (e) {

    // var index = e.currentTarget.dataset.index;
    // console.log(index);

    var url = "/pages/moreInfo/moreInfo";
    wx.navigateTo({
      url: url
    })

  },
  moreHuXing: function (e) {
    var url = "/pages/moreHuXing/moreHuXing";
    wx.navigateTo({
      url: url
    })

  },
  getPhoneNumber(e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
  },
  getlocation() {

    // https://apis.map.qq.com/ws/place/v1/suggestion/?region=北京&keyword=美食&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77

  },
  getDetail(params) {
    // debugger;
    // var params = 1225308345691283457;
    var that = this;
    var result;
    wx.request({
      url: "https://house.hnshengen.com/mobile/LouPanInfo/detail",
      method: 'get',
      data: {
        louPanId: params
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        result = res.data.data;
        // console.log(res.data)
        // console.log(res.data.data)

        var arr = res.data.data;
        var str = arr.lightSpot;
        var ss = str.split(",");
        arr.lightSpot = ss;
        arr.around = [{
            'title': '交通',
            'icon': 'iconjiaotong',
            'list': []
          },
          {
            'title': '学校',
            'icon': 'iconxuexiao',
            'list': []
          },
          {
            'title': '医疗',
            'icon': 'iconyiliao',
            'list': []
          },
          {
            'title': '购物',
            'icon': 'icongouwu',
            'list': []
          },
          {
            'title': '餐饮',
            'icon': 'iconcanyin',
            'list': []
          }

        ]

        for (var i = 0; i < arr.layoutInfo.length; i++) {
          arr.layoutInfo[i].layoutLight = arr.layoutInfo[i].layoutLight.split(",")
        }

        // console.log(arr);
        result = arr;
        that.setData({
          detail: result
        })
        app.globalData.detail = result;
        wx.hideLoading();
        that.getAround(that.data.detail.address, '交通')
      }
    })
  },
  getAround(params1, params2) {
    var that = this;

    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: params1, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) { //成功后的回调
        // console.log(res)
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        // alert(latitude)
        // alert(longitude)
        var surl = "https://apis.map.qq.com/ws/place/v1/search?boundary=nearby(" + latitude + "," + longitude + ",1000)&page_size=3&page_index=1&keyword=" + params2 + "&orderby=_distance&key=HJLBZ-RICKW-3GNRN-REOYD-4DJ3J-3NFEN";
        // console.log(surl)
        wx.request({
          url: surl,
          // url: "http://localhost:8091/mobile/LouPanInfo/detail?louPanId=1225308345691283457",
          method: 'get',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            // console.log(res.data)

            that.setData({
              aroundList: res.data.data
            })
          }
        })

      },
      fail: function (error) {
        console.error(error);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // console.log(app.globalData.louPanId);
    var params = app.globalData.louPanId;
    // console.log(params)
    this.getDetail(params);
    this.getZYGW(params);
    this.getNews(params);
    this.getLPDT(params);
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

  },
  navImg: function (e) {
    var url = "/pages/navImg/navImg";
    // console.log(url)
    wx.navigateTo({
      url: url
    })

  }
})