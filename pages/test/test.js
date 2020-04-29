const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var heart = ''; // 心跳失败次数
var heartBeatFailCount = 0; // 终止心跳
var heartBeatTimeOut = null; // 终止重新连接

var url = 'ws://localhost:8091/IMWebSocket/1/4/1';

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [
    // {
    //   speaker: 'server',
    //   contentType: 'text',
    //   content: '欢迎来到英雄联盟，敌军还有30秒到达战场，请做好准备！欢迎来到英雄联盟，敌军还有30秒到达战场，请做好准备！'
    // },
    // {
    //   speaker: 'customer',
    //   contentType: 'text',
    //   content: '我怕是走错片场了...'
    // },
    {
      toUser: 2,
      fromUser: 1,
      id: 1,
      content: "你好"
    },
    {
      toUser: 1,
      fromUser: 2,
      id: 2,
      content: "你也好"
    }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    zhiyeguwenInfoTest: {
      headPort: "http://housecollection.oss-cn-beijing.aliyuncs.com/loupan-picture/propCons/1585797403622_615.jpg",
      id: "1",
      louPanId: "1244467219387305985",
      phone: "18703957941",
      propName: "里斯"
    },
    userInfoTest: {
      id: '4',
      name: '永不言弃',
      sex: '0',
      phoneNumber: '17538132018',
      birthday: '2016-09-01',
      avatar: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2220134554,1179617424&fm=26&gp=0.jpg"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    initData(this);
    this.setData({
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    var that = this;
    if (!socketOpen) {
      // this.webSocket()
      // 创建Socket
      SocketTask = wx.connectSocket({
        url: url,
        data: 'data',
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: function (res) {
          console.log('WebSocket连接创建', res);
          socketOpen = true;
        },
        fail: function (err) {
          wx.showToast({
            title: '网络异常！',
          })
          console.log(err)
        },
      })
      SocketTask.onOpen(res => {
        socketOpen = true;
        console.log('监听 WebSocket 连接打开事件。', res);
      })
      SocketTask.onClose(onClose => {
        console.log('监听 WebSocket 连接关闭事件。', onClose)
        socketOpen = false;
        this.webSocket()
      })
      SocketTask.onError(onError => {
        console.log('监听 WebSocket 错误。错误信息', onError)
        socketOpen = false
      })
      SocketTask.onMessage(function (onMessage) {
        console.log(onMessage.data)
        console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data));
        var result = JSON.parse(onMessage.data);
        var chatList;
        chatList = result.data;
        if (result.code == 201) {
          // chatList=result.data;
          for (var i = 0; i < chatList.length; i++) {

            if (chatList[i].fromUser == that.data.zhiyeguwenInfoTest.id) {
              chatList[i].avatar = that.data.zhiyeguwenInfoTest.headPort;
            } else if (chatList[i].fromUser == that.data.userInfoTest.id) {
              chatList[i].avatar = that.data.userInfoTest.avatar;
            }
          }
          msgList = chatList;
          that.setData({
            msgList: chatList
          })
        }
        console.log(that.data.msgList)
        // var chatList = JSON.parse(onMessage.data);
        // console.log(chatList);
        // console.log(that.data.zhiyeguwenInfoTest);


      })
    }
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
    // calScrollHeight(this, keyHeight);

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
      fromUser: that.data.userInfoTest.id,
      avatar: that.data.userInfoTest.avatar,
      toUser: that.data.zhiyeguwenInfoTest.id,
      content: e.detail.value
    }
    console.log(socketOpen)
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
    }









  },

  webSocket: function () {
    var that = this;
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res);
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
  console.log(jsonMsg)
  console.log('通过 WebSocket 连接发送数据', JSON.stringify(jsonMsg))
  SocketTask.send({
    data: JSON.stringify(jsonMsg)
  }, function (res) {
    console.log('已发送', res)
  })
  console.log('发送完成')
}