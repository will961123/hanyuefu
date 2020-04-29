// pages/project/project.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '', //搜索的内容
    videoPlay: null, //视频播放
    dataList: [], //视频播放
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    // 数据容器
    houseList: [

    ],
    //上拉加载下一页
    page: 1, //当前页数
    pageSize: 10, // 一页的数据量
    isLastPage: false, //当前是否最后一页
    tips: '上拉加载更多', //页尾提示信息
  },
  // 模拟数据加载
  getData: function (params) {
    var that = this;
    var result;
    wx.showLoading({
      title: '加载中',
    })
    // console.log(params)
    var condition = params ? params : '';
    // console.log(condition)
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
        // console.log(arr);
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
          if (result.length == 0 && that.data.page==1){
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
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    wx.hideShareMenu();
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

    // wx.request({
    //   url= 'test.php', //仅为示例，并非真实的接口地址
    //   data: {
    //     x: '',
    //     y: ''
    //   },
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success:function(res) {
    var res = {
      'status': 200,
      'data': [
        {
          'louPanName': '碧桂园沙河珑湾',//项目名称
          // 'picUrlList': 'https://img.zhichiwangluo.com/zcimgdir/album/file_5de8bdd71df62.jpg', //项目图片
          'picUrlList': [
            {
              picUrl: "https://img.zhichiwangluo.com/zcimgdir/album/file_5de8bdd71df62.jpg",
              sort: 0
            },
            {
              picUrl: "http://housecollection.oss-cn-beijing.aliyuncs.com/loupan-picture/louPan/1578124678261_553.jpg",
              sort: 1
            },
          ],
          'price': 6000,
          'sum': 6000,//想买人数//单价
          'houseType': '三室两厅',//户型
          'houseArea': '80-120',//户型面积
          'fitmentType': ['普通住宅', '海景高层', '花园洋房'],
          'remark': '靓盘好卖',
          'status': 1,// 1在售 2售罄
          'fitmentType2': '毛坯房',
          'projectBuild': '10#/15#/18#',
          'projectTime': '2020',
          'projectLocation': '漯河市郾城区太行山路与黄河西路交汇处东北角',
          "jingjiren": [{
            "name": '张梦飞',
            "photo": 'https://img.zhichiwangluo.com/zcimgdir/album/file_5e0039be6ee1e.jpg',
            "phone": "17127844659"
          }],
          "houseDescripe": [
            {
              "sldz": "漯河市郾城区太行山路与黄河西路交汇处东北角",
              "zxqk": "毛坯,公共部分精装",
              "jzlx": "普通住宅,公寓,别墅,商铺",
              "jzlb": " 联排,多层,小高层,高层,超高层",
              "zxkp": "2018年8月12号",
              "fgsj": "2021年6月",
              "cq": "70年",
              "rjl": "2.5",
              "lhl": "48%",
              "kfs": "河南天鑫置业有限公司",
              "wygs": "河南润嘉物业服务有限公司",
              "wyf": "住宅：1.1元/m²/月",
              "zdmj": "50373㎡",
              "jzmj": "500000㎡",
              "ghhs": "6000户",
              "cwzs": "5489",
              "cwb": "1:1.1"
            }
          ]
        },
        {
          'louPanName': '荣盛锦绣江南',
          // 'picUrlList': 'https://img.zhichiwangluo.com/zcimgdir/album/file_5de8bdd71df62.jpg',
          'picUrlList': [
            {
              picUrl: "https://img.zhichiwangluo.com/zcimgdir/album/file_5de8bdd71df62.jpg",
              sort: 0
            },
            {
              picUrl: "http://housecollection.oss-cn-beijing.aliyuncs.com/loupan-picture/louPan/1578124678261_553.jpg",
              sort: 1
            },
          ],
          'price': 6000,
          'sum': 6000,//想买人数
          'houseType': '三室两厅',
          'houseArea': '80-120',
          'fitmentType': ['普通住宅', '海景高层', '花园洋房'],
          'remark': '靓盘好卖',
          'status': 1,// 1在售 2售罄
          'fitmentType2': '毛坯房',
          'projectBuild': '10#/15#/18#',
          'projectTime': '2020',
          'projectLocation': '漯河市郾城区邙山路与淞江路交会处东南角',
          "jingjiren": [{
            "name": '张梦飞',
            "photo": 'https://img.zhichiwangluo.com/zcimgdir/album/file_5e0039be6ee1e.jpg',
            "phone": "17127844659"
          }],
          "houseDescripe": [
            {
              "sldz": "漯河市郾城区邙山路与淞江路交会处东南角",
              "zxqk": "毛坯,公共部分精装",
              "jzlx": "普通住宅,公寓,别墅,商铺",
              "jzlb": " 联排,多层,小高层,高层,超高层",
              "zxkp": "2018年8月12号",
              "fgsj": "2021年6月",
              "cq": "70年",
              "rjl": "2.5",
              "lhl": "48%",
              "kfs": "河南天鑫置业有限公司",
              "wygs": "河南润嘉物业服务有限公司",
              "wyf": "住宅：1.1元/m²/月",
              "zdmj": "50373㎡",
              "jzmj": "500000㎡",
              "ghhs": "6000户",
              "cwzs": "5489",
              "cwb": "1:1.1"
            }
          ]
        },
        {
          'louPanName': '泰威书香水岸 ',
          // 'picUrlList': 'https://img.zhichiwangluo.com/zcimgdir/album/file_5de8bdd71df62.jpg',
          'picUrlList': [
            {
              picUrl: "https://img.zhichiwangluo.com/zcimgdir/album/file_5de8bdd71df62.jpg",
              sort: 0
            },
            {
              picUrl: "http://housecollection.oss-cn-beijing.aliyuncs.com/loupan-picture/louPan/1578124678261_553.jpg",
              sort: 1
            },
          ],
          'price': 6000,
          'sum': 6000,//想买人数
          'houseType': '三室两厅',
          'houseArea': '80-120',
          'fitmentType': ['普通住宅', '海景高层', '花园洋房'],
          'remark': '靓盘好卖',
          'status': 1,// 1在售 2售罄
          'fitmentType2': '毛坯房',
          'projectBuild': '10#/15#/18#',
          'projectTime': '2020',
          'projectLocation': '漯河市海河路与太行山路交汇处向西200米路南',
          "jingjiren": [{
            "name": '张梦飞',
            "photo": 'https://img.zhichiwangluo.com/zcimgdir/album/file_5e0039be6ee1e.jpg',
            "phone": "17127844659"
          }],
          "houseDescripe": [
            {
              "sldz": "漯河市海河路与太行山路交汇处向西200米路南",
              "zxqk": "毛坯,公共部分精装",
              "jzlx": "普通住宅,公寓,别墅,商铺",
              "jzlb": " 联排,多层,小高层,高层,超高层",
              "zxkp": "2018年8月12号",
              "fgsj": "2021年6月",
              "cq": "70年",
              "rjl": "2.5",
              "lhl": "48%",
              "kfs": "河南天鑫置业有限公司",
              "wygs": "河南润嘉物业服务有限公司",
              "wyf": "住宅：1.1元/m²/月",
              "zdmj": "50373㎡",
              "jzmj": "500000㎡",
              "ghhs": "6000户",
              "cwzs": "5489",
              "cwb": "1:1.1"
            }
          ]
        }
      ]
    };

    setTimeout(function () {

      if (res.status !== 200) {
        app.showError()
      } else {
        wx.hideLoading();
        var newData = {};
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
  //搜索框文本内容显示
  inputBind: function (event) {
    var that =this;
    this.setData({
      inputValue: event.detail.value
    })
    that.getData(this.data.inputValue);
    // console.log('bindInput' + this.data.inputValue)

  },
  /**
  * 搜索执行按钮
  */
  query: function (event) {

    var that = this
    // console.log(this.data.inputValue)
    that.getData(this.data.inputValue);
  },
  tuijian:function(){
    var url = "/pages/tuijian/tuijian";
    wx.navigateTo({
      url: url
    })
  }
})