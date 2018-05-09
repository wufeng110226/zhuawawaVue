import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import nopage from '@/components/public/nopage'
import browserNotSupport from '@/components/public/browserNotSupport'
import shareimg from '@/components/public/shareimg'
import visitorPay from '@/components/visitorPay'
//登录
import signIn from '@/components/public/signIn'
import signInphone from '@/components/public/signIn-phone'
//操作栏
import me from '@/components/me'
import doll from '@/components/doll'
import recharge from '@/components/recharge'
import contactus from '@/components/contactus'
//内页
import goldDetail from '@/components/goldDetail'
import dollOrder from '@/components/dollOrder'
import placeOrder from '@/components/placeOrder'
import addressList from '@/components/addressList'
import plusAddress from '@/components/plusAddress'
import requestFriends from '@/components/requestFriends'
import friendsPay from '@/components/friendsPay'


//抓娃娃
import dollCatch from '@/components/dollCatch'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },{//登录页
    	path:'/signIn',
    	name: 'signIn',
    	component: signIn
    },{//登录页
    	path:'/signIn-phone',
    	name: 'signIn-phone',
    	component: signInphone
    },{//我的-金币明细
    	path:'/goldDetail',
    	name: 'goldDetail',
    	component: goldDetail
    },{//我的-娃娃订单
    	path:'/dollOrder',
    	name: 'dollOrder',
    	component: dollOrder
    },{//下单
    	path:'/placeOrder',
    	name: 'placeOrder',
    	component: placeOrder
    },{//管理收货地址
    	path:'/addressList',
    	name: 'addressList',
    	component: addressList
    },{//添加编辑收货地址
    	path:'/plusAddress',
    	name: 'plusAddress',
    	component: plusAddress
    },{//我的娃娃
    	path:'/doll',
    	name: 'doll',
    	component: doll
    },{//充值
    	path:'/recharge',
    	name: 'recharge',
    	component: recharge
    },{//我的
    	path:'/me',
    	name: 'me',
    	component: me
    },{//联系我们
    	path:'/contactus',
    	name: 'contactus',
    	component: contactus
    },{//联系我们
    	path:'/requestFriends',
    	name: 'requestFriends',
    	component: requestFriends
    },{//抓娃娃
    	path:'/dollCatch/:roomid/:dollid/:gold',
    	name: 'dollCatch',
    	component: dollCatch
    }/*,{//分享
    	path:'/shareimg',
    	name: 'shareimg',
    	component: shareimg
    }*/,{//好友代付
    	path:'/friendsPay',
    	name: 'friendsPay',
    	component: friendsPay
    },{//游客代付
    	path:'/visitorPay',
    	name: 'visitorPay',
    	component: visitorPay
    },{
			path:'/browserNotSupport',
			component:browserNotSupport
		},{
			path:'*',
			component:nopage
		}
  ]
})
