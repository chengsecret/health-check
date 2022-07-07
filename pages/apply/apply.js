// pages/apply/apply.js
const app=getApp()
const api = app.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: 0, //当前健康码颜色 绿紫黄红1234
    colorArray: ['未知','绿色','紫色','黄色','红色'],
    reason: 0, //健康码颜色的原因
    reasonArray: ['未知','','未连续打卡','处中高风险地区','','疑似/确诊','浙江健康码非绿'],

    tripFilePath: '', //大数据行程码的本地路径
    tripPicture: '' ,//base64格式的图片
    tripType: '',
    reportFilePath: '', //核酸检测报告
    reportPicture: '',
    reportType: '',

    isCheck: true  //上一条打卡记录的审核状态

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取 当前健康码颜色与原因
    wx.request({
      url: api.getColor,
      method: 'get',
        header: {
          "token": app.globalData.token
        },
        success(r){
          if(r.data.code === 0){
            that.setData({
              color: r.data.data.color,
              reason: r.data.data.reason
            })
          }
        }
    }),
    //获取上一条打卡记录的审核状态
    wx.request({
      url: api.isCheck,
      method: 'get',
        header: {
          "token": app.globalData.token
        },
        success(r){
          if(r.data.code === 0){
            console.log(r.data)
            that.setData({
              isCheck: r.data.data
            })
          }
        }
    })
  },

  send(){
    let color = this.data.color;
    let that = this;
    if(color === 0){ //onload没有获取到当前行程码颜色
      wx.showToast({
        title: '网络错误',
        icon: 'error',
        duration: 1500
      })
    }else if(this.data.tripPicture === ''){
      wx.showToast({
        title: '请上传行程卡',
        icon: 'error',
        duration: 1500
      })
    }else if((color === 3 || color === 4) && this.data.reportPicture === ''){
      //为黄码或红码，需要上传核酸报告
      wx.showToast({
        title: '请上传核酸报告',
        icon: 'error',
        duration: 1500
      })
    }else{ //发送申请
      wx.showLoading({
        title: '正在发送中',
      })
      wx.request({
        url: api.applyRecord,
        method: 'post',
        header: {
         'content-type':'application/json',
         "token": app.globalData.token
        },
        data: {
         color: that.data.color,
         reason: that.data.reason,
         tripType: that.data.tripType,
         tripPicture: that.data.tripPicture,
         reportPicture: that.data.reportPicture,
         reportType: that.data.reportType
        },
        success(r){
         if(r.data.code === 0){ //保存成功
           wx.showToast({
             title: '发送成功',
             icon: 'success',
             duration: 1500
           })
           //申请状态改一下  
           that.setData({
             isCheck: false //该申请正在审核中
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
           title: '发送失败',
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

  uploadTrip: function(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths[0].split('.')[1])
        that.setData({
          tripFilePath: tempFilePaths[0],
          tripType: tempFilePaths[0].split('.')[1] //文件类型
        })
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths[0],
          encoding: "base64",
          success: res => { //成功的回调
            //返回base64格式
            // console.log('data:image/png;base64,' + res.data)
            that.setData({
              tripPicture:res.data
            })
          
          }
        })
      }
    })
  },

  uploadReport: function(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          reportFilePath: tempFilePaths[0],
          reportType: tempFilePaths[0].split('.')[1]
        })
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths[0],
          encoding: "base64",
          success: res => { //成功的回调
            //返回base64格式
            // console.log('data:image/png;base64,' + res.data)
            that.setData({
              reportPicture:res.data
            })
          
          }
        })
      }
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