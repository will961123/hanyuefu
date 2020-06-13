// pages/agent/agent.js
const app = getApp();
// 引入SDK核心类
import QQMapWX from '../../utils/qqmap-wx-jssdk.js';


// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'HJLBZ-RICKW-3GNRN-REOYD-4DJ3J-3NFEN' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    saveUrl: '',
    imgDraw: {},

    propId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    var params
    // wx.scanCode({
    //   success: (res) => {
    //     console.log(res.path.split('=')[1].split('a')[0])
    //   },
    // })
    if (e.scene) {
      console.log('二维码来')
      let scene = String(decodeURIComponent(e.scene)).split('a')[0]
      params = String(scene)
    } else {
      params = e.id ? e.id : app.globalData.zhiyeguwenid;
    } 
    this.setData({
      propId: params
    })
    that.getData(params);


  },
  gotoHome(){
    wx.switchTab({
      url: '/pages/shouye/shouye',
    })
  },
  getQrcode(e) { 
    var propId = e.currentTarget.dataset.id
    console.log(propId)
    wx.showLoading({
      title: '生成二维码',
      mask: true
    })
    wx.request({
      url: 'https://house.hnshengen.com/mobile' + '/qrCode/getQRCode',
      data: {
        propId: propId
      },
      success: res => {
        console.log('生成二维码', res)
        if (res.data.code === 200) {
          var drawInfo = {
            bg: '/common/images/BGG2.png',
            top: '/common/images/topp2.png',
            header: this.data.detail.headPort,
            qrcode: res.data.data.codeUrl,
            userName: this.data.detail.propName,
            tip: '',
            houseName: this.data.detail.louPan
          }
          this.initDraw(drawInfo)
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '生成二维码失败!',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.log('22',err)
        wx.hideLoading()
        wx.showToast({
          title: '生成二维码失败!',
          icon: 'none'
        })
      }

    })
  },
  initDraw(drawInfo) {
    this.setData({
      imgDraw: {
        width: '750rpx',
        height: '1334rpx',
        background: drawInfo.bg,
        views: [{
            type: 'image',
            url: drawInfo.top || '/common/images/topp.jpg',
            css: {
              top: '32rpx',
              left: '30rpx',
              right: '32rpx',
              width: '688rpx',
              height: '420rpx',
              borderRadius: '16rpx'
            },
          },
          {
            type: 'image',
            url: drawInfo.header || '',
            // url: drawInfo.header || 'https://qiniu-image.qtshe.com/default-avatar20170707.png',
            css: {
              top: '404rpx',
              left: '328rpx',
              width: '96rpx',
              height: '96rpx',
              borderWidth: '6rpx',
              borderColor: '#FFF',
              borderRadius: '96rpx'
            }
          },
          {
            type: 'text',
            text: drawInfo.userName || '置业顾问',
            css: {
              top: '532rpx',
              fontSize: '28rpx',
              left: '375rpx',
              align: 'center',
              color: '#3c3c3c'
            }
          },
          {
            type: 'text',
            text: drawInfo.tip || `邀请您参观`,
            css: {
              top: '576rpx',
              left: '375rpx',
              align: 'center',
              fontSize: '28rpx',
              color: '#3c3c3c'
            }
          },
          {
            type: 'text',
            text: drawInfo.houseName || `东润·翰悦府`,
            css: {
              top: '644rpx',
              left: '375rpx',
              maxLines: 1,
              align: 'center',
              fontWeight: 'bold',
              fontSize: '44rpx',
              color: '#3c3c3c'
            }
          },
          {
            type: 'image',
            url: drawInfo.qrcode || 'http://housecollection.oss-cn-beijing.aliyuncs.com/loupan-picture/qRCode/1587952810076_979.png',
            css: {
              top: '834rpx',
              left: '470rpx',
              width: '200rpx',
              height: '200rpx'
            }
          }
        ]
      }
    })
  },
  onImgOK(e) {
    console.log('ok', e)
    wx.hideLoading()
    this.setData({
      saveUrl: e.detail.path
    })
  },
  saveImg() {
    wx.showLoading({
      title: '保存图片...',
      mask: true
    })
    wx.getSetting({
      success(res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //用户允许授权，保存图片到相册
              console.log(111)
              wx.hideLoading()
              savePhoto();
            },
            fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
              console.log(555)
              wx.hideLoading()
              wx.showModal({
                title: '授权',
                content: '请允许相册权限',
                success: res => {
                  if (res.confirm) {
                    wx.openSetting({
                      success() {
                        console.log(222)
                        wx.authorize({
                          scope: 'scope.writePhotosAlbum',
                          success() {
                            console.log(333)
                            savePhoto();
                          }
                        })
                      },
                      fail: err => {
                        console.log(666, err)
                      }
                    })
                  }
                }
              })

            }
          })
        } else { //用户已授权，保存到相册
          console.log(444)
          wx.hideLoading()
          savePhoto()
        }
      }
    })
    var that = this

    function savePhoto() {
      wx.showLoading({
        title: '保存图片...',
        mask: true
      })
      wx.saveImageToPhotosAlbum({
        filePath: that.data.saveUrl,
        success: res => {
          wx.hideLoading()
          wx.showModal({
            title: '保存成功',
            content: '图片保存成功!',
            showCancel: false,
            success: res => {
              that.setData({
                saveUrl: ''
              })
            }
          })
          console.log('图片保存成功', res)
        },
        fail: err => {
          wx.hideLoading()
          wx.showModal({
            title: '保存失败',
            content: '图片保存失败!',
            showCancel: false,
            success: res => {
              that.setData({
                saveUrl: ''
              })
            }
          })
          console.log('图片保存失败', err)
        }
      })
    }

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
  onShareAppMessage: function (res) {
    console.log(res)
    return {
      title: '金牌置业顾问',
      path: '/pages/agent/agent?id=' + app.globalData.zhiyeguwenid,
      imageUrl: "",
      success: (res) => {
        // console.log("转发成功", res);
      },
      fail: (res) => {
        // console.log("转发失败", res);
      }
    }
  },
  // 模拟数据加载
  getData: function (params) {
    var that = this;
    var result;
    wx.showLoading({
      title: '加载中',
    })
    // console.log(params)
    var id = params ? params : '';
    // var louPanId = '1225308345691283457';
    // console.log(condition)
    wx.request({
      url: 'https://house.hnshengen.com/mobile/cons/info',
      method: 'GET',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var arr = res.data.data;
        // console.log(arr);

        setTimeout(function () {
          wx.hideLoading();
          that.setData({
            detail: arr
          })
        }, 500)
      }
    })
  },
  cellPhone: function (event) {
    var phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
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
        // var latitude = res.location.lat;
        // var longitude = res.location.lng;
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
  }
})