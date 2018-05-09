let localhostDev = true;
//如果是本地开发，就把localhostDev 设置成true，连接就是拼成‘http://www.xxx.com/api’
//生产环境，就把localhostDev 设置成false，连接就是拼成‘http://xxx.com/api/test’
let _host = localhostDev ? '' : ''
let httpUrl = {
	'signIn': _host + '/index.php/zww/user/login.html', //登录-手机号码登录
	'sendPhoneCode': _host + '/index.php/zww/user/send.html', //登录-手机号码验证码
	'getTabList': _host + '/index.php/zww/index/label.html', //首页-获取tab列表
	'getBannerList': _host + '/index.php/zww/index/banner.html', //首页-获取banner列表
	'dollList': _host + '/index.php/zww/index/index.html',       //首页-娃娃列表
	'usersignState': _host + '/index.php/zww/user/usersign.html',//获取是否签到状态
	'usersignInfo': _host + '/index.php/zww/user/usersign_info.html', //没有签到，拿签到信息
	'signNow': _host + '/index.php/zww/user/usersign_do.html',        //立即签到
	'goldDetail': _host + '/index.php/zww/user/gold_detail.html',     //我的-金币明细
	'orderList': _host + '/index.php/zww/user/order_list.html',        //我的-娃娃订单
	'myOrderList': _host + '/index.php/zww/childorder/get_list.html',  //娃娃订单确认
	'getConvertsList': _host + '/index.php/zww/childorder/converts_list.html', //获取兑换金币订单
	'getUserInfo': _host + '/index.php/zww/user/user_info.html', //获取用户信息
	'setGrab': _host + '/index.php/zww/childorder/set_grab.html', //娃娃领取
	'unsetGrab': _host + '/index.php/zww/childorder/unset_grab.html', //取消领取娃娃
	'setConvertsGold': _host + '/index.php/zww/childorder/converts.html', //娃娃兑换金币
	'getOrderInfo': _host + '/index.php/zww/childorder/order_info.html', //确认订单
	'getAddress': _host + '/index.php/zww/user/get_address.html', //管理地址列表
	'setAddress': _host + '/index.php/zww/user/set_address.html', //设置默认地址
	'addAddress': _host + '/index.php/zww/user/add_address.html', //添加地址
	'delAddress': _host + '/index.php/zww/user/del_address.html', //删除地址
	'editAddress': _host + '/index.php/zww/user/edit_address.html', //编辑地址
	'getPayInfo': _host + '/index.php/zww/pay/payinfo.html', //优惠充值
	'orderPay': _host + '/index.php/zww/pay/pay.html', //订单支付
	'checkPay': _host + '/index.php/zww/childorder/grab_isexceed.html', //检查娃娃是否过期
	'getQQinfo': _host + '/index.php/zww/user/get_qqinfo.html', //qq获取用户信息
	//聊天室api
	'joinChat' : _host + '/index.php/zww/Instruct/addroom.html',  //请求加入房间 新
	'setQuery': _host + '/index.php/zww/Instruct/addqueue.html', //开始排队 新
	'downQuery': _host + '/index.php/zww/Instruct/down_query.html',  //取消排队 新
	'gradRecode': _host + '/index.php/zww/Room/grad_recode.html',   //当前房间抓中的记录
	'grabList': _host + '/index.php/zww/Room/grab_list.html',   //当前房间排行榜
	'rechargePay': _host + '/index.php/zww/pay/recharge.html',   //充值
	'startGame': _host + '/index.php/zww/Instruct/start_game.html',   //开始游戏
	'overGame': _host + '/index.php/zww/Instruct/over_game.html',   //结束游戏 新
	'setForce': _host + '/index.php/zww/Room/set_force.html',   //开始游戏后调整抓力
	//'getshareimg':_host + '/index.php/zww/user/get_share_image.html', //qq分享图片
	'getInvite' : _host + '/index.php/zww/user/user_invite.html', //推广页分享
	'getgiftCode' : _host + '/index.php/zww/user/setTnvite.html', //填写邀请码
	'getWXuserinfo': _host + '/index.php/what/index/getUserInfo.html', // 获取wx用户信息
	'getSign': _host + '/index.php/what/index/getSign.html',  //获取wx签名信息
	'frPay': _host + '/index.php/zww/pay/replace_pay.html',  //好友代付
	'getMissionList': _host + '/index.php/zww/user/user_date_task.html', //房间任务列表
	'missionComplete': _host + '/index.php/zww/user/user_date_task_do.html' //任务完成领取报酬
};
export {httpUrl}
