// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import fetch from '@/plugin/fetch'
import VueJsonp from 'vue-jsonp'
//加载根组件和ui库
import Vant from 'vant'
import App from './App'
import router from './router'
import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'
import AlloyTouch from 'alloytouch'
import AlloyTouchPlugin from 'alloytouch/vue/alloy_touch.vue'
import AlloyTouchFP from 'alloytouch/vue/full_page.vue'
import 'vant/lib/vant-css/index.css';
import 'font-awesome/css/font-awesome.min.css';
import globals from '@/plugin/global'
//单独加载不能直接使用的ui组件库
import { Lazyload } from 'vant';
import { Waterfall } from 'vant';
import { PullRefresh } from 'vant';
import { AddressEdit } from 'vant';

//使用ui组件
Vue.use(AddressEdit);
Vue.use(Lazyload);
Vue.use(Waterfall);
Vue.use(PullRefresh);
Vue.use(AlloyFingerPlugin, {
    AlloyFinger
})
Vue.use(AlloyTouchFP, {
    AlloyTouch
})
Vue.use(AlloyTouchPlugin)



//基础
Vue.use(Vant);
Vue.use(Vuex);
Vue.use(VueJsonp);
Vue.use(VueRouter);

//require('./assets/util/vconsole.js'); //移动端debug
Vue.config.productionTip = false

//axios通用配置
Vue.prototype.$axios = fetch.axios;


//设置Cookie,增加到Vue实例方便全局调用
Vue.prototype.setCookie = (c_name, value, expireTimes) => {
	let exdate = new Date();
	exdate.setTime(exdate.getTime() + expireTimes*3600*1000);
	//console.info(c_name + "=" + escape(value) + "; " + expireTimes);
	document.cookie = c_name + "=" + value + ";expires=" + exdate.toGMTString();
}
//获取cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
Vue.prototype.getCookie = getCookie;

//删除cookie
Vue.prototype.delCookie =(name) => {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


Vue.prototype.isWxBroser = !!/MicroMessenger/i.test(navigator.userAgent);

router.beforeEach((to, from, next) => {    //路由进入前的条件判断
	if(to.path === '/signIn' || to.path === '/signIn-phone'){
		next();
	}else if(to.path === '/' || to.path === '/index' || to.path === '/shareimg' || to.path === '/browserNotSupport' || to.path === '/visitorPay'){
		next();
	}else{
		let getUserCookie = getCookie('userInfos');
		if(getUserCookie){
			next();
		}else{
			next({path:'/signIn'})
		}
	}
})

Vue.prototype.globals = globals;

/*
 * 初始化websocket
 * readyState 0=CONNECTING正在连接、1=OPEN连接成功、2=CLOSING正在关闭、3=CLOSED已关闭
 */
Vue.prototype.ws = {
	wsServer:'ws://',
	heartBeat:10000,
	sock:null,
	isOnopen:false,
	init(){
		let _this = this;
		clearTimeout(window.timer_HB);
		this.sock = new WebSocket(this.wsServer);
		this.sock.onopen = function (evt) {
			//console.log("连接到websocket服务端");
			let getUserCookie = getCookie('userInfos');
			if(getUserCookie != null){
				let userInfos = decodeURIComponent(getUserCookie);
  				userInfos = JSON.parse(userInfos);
				let userId = userInfos.uid;
				_this.isOnopen = true;
				let obj = {
					'type':'bind',
					'data':{
						"uid":userId
					}
				}
				_this.sock.send(JSON.stringify(obj));
			}
			//_this.sock.onopen = app.constructorONOPEN();
        };
        this.sock.onclose = function (evt) {
        	_this.isOnopen = false;
        	clearTimeout(window.timer_HB);
        	_this.reConnect(_this.heartBeat);
            //console.log("关闭socket");
        };
        this.sock.onmessage = function (evt) {
            //console.log('接收服务端推送的信息: ' + evt.data);
        };
        this.sock.onerror = function (evt) {
        	_this.isOnopen = false;
        	clearTimeout(window.timer_HB);
        	_this.reConnect(_this.heartBeat);
            //console.log('socket连接错误: ' + evt.data);
        };
	},
	reConnect(heartBeat){
		let _this = this;
		window.timer_HB = setTimeout(function(){
			_this.init();
			//console.log('重连');
		},heartBeat);
	}
}

/* eslint-disable no-new */
//实例化Vue
const app = new Vue({
	data:{},
	render:h => h(App),
	router,
	watch:{
		"$route":"setInit"
	},
	methods:{
		setInit(){
			this.scrollTop()
			this.checkws()
		},
		scrollTop(){
			document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
		},
		checkws(){
			let getUserCookie = this.getCookie('userInfos');
	  		if(getUserCookie != null){
	  			let userInfos = decodeURIComponent(getUserCookie);
  				userInfos = JSON.parse(userInfos);
				this.userId = userInfos.uid;
				if(!this.ws.isOnopen){
					this.ws.init();
				}
	  		}
		}
	}
}).$mount('#app')