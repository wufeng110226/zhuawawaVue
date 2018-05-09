<template>
	<div id="signIn">
		<div class="bg" :style="{'height':imgHeight + 'px'}"><img src="../../assets/signInBG.png" /></div>
		<van-row>
			<van-col span="12" style="padding-left:15%;">
				<div @click="toLoading('signIn-phone')">
					<p><img src="../../assets/phone.png" /></p>
					<p>手机号登录</p>
				</div>
			</van-col>
			<van-col span="12" style="padding-right:15%;">
				<div @click="toLoading('qq')">
					<p><img src="../../assets/qq.png" /></p>
					<p>QQ</p>
				</div>
			</van-col>
		</van-row>
		<span id="qqLoginBtn" ref="qq" style="display: none;"></span>
	</div>
</template>
<script>
import { httpUrl } from '@/api'
import { Toast } from 'vant'
export default {
	data () {
		return {
			loginPanelHeight:127.5,
			isWH:false,   //无痕浏览模式
			access_token:'',
			QQopenid:'',
			userInfo:{}
		}
	},
	methods: {
		signIn(){
			let form = {
					type:'qq',
					nickname:this.userInfo.nickname,
					cover:this.userInfo.figureurl_2,
					ltype:2,
					openid:this.QQopenid,
					source:'H5'
			}
			this.$axios.post(httpUrl.signIn,form)
				.then(
					response => {
						if(response.data.state == '1'){
							Toast.clear();
							let obj = {
								uid:response.data.data.uid,
								nickname:response.data.data.nickname,
								token:response.data.data.token,
								cover:this.userInfo.figureurl_2
							}
							this.setCookie('userInfos',encodeURIComponent(JSON.stringify(obj)),24);
							this.$router.push({name:'me'});
						}
					}
				)
				.catch(
					response => {
						Toast.clear();
						Toast({
							message:'服务器响应失败，请重新尝试！',
							position:'bottom'
						});
					}
				)
		},
		getQQUserInfo(){
			let form = {
				openid:this.QQopenid,
				token:this.access_token,
				key:''
			}
			this.$axios.post(httpUrl.getQQinfo,form)
				.then(
					response => {
						//console.log(response);
						if(response.status == '200'){
							this.userInfo = response.data;
							this.signIn();
						}
					}
				)
				.catch(
					response => {
						Toast.clear();
						Toast({
							message:'登录失败，请重新登录！',
							position:'bottom'
						});
					}
				)
		},
		getQQopenId(){
			let _this = this
			this.$jsonp('https://graph.qq.com/oauth2.0/me', {
			  	access_token: _this.access_token, callbackQuery: 'callback', callbackName: 'callback'
			}).then(json => {
			  	this.QQopenid = json.openid;
			  	this.getQQUserInfo();
			}).catch(err => {
			  	Toast.clear();
				Toast({
					message:'登录失败，没有获取到openid',
					position:'bottom'
				});
			})
		},
		toLoading(value) {
			if(this.isWH){
				Toast('为了更好体验，请取消无痕浏览模式！');
			}else{
				if(value == 'qq'){
					window.location.href = 'https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=&redirect_uri=';
				}else{
					this.$router.push({name:'signIn-phone'});
				}
			}
		}
	},
	computed:{
		imgHeight:function(){
			return document.documentElement.clientHeight - this.loginPanelHeight
		}
	},
	mounted() {
		/*浏览器版本过低时，跳走*/
		const isWeixin = !!/MicroMessenger/i.test(navigator.userAgent);
		let getBrowserSupport = this.globals.getVisibilityState();
		if(!getBrowserSupport){
			this.$router.push({name:'browserNotSupport'});
		}
		/*判断是否是无痕浏览模式*/
		try {
		    window.sessionStorage.foobar = "foobar";
		} catch(e) {
			this.isWH = true;
			Toast('为了更好体验，请取消无痕浏览模式！');
			return
		}
		let paras = {};
		
  		if(isWeixin){
  			window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=&redirect_uri=&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
  		}else{
  			/*
	  		 * 线上
	  		 */
	  		if(window.location.hash.length > 0){
	  			let obj = new Object();
	  			let str = window.location.hash.substring(1);
	  			let arr = str.split("&");
	  			for(let i=0;i<arr.length;i++){
	  				obj[arr[i].split("=")[0]] = unescape(arr[i].split("=")[1]);
	  			}
	  			this.access_token = obj.access_token;
	  			this.getQQopenId();
	  			Toast.loading({
		  			type:'html',
		  			message:"<div style='text-align:center;'><img style='width:50%;' src='"+require('@/assets/loading.gif')+"' /></div>",
					mask: true,
					duration: 0
				});
	  		}
  		}
  		
	}
}
</script>

<style lang="scss">
@import '../../style/publicColor.scss';
	#signIn {
		position:relative;
		.bg {
			width:100%;
			img {
				width: 100%;
				height:100%;
				display: block;
			}
		}
		.van-row {
			width:100%;
			background: #fff;
			margin:0 !important;
			p {
				text-align: center;
				img {
					width:40%;
				}
			}
		}
	}
</style>