// pages/passPict/passPict.js
const app=getApp()
const api = app.api
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: "",
    name: '',
    num: '',
    classnum: '',
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: app.globalData.name,
      num: app.globalData.num,
      classnum: app.globalData.classnum
    })
    let that = this;
      wx.request({
        url: api.passPict,
        method: "get",
        header: {
          "token": app.globalData.token
        },
        success(r){
          that.setData({
            path: 'http://' + r.data
          })
        }
      })
      setInterval(function(){
          that.setData({
              time: util.formatTime(new Date())
          });    
      },1000);
  },

  getTime:function(e){
      var that = this;
      var currentTime = util.formatTime(new Date());
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