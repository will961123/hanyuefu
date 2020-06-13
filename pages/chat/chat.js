const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var socketOpen = false;
var selfClose = false
var frameBuffer_Data, session, SocketTask;
var fromId, toId, consId;
// var url = 'ws://localhost:8091/IMWebSocket/1/4/1'; 
// 买房人
// var url = 'house.hnshengen.com/IMWebSocket/4/1/1';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: '',
    scrollHeight: '100vh',
    inputBottom: 0,
    zhiyeguwenInfo: {
      // headPort: "http://housecollection.oss-cn-beijing.aliyuncs.com/loupan-picture/propCons/1585797403622_615.jpg",
      // id: "1",
      // louPanId: "1244467219387305985",
      // phone: "18703957941",
      // propName: "里斯"
    },
    userInfo: {
      // userId: '4',
      // name: '永不言弃',
      // sex: '0',
      // phoneNumber: '17538132018',
      // birthday: '2016-09-01',
      // avatarUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2220134554,1179617424&fm=26&gp=0.jpg"
    },
    inputVal: '',
    webSocketUrl: '',
    msgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    msgList = [];
    that.setData({
      userInfo: app.globalData.userInfo,
      zhiyeguwenInfo: app.globalData.zhiyeguwenInfo
    })
    fromId = that.data.userInfo.userId;
    toId = that.data.zhiyeguwenInfo.id;
    consId = that.data.zhiyeguwenInfo.id;

    // console.log(fromId, 'fromId', toId, 'toId', consId, 'consId');
    // var url = 'wss://house.hnshengen.com/IMWebSocket//userInfo.userId/zhiyeguwenInfo.id/zhiyeguwenInfo.id'
    that.data.webSocketUrl = "wss://house.hnshengen.com/IMWebSocket/" + fromId + "/" + toId + "/" + consId;
    that.bottom();

    that.webSocket()

    // 创建Socket
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res);
    }) 
  
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(function (onMessage) {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data));
      var result = JSON.parse(onMessage.data);
      var chatList;
      chatList = result.data;
      for (var i = 0; i < chatList.length; i++) {

        if (chatList[i].fromUser == that.data.zhiyeguwenInfo.id) {
          chatList[i].avatar = that.data.zhiyeguwenInfo.headPort;
        } else if (chatList[i].fromUser == that.data.userInfo.userId) {
          chatList[i].avatar = that.data.userInfo.avatarUrl;
        }
      }
      msgList = msgList.concat(chatList);;
      that.setData({
        msgList: msgList
      })
      that.bottom()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    var that = this;
    console.log(socketOpen, 'socketOpen');  
  },
  onReady: function () {
    var that = this;


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
  onHide: function () {

  },
  onUnload: function () {
    // console.log('onUnload')
    socketOpen = false;
    selfClose = true
    wx.closeSocket({
      success: res => {
        console.log(' WebSocket销毁-success', res)
        socketOpen = false;
      },
      fail: err => {
        console.log(' WebSocket销毁-err', err)
      }
    })
  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    this.calScrollHeight(this, keyHeight);

  },
  /**
   * 计算msg总高度
   */
  calScrollHeight: function (that, keyHeight) {
    var query = wx.createSelectorQuery();
    query.select('.scrollMsg').boundingClientRect(function (rect) {}).exec();
  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    var that = this;
    var obj = {
      fromUser: fromId,
      avatar: that.data.userInfo.avatarUrl,
      toUser: toId,
      content: e.detail.value
    }
    // console.log(socketOpen)
    if (socketOpen) {
      // 如果打开了socket就发送数据给服务器
      sendSocketMessage(obj);
      msgList.push(obj)
      inputVal = '';

      this.setData({
        msgList,
        inputVal
      });

      that.bottom()
    } else {
      this.webSocket()
    }
  },
  webSocket: function () {
    var that = this;
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: that.data.webSocketUrl,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {  
        console.log('WebSocket连接创建', res);
        socketOpen = true;

        setTimeout(() => {
          SocketTask.onClose(onClose => {
            console.log('监听 WebSocket 连接关闭事件。', onClose)
            console.log(selfClose)
            socketOpen = false;
            if (selfClose) {
              return false
            }
            console.log('测试再次连接', that.webSocket)
            that.webSocket()
      
          })
        }, 500);
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })

  },
  /**
   * 退回上一页
   */
  toBackClick: function () {
    debugger;
    wx.navigateBack({})
  },
  // 获取hei的id节点然后屏幕焦点调转到这个节点  
  bottom: function () {
    var that = this;
    this.setData({
      scrollTop: 1000000
    })

  }
})
//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(jsonMsg) {
  var that = this;
  SocketTask.send({
    data: JSON.stringify(jsonMsg)
  }, function (res) {
    console.log('已发送', res)
  })
  console.log('发送完成')
}