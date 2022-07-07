const dakaAPI = "http://ctstudy.xyz:9999/wx/daka/"  //修改此处url
const pictureAPI = "http://ctstudy.xyz:9999/wx/picture/"  //修改此处url

module.exports = {
  loginAPI: dakaAPI + "user/login", // 登录接口
  getClassnums: dakaAPI + "user/getClassnums", //获取所有班级号
  updateUser: dakaAPI + "user/update", //更新用户信息
  hasCheck: dakaAPI + "hasCheck", //判断今日是否已打卡
  check: dakaAPI + "check", //每日打卡
  getRecords: dakaAPI + "getRecord", //获得打卡记录的日期
  getContinuousNum: dakaAPI + "getContinuousNum", //获取连续打卡天数
  getColor: dakaAPI + "user/color", //获取当前健康码颜色与原因
  isCheck: pictureAPI + "hasCheck", //获取上条打卡记录是否已经被审核
  applyRecord: pictureAPI + "apply", //申请绿码
  passPict: pictureAPI + "getPassPict", //获取通行码
}