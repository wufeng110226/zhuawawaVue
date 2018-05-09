<template>
	<div id="requestFriends" :style="height">
		<navbar :title="name"></navbar>
		<div id="requestFriends_shild">
			<div class="title_img"><img src="../assets/rf.png" /></div>
			<div class="content">
				<div class="inviteMain">
					<div class="giftinvite">
						<p>好友邀请码</p>
						<input type="text" v-model="giftCode" placeholder="请输入邀请码" v-if="inviteData.is_invite == '0'" />
						<span v-else>{{inviteData.from_invite}}</span>
						<p v-if="inviteData.is_invite == '0'"><a @click="getgiftCode">兑换</a></p>
						<p v-else><a>已兑换</a></p>
						<p class="redAlert">注意：好友的邀请码只能填写一次</p>
					</div>
					<div class="myInvite">
						<p>我的邀请码</p>
						<span>{{inviteData.myinvite}}</span>
						<p class="redAlert">注意：好友的邀请码只能填写一次</p>
					</div>
				</div>
				<p class="share_title">赶紧行动起来吧~分享到</p>
				<div id="share" v-if="isWxB">
					<li class="shareCustom_style" @click="shareWx">
		  				<p class="bgweixin">
		  					<img src="../assets/wxicon.png" />
		  				</p>
		  			</li>
		  			<li class="shareCustom_style" @click="shareWx">
		  				<p class="bgweixintimeline">
		  					<img src="../assets/wxtimelineicon.png" />
		  				</p>
		  			</li>
		  			<li class="shareCustom_style" @click="shareWx">
		  				<p class="bgqq">
		  					<img src="../assets/qqicon.png" />
		  				</p>
		  			</li>
		  			<li class="shareCustom_style" @click="shareWx">
		  				<p class="bgqzone">
		  					<img src="../assets/qzone.png" />
		  				</p>
		  			</li>
				</div>
				<div id="share" v-else>
					<li class="shareCustom_style" @click="shareWx">
		  				<p class="bgweixin">
		  					<img src="../assets/wxicon.png" />
		  				</p>
		  			</li>
		  			<li class="shareCustom_style" @click="shareWx">
		  				<p class="bgweixintimeline">
		  					<img src="../assets/wxtimelineicon.png" />
		  				</p>
		  			</li>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import { Toast } from 'vant';
import { httpUrl } from '@/api'
import soshm from 'soshm';
export default {
	components:{
		navbar
	},
	data() {
		return {
			name:'邀请好友',
			userId:'',
			height: {
	  			'min-height':window.screen.height + 'px'
	  		},
	  		isWxB:false,
	  		inviteData:'',
	  		giftCode:''
		}
	},
	created(){
		if(this.isWxBroser){
			Toast.loading({
				type:'html',
				message:"<div style='text-align:center;'><img style='width:50%;' src='"+require('@/assets/loading.gif')+"' /></div>",
				mask: true,
				duration: 0
			});
		}
	},
	methods: {
		getgiftCode(){
			let form = {
				uid:this.userId,
				invite:this.giftCode
			}
			console.log(form);
			this.$axios.post(httpUrl.getgiftCode,form)
				.then(
					response => {
						if(response.data.state == '1'){
							Toast('邀请码验证成功！');
							this.inviteData.is_invite = '1';
							this.inviteData.from_invite = this.giftCode;
						}else{
							Toast('邀请码验证失败！');
						}
					}
				)
				.catch(
					response => {
						Toast({
    						message:'链接服务器失败，请稍后再试！',
    						position:'bottom'
	    				});
					}
				)
		},
		getshare(){
			let form = {
				uid:this.userId
			}
			this.$axios.post(httpUrl.getInvite,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.inviteData = response.data.data;
							this.share();
						}
					}
				)
				.catch(
					response => {
						Toast({
    						message:'链接服务器失败，请稍后再试！',
    						position:'bottom'
	    				});
					}
				)
		},
		shareWx(){
			if(!this.isWxBroser){
				Toast('请在微信浏览器中打开！');
			}else{
				Toast('请点击右上角按钮进行分享！');
			}
		},
		share(){
			let _this = this;
			if(this.isWxBroser){
				soshm('#share',{
					url:_this.inviteData.url,
					title: '送你一个娃娃',
					digest:'帮我登录游戏，帮你赚金币',
					sites:['douban', 'weibo']
				});
			}else{
				soshm('#share',{
					url:_this.inviteData.url,
					title: '送你一个娃娃',
					digest:'帮我登录游戏，帮你赚金币',
					sites:['douban', 'weibo', 'qq', 'qzone']
				});
			}
		},
		wxConfig(){
			
			let _this = this;
			wx.onMenuShareAppMessage({
				title: '送你一个娃娃', // 分享标题
				desc: '帮我登录游戏，帮你赚金币', // 分享描述
				link: 'http://lezhuawawaji.com/shareimg' + '?uid=' + _this.userId + '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: 'http://wawa.lyuecity.com/images/2018-02-08/5a7bbeae281b3.png', // 分享图标
				type: '', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// 用户确认分享后执行的回调函数
					Toast("分享给个人成功了");
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					Toast("取消分享给微信好友！");
				}
			});
			wx.onMenuShareTimeline({
			    title: '送你一个娃娃', // 分享标题
			    link: 'http://lezhuawawaji.com/shareimg' + '?uid=' + _this.userId + '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: 'http://wawa.lyuecity.com/images/2018-02-08/5a7bbeae281b3.png', // 分享图标
			    success: function () {
			    	// 用户确认分享后执行的回调函数
			    	Toast("分享到朋友圈成功了!");
				},
				cancel: function () {
			    	// 用户取消分享后执行的回调函数
			    	Toast("取消分享到朋友圈!");
			    }
			});
			wx.onMenuShareQQ({
				title: '送你一个娃娃', // 分享标题
				desc: '帮我登录游戏，帮你赚金币', // 分享描述
				link: 'http://lezhuawawaji.com/shareimg' + '?uid=' + _this.userId + '', // 分享链接
				imgUrl: 'http://wawa.lyuecity.com/images/2018-02-08/5a7bbeae281b3.png', // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
					Toast("分享给qq朋友成功！");
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					Toast("取消分享给朋友！");
				}
			});
			wx.onMenuShareQZone({
				title: '送你一个娃娃', // 分享标题
				desc: '帮我登录游戏，帮你赚金币', // 分享描述
				link: 'http://lezhuawawaji.com/shareimg' + '?uid=' + _this.userId + '', // 分享链接
				imgUrl: 'http://wawa.lyuecity.com/images/2018-02-08/5a7bbeae281b3.png', // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
					Toast("分享到qq空间成功！");
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					Toast("取消分享到qq空间！");
				}
			});
			Toast.clear();
		}
	},
	mounted(){
		let getUserCookie = this.getCookie('userInfos');
		this.isWxB = this.isWxBroser;
		if(getUserCookie){
			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
			this.userId = userInfos.uid;
			this.getshare();
			if(this.isWxBroser){
				let form = {
					url:location.href.split("#")[0]
				}
				this.$axios.post(httpUrl.getSign,form)
					.then(
						response => {
							if(response.data.state == '1'){
								let _this = this;
								wx.config({
									debug:false,
									appId:'',
									timestamp:response.data.data.timestamp,
									nonceStr:response.data.data.noncestr,
									signature:response.data.data.sign,
									jsApiList:['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
								})
								wx.ready(function(){
									_this.wxConfig();
									// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
								});
								
								wx.error(function(res){
									location.reload();
								    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
								});
								
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
			}
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#requestFriends {
		background: #f8f8f8;
	    padding-bottom: 30px;
		#requestFriends_shild {
			padding:0 15px;
			.title_img {
				text-align: center;
				img {
					width:60%;
					position: relative;
					top:25px;
				}
			}
			.content {
				background: $white;
				border-radius:10px;
				padding:25px 15px 0 15px;
				box-shadow:0px 0px 11px 0px rgba(181, 181, 181, 0.3);
				.inviteMain {
					width:100%;
					text-align:center;
					div {
						p {
							a {
								display: inline-block;
								width:auto;
								color: $white;
								background: #ff7272;
								padding:5px 30px;
								border-radius: 15px;
							}
						}
						span {
							border:1px solid #ffb052;
							background: #ffe79d;
							color: #de2b2b;
							padding:5px 15px;
							border-radius: 15px;
						}
						input {
							border:1px solid #ffb052;
							background: #ffe79d;
							color: #de2b2b;
							padding:5px 15px;
							border-radius: 15px;
							text-align: center;
						}
						p.redAlert {
							color: #de2b2b;
						}
					}
					div.giftinvite {
						border-bottom:1px solid #e8e8e8;
					}
				}
				.share_title {
					text-align: center;
					margin:0 10px;
					font-size: 12px;
					color: #8b8b8b;
				}
				#share {
   					display: flex;
    				justify-content: center;
    				padding:3px 0;
    				.shareCustom_style {
    					float: left;
					    margin: 5px;
					    cursor: pointer;
    				}
   					li {
   						list-style-type: none;
   						p {
   							margin: 0;
   							border-radius: 50%;
   							width: 26px;
   							height:26px;
   							padding: 5px;
						    vertical-align: middle;
   							img {
   								width:100%;
   								height:100%;
   							}
   						}
   						p.bgweixin {
   							background-color: #42b236;
   						}
   						p.bgweixintimeline {
   							background-color: #42b236;
   						}
   						p.bgdouban {
   							background-color: #2e9e39;
   						}
   						p.bgweibo {
   							background-color: #f04e59
   						}
   						p.bgqq {
   							background-color: #4aafed
   						}
   						p.bgqzone {
   							background-color: #fdbe3d
   						}
   					}
				}
			}
		}
	}
</style>