const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const app = getApp();
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function test(){
  console.log('util.js');
}
function checkUser(openId) {
  var surl = "https://house.hnshengen.com/mobile/user/userInfo";
  wx.request({
    url: surl,
    method: 'get',
    data: {
      openId: openId
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function(res) {
    
      if (res.data.code !== 401) {
        console.log('在数据库', res.data.code)
        app.globalData.userInfo = res.data.data;
        var url = "/pages/shouye/shouye";
        wx.reLaunch({
          url: url
        })
      } else {
        console.log('不在数据库', res.data.code)
        app.globalData.openId = openId; 
      }
    }
    
  })
}
function loginFunc(){
  wx.login({
    success(res) {
      console.log(res);
      var code = res.code
      wx.request({
        url: 'https://house.hnshengen.com/mobile/wx/code2session',
        method: "get",
        data: {
          code
        },
        success: function(res) {
          console.log(res.data);
          checkUser(res.data.openid);
          // that.setData({
          //   openId: res.data.openid
          // })
          // that.checkUser(res.data.openid);
          // wx.getUserInfo({
          //   success: function(res) {
          //     console.log(res)
          //     // that.setData({
          //     //   nickName: res.userInfo.nickName,
          //     //   avatarUrl: res.userInfo.avatarUrl,
          //     // })
          //   },
          //   fail: function() {
          //     // fail
          //     console.log("获取失败！")
          //   },
          //   success: function(res) {
          //     console.log(res)
          //     console.log("获取用户信息成功！");
          //     app.globalData.userInfo = res.userInfo;
          //     // that.setData({
          //     //   userInfo: res.userInfo
          //     // })
          //     console.log(app.globalData.userInfo);
          //     // that.goShouYe();
          //   }
          // })


          // that.setData(res.data);
        },
        error: function(res) {
          console.log(res)
        }
      })
    }
  })
}
module.exports = {
  formatTime: formatTime,
  test:test,
  loginFunc:loginFunc
}
