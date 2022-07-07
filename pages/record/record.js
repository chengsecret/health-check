// pages/record/record.js
var util = require('../../utils/util.js');
const app=getApp()
const api = app.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: [], //存放一个月的天数数组
    signUp: [], //用户判断当天是否已打卡  

    //用于判断
    cur_year: 0, //年
    cur_month: 0, //月

    count: 0, //累计打卡的数量
    continuous_daka_count: 0, //连续打卡次数

    //打卡状态的数组
    dakaArr: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前年月  
    const date = new Date();
    var _cur_year = date.getFullYear();
    var _cur_month = date.getMonth() + 1;
    var _weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    let that = this;

    this.setData({
      cur_year: _cur_year,
      cur_month: _cur_month,
      weeks_ch: _weeks_ch,
    })
    this.calculateEmptyGrids(this.data.cur_year, this.data.cur_month); // 计算当月1号前空了几个格子，把它填充在days数组的前面
    this.calculateDays(this.data.cur_year, this.data.cur_month); // 绘制当月天数占的格子，并把它放到days数组中
    //获取当前用户当前任务的人签到状态
    that.onGetSignUp();
    
  },

  // 获取当月共多少天
  getThisMonthDays: function(year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 获取当月第一天星期几
  getFirstDayOfWeek: function(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids: function(year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({
      days: [],
    });
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: null,
          isSign: false
        }
        that.data.days.push(obj);
      }
      this.setData({
        days: that.data.days,
      });
      //清空
    } else {
      this.setData({
        days: []
      });
    }
  },

  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays: function(year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: false
      }
      that.data.days.push(obj);
    }
    this.setData({
      days: that.data.days
    });

  },

  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign() {
    var that = this;
    var signs = that.data.signUp;
    var daysArr = that.data.days;
    for (var i = 0; i < signs.length; i++) {
      var current = new Date(signs[i]);
      var year = current.getFullYear();
      var month = current.getMonth() + 1;
      var day = current.getDate();
      day = parseInt(day);
      for (var j = 0; j < daysArr.length; j++) {
        //年月日相同并且已打卡
        if (year == that.data.cur_year && month == that.data.cur_month && daysArr[j].date == day) {
          daysArr[j].isSign = true;
        }
      }
    }
    that.setData({
      days: daysArr
    });
    
    that.onJudgeContinuousClock();
  },

  //判断连续打卡次数
  onJudgeContinuousClock() {
    var that = this;
    //从后端去获取
    wx.request({
      url: api.getContinuousNum,
      method: 'get',
      header: {
        "token": app.globalData.token
      },
      success(r){
        if(!isNaN(r.data)){
          that.setData({
            continuous_daka_count: r.data
          })
        }
      }
    })
  },

  // 切换控制年月，上一个月，下一个月
  handleCalendar: function(e) {
    var that = this;
    const handle = e.currentTarget.dataset.handle;
    const cur_year = that.data.cur_year;
    const cur_month = that.data.cur_month;

    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onGetSignUp();
    } else {

      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
     
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onGetSignUp();
    }
  },

  //获取当前用户该任务的签到数组
  onGetSignUp: function() {
    var that = this;
    wx.request({
      url: api.getRecords,
      method: 'get',
      header: {
        "token": app.globalData.token
      },
      success(r){
        console.log(r.data)
        that.setData({
          dakaArr: r.data,
          signUp: r.data,
          count: r.data.length
        })
        //获取后就判断签到情况
        that.onJudgeSign();
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