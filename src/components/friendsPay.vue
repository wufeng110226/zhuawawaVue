<template>
	<div id="friendsPay">
		<navbar :title="name"></navbar>
		<div id="friendsPayContent">
			<div id="banner">
				<img src="../assets/fpayBanner.png" />
			</div>
			<div id="main">
				<div class="thick_border">
					<div class="thin_border">
						<van-row gutter="20">
						  	<van-col span="12" v-for="(item, value) in payList" :key="value">
						  		<div class="frist_content" @click="setActive(value)" :class="{'active':value == activeNav}">
						  			<div class="last_content">
						  				
						  				<p class="giveGold"><span>{{item.buy}}</span>+<span>{{item.give}}</span>金币</p>
						  				<p class="needMoney">￥{{item.money}}</p>
						  			</div>
						  		</div>
						  		<p class="sweetWord">{{sweetL[value].word}}</p>
						  	</van-col>
						</van-row>
						<div class="payHelp">
							<p>1、好友代付功能只能在微信中使用</p>
							<p>2、选择充值金额后，点击右上角三个点，分享给微信好友即可。</p>
							<p>3、亲友充值后，游戏币自动加到你的账户中。</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import { Toast } from 'vant';
import { httpUrl } from '@/api';
export default {
	components:{
		navbar
	},
	data () {
		return {
			name:'好友代付',
			userId:'',
			payList:'',
			activeNav:0,
			sweetL:[
				{'word':'TA是你的小确幸'},
				{'word':'TA只想给你宠爱'},
				{'word':'TA在你耳边说“我爱你”'},
				{'word':'TA用尽一生一世将你供养'}
			],
			activeSweet:'TA是你的小确幸'
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
	methods:{
		setActive(index){
			this.activeNav = index;
			this.activeSweet = this.sweetL[index].word;
		},
		getPayList(){
			this.$axios.post(httpUrl.frPay)
				.then(
					response => {
						if(response.data.state == '1'){
							this.payList = response.data.data;
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
		wxConfig(){
			
			let _this = this;
			wx.onMenuShareAppMessage({
				title: '宝宝,我需要你', // 分享标题
				desc: _this.activeSweet, // 分享描述
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
			Toast.clear();
		}
	},
	mounted(){
		let getUserCookie = this.getCookie('userInfos');
		if(getUserCookie){
			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
  			this.userId = userInfos.uid;
  			this.getPayList();
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
									jsApiList:['onMenuShareAppMessage']
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
	#friendsPay {
		#friendsPayContent {
			box-sizing:border-box;
			#banner {
				padding:10px;
				img {
					width:100%;
				}
			}
			#main {
				padding:10px;
				background: $white;
				.thick_border {
					border:3px solid $friendPayBaseColor;
					border-radius:10px;
					.thin_border {
						border-radius:10px;
						margin:5px;
						border:2px solid $friendPayborderColor;
						padding:5px;
						.van-row {
							margin:0 !important;
							padding-bottom: 30px;
							.van-col {
								padding:0 !important;
								text-align: center;
								.frist_content {
									margin:5px;
									padding:5px;
									border-radius: 5px;
									border: 2px solid #fcb7c5;
									position: relative;
									overflow:hidden;
									.last_content {
										border:1px solid $white;
										border-radius: 5px;
										p {
											margin:10px 0;
										}
										p.giveGold {
											color: #ff98ad;
										}
										p.needMoney {
											color: #e25f45
										}
										&::before,&::after {
											content: '';
											position: absolute;
											background: url(../assets/rechargeCircle.png) no-repeat;
										    width: 94px;
										    height: 94px;
										    background-size: 93.5px;
										    opacity: 0.6;
										}
										&::before {
									        bottom: -30px;
				    						left: -50px;
										}
										&::after {
										    top: -30px;
										    right: -50px;
										}
									}
								}
								.active {
									background: $friendPayborderColor;
									border: 2px solid rgba(0,0,0,0) !important;
									p {
										color: #413d3d !important;
									}
								}
							}
							.sweetWord {
								font-size: 12px;
								text-align: center;
								color: #ff9b42;
							}
						}
					}
					.payHelp {
						p {
							color:#cd3e5b;
							font-size:14px;
							margin:10px;
						}
					}
				}
			}
		}
	}
</style>