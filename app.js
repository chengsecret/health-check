// app.js
const api = require("./config/api")

App({
  api: api,

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 token 与 用户信息
        if (res.code) {
          wx.request({
              url: api.loginAPI,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
              data: {
                  'code': res.code,
              },

              success: function (r) {
                  console.log(r.data.data.token);
                  if(r.data.code === 0){ //登录成功
                    that.globalData.token = r.data.data.token;
                    that.globalData.name = r.data.data.name;
                    that.globalData.num = r.data.data.num;
                    that.globalData.classnum = r.data.data.classnum;

                    //检测是否有回调函数，如果有，则执行
                  if(that.userInfoCallback){
                    that.userInfoCallback(res)
                  }
                    
                    if(r.data.data.num === ''){ //需要完善个人信息
                      wx.showModal({
                        title: '个人信息待完善',
                        content: '是否完善个人信息？',
                        success (res) {
                          if (res.confirm) {
                            wx.navigateTo({
                              url: '/pages/selfset/selfset',
                            })
                          } else if (res.cancel) {
                            console.log('用户点击取消')
                          }
                        }
                      })
                    }
                  }  
              }
              
          })
      }
      }
    })
  },
  globalData: {
    name: '',
    num: '',
    classnum: '',
    token: ''
  }
})
