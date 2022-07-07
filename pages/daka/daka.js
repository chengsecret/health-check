// pages/daka/daka.js
const app=getApp()
const api = app.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasDaka: false, //用户今日是否已经打卡
    state: -1, //健康状况 0良好 1疑似/密接 2确诊 -1未填写
    stateArray: ['良好','疑似/密接','已确诊新冠'],
    zjpicture: -1, //浙江健康码颜色 无0红1黄2绿3 -1未填写
    pictureArray: ['无浙江健康码','红码','黄码','绿码'],
    longitude: 9999, //经度 9999表示未填写
    latitude: 9999 //纬度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //防止app.js中还没获取到token就执行了请求
    app.userInfoCallback = function(){
     //判断今日是否已经打卡 hasDaka
      wx.request({
        url: api.hasCheck,
        method: 'get',
        header: {
          "token": app.globalData.token
        },
        success(r){
          if(r.data.code === 0){  
            console.log(r.data)
            that.setData({
              hasDaka : true
            })
          }
        }
      })
    }
  },

  check(){ //打卡
    //1.如果不在打卡时间，禁止打卡(打卡时间为5点到22点)
    //2.信息填写不完整，禁止打卡
    //3.实现打卡，打卡成功后，hasDaka=true
    let that = this;
    let hour = new Date().getHours();
    if(hour<5 || hour > 21){
      wx.showToast({
        title: '打卡失败 请在5:00~22:00间打卡',
        icon: 'none',
        duration: 2000
      })
    }else if(that.data.state === -1 
      || that.data.zjpicture === -1 || that.data.latitude ===9999 ){
        wx.showToast({
          title: '信息填写不完整',
          icon: 'error',
          duration: 1500
        })
    } else{ //实现打卡
      wx.showLoading({
        title: '正在签到中',
      })
       wx.request({
         url: api.check,
         method: 'post',
         header: {
          'content-type': 'application/x-www-form-urlencoded',
          "token": app.globalData.token
         },
         data: {
          state: that.data.state,
          zjpicture: that.data.zjpicture,
          longitude: that.data.longitude,
          latitude: that.data.latitude
         },
         success(r){
          if(r.data.code === 0){ //保存成功
            wx.showToast({
              title: '打卡成功',
              icon: 'success',
              duration: 1500
            })
              that.setData({
                hasDaka: true  //已打卡
              })
          }else{
            wx.showToast({ //显示服务器返回的错误原因
              title: r.data.message,
              icon: 'error',
              duration: 1500
            })
          }
         },
         fail(){
          wx.showToast({
            title: '网络错误',
            icon: 'error',
            duration: 1500
          })
         },
         complete(){
            wx.hideLoading({
              success: (res) => {},
            })
         }
       })
    }
  },

  getLocation(){
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        that.setData({
          latitude: res.latitude.toFixed(6),
          longitude: res.longitude.toFixed(6)
        })
      },
      fail(){
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 1500
        })
      }
     })
  },

  hasCheck: function(){
    wx.showToast({
      title: '今日已打卡',
      icon: 'success',
      duration: 1500
    })
  },

  bindzjpictureChange: function(e){
    this.setData({
      zjpicture: e.detail.value
    })
  },

  bindStateChange: function(e){
    this.setData({
      state: e.detail.value
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