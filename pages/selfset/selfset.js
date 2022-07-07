// pages/selfset/selfset.js
const app=getApp()
const api = app.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['获取失败'],
    index: 0,
    name: '',
    num: '',
    shouldUpdate: true 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获得班级的array
    wx.request({
      url: api.getClassnums,
      method: "get",
      header: {
        "token": app.globalData.token
      },
      success(r){
        console.log(r.data)
        that.setData({
          array: r.data
        });
        if(app.globalData.num !== ''){
          that.setData({
            name : app.globalData.name,
            num : app.globalData.num,
            index : (that.data.array || []).findIndex((item) => item === app.globalData.classnum),
            shouldUpdate : false
          })
        }
      }
    })
  },

  save: function(){
    let that = this;
    //1.三样信息都填了才能保存
    //2.交互
    //后端保存逻辑：3.更新数据库中的user和redis中的信息
    //             1.同时学号不能有一样的
    //             2.根据班级生成mid
    //3.保存成功后更新userinfo shouldUpdate = false;
     if(this.data.name !== '' && this.data.num !==''){
       //可以保存
       wx.showLoading({
        title: '正在保存中',
      })
       wx.request({
         url: api.updateUser,
         method: 'post',
         header: {
          'content-type': 'application/x-www-form-urlencoded',
          "token": app.globalData.token
         },
         data: {
           name: that.data.name,
           num: that.data.num,
           classnum: that.data.array[that.data.index]
         },
         success(r){
          if(r.data.code === 0){ //保存成功
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500
            })
              that.setData({
                shouldUpdate: false
              }),
              app.globalData.name = that.data.name;
              app.globalData.num = that.data.num;
              app.globalData.classnum = that.data.array[that.data.index]
          }else{
            wx.showToast({
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
            duration: 2000
          })
         },
         complete(){
            wx.hideLoading({
              success: (res) => {},
            })
         }
       })
     }else{
      wx.showToast({
        title: '信息不完整',
        icon: 'error',
        duration: 1500
      })
     }
  },

  update: function(){
   let that = this;
    this.setData({
      shouldUpdate: !that.shouldUpdate
    })
    wx.showToast({
      title: '请修改您的信息',
      icon: 'none',
      duration: 1500
    })
  },

  getName:function(e){
    this.setData({
      name: e.detail.value
   });
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  getNum:function(e){
    this.setData({
      num: e.detail.value
   });
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