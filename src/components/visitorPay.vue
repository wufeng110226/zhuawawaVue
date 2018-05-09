<template>
	<div id="visitorPay">
		<div id="visitorPayContent">
			<div id="header">
				<div id="friendsHead">
					<div>
						<img :src="userInfo.cover" />
					</div>
					<p>{{userInfo.nickname}}</p>
					<p>爱抓ID：{{userInfo.uid}}</p>
				</div>
				<div id="friendsWord">
					<div class="main">
						<img src="../assets/line.png" />
						<p>亲爱哒，我在爱抓抓玩嗨了，给我充点游戏币呗~~ (＾ω＾)</p>
					</div>
				</div>
			</div>
			<div id="main">
				<div class="thick_border">
					<div class="thin_border">
						<van-row gutter="20">
						  	<van-col span="12" v-for="(item, value) in payList" :key="value">
						  		<div class="frist_content" @click="setActive(value,item)" :class="{'active':value == activeNav}">
						  			<div class="last_content">
						  				
						  				<p class="giveGold"><span>{{item.buy}}</span>+<span>{{item.give}}</span>金币</p>
						  				<p class="needMoney">￥{{item.money}}</p>
						  			</div>
						  		</div>
						  		<p class="sweetWord">{{sweetL[value].word}}</p>
						  	</van-col>
						</van-row>
						<div class="buttonGroup">
							<div class="refuse" @click="fuckOff"><span>滚，没钱</span></div>
							<div class="confirm" @click="checkPay"><span>帮你一下</span></div>
						</div>
						<div class="payHelp">
							<p>温馨提醒：支付前，请与当事人当面确认，谨防诈骗</p>
							<p>本次充值的游戏币将会加到对方的爱抓抓账户</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="payTypePanelPop">
			<van-popup v-model="payPop" :close-on-click-overlay="false" :prevent-scroll="true">
				<div class="payTypePanelMain clearfix">
					<div class="tinyBorder">
						<a class="payTypePanelPopClose" @click="close"><i class="closeicon"></i></a>
						<p class="bell"><img src="../assets/line.png" /></p>
						<div class="payTypePanelBox">
							<div class="payType">
								<div @click="nowPay('wxpay')">
									<p><img src="../assets/payWechar.png" /></p>
									<p>微信支付</p>
								</div>
								<div @click="nowPay('alipay')">
									<p><img src="../assets/aliPay.png" /></p>
									<p>支付宝支付</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</van-popup>
			<van-popup v-model="talkPop" :close-on-click-overlay="false" :prevent-scroll="true">
				<div class="payTypePanelMain clearfix">
					<div class="tinyBorder">
						<a class="payTypePanelPopClose" @click="close"><i class="closeicon"></i></a>
						<p class="bell"><img src="../assets/line.png" /></p>
						<p class="talkPop">有点意思哦，话我会帮你带到的，那么有没有兴趣立即来一把？</p>
						<div class="goH5" @click="goH5"><span>走！</span></div>
					</div>
				</div>
			</van-popup>
		</div>
		<div class="wechat" v-if="isWX">
			<img src="../assets/live_weixin_iphone.png" v-if="thisTIP == 'iPhone'" />
			<img src="../assets/live_weixin.png" v-else />
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant';
import { httpUrl } from '@/api';
export default {
	data () {
		return {
			userId:'',
			userInfo:'',
			payList:'',
			activeNav:2,
			sweetL:[
				{'word':'TA是你的小确幸'},
				{'word':'TA只想给你宠爱'},
				{'word':'TA在你耳边说“我爱你”'},
				{'word':'TA用尽一生一世将你供养'}
			],
			activeSweet:'TA是你的小确幸',
			_cachePayItem:'',
			payPop:false,
			talkPop:false,
			isWX:'',
			thisTIP:''
		}
	},
	methods: {
		close(){
  			this.payPop = false;
  			this.talkPop = false;
  		},
  		goH5(){
  			this.$router.push({name:'index'});
  		},
		readyPay(){
			Dialog.confirm({
			  	title: '支付提示',
			  	message: '是否支付完成？',
			  	confirmButtonText:'已经支付',
			  	cancelButtonText:'重新支付'
			}).then(() => {
				sessionStorage.removeItem("firpaying");
				this.$router.push({name:'index'});
			}).catch(() => {
				sessionStorage.removeItem("firpaying");
			});
		},
		fuckOff(){
			this.talkPop = true;
		},
		nowPay(type){
			Toast({
				message:'代付功能还未上线',
				position:'bottom'
			});
		},
		checkPay(){
			if(this.isWxBroser){
				this.isWX = true;
				if(navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('Mac') >-1){
					this.thisTIP = 'iPhone';
				}else if(navigator.userAgent.indexOf('Android') || navigator.userAgent.indexOf('Linux') > -1){
					this.thisTIP = 'Android';
				}
			}else{
				this.isWX = false;
				this.payPop = true;
			}
		},
		getUserInfo(userId){  //用户信息
			let form = {
				uid:this.userId
			}
			this.$axios.post(httpUrl.getUserInfo,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.userInfo = response.data.data;
							this.getPayList();
						}else{
							Toast({
	    						message:response.data.msg,
	    						position:'bottom'
		    				});
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
		setActive(index,item){
			this._cachePayItem = item;
			this.activeNav = index;
			this.activeSweet = this.sweetL[index].word;
		},
		getPayList(){
			this.$axios.post(httpUrl.frPay)
				.then(
					response => {
						if(response.data.state == '1'){
							this._cachePayItem = response.data.data[0];
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
	},
	mounted(){
		let userId = this.globals.getQueryString('userId');
		let index = this.globals.getQueryString('index');
		if(userId){
			this.userId = userId;
			this.getUserInfo();
			let getPaying = sessionStorage.getItem('firpaying');
			if(getPaying){
				this.readyPay();
			}
			if(index){
				this.activeNav = index;
			}else{
				this.activeNav = 0;
			}
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#visitorPay {
		background: #ffdfec;
		padding:0 10px 30px 10px;
		#visitorPayContent {
			#header {
				padding:15px 0;
				display:flex;
				justify-content:space-between;
				#friendsHead {
					text-align:center;
					color:#ff79af;
					font-size:14px;
					margin-right:10px;
					div {
						margin: 0 auto;
						display:flex;
						justify-content: center;
						align-items: center;
						background: url(../assets/ctl_spirit.png);
						background-size:400px;
						width:75px;
						height:88px;
						background-position:-125px -40px;
						box-sizing: border-box;
						padding:10px;
						img {
							width:100%;
							border-radius: 50%;
							border:1px solid #ff91bd;
						}
					}
					p {
						margin:5px 0;
					}
				}
				#friendsWord {
					background:$white;
					border:2px solid #ff91bd;
					border-radius: 15px;
					box-sizing: border-box;
					padding:5px;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-left:10px;
					height: fit-content;
					position: relative; 
					&::before {
						content: '';
						display: inline-block;
						background: url(../assets/ctl_spirit.png);
						background-size:400px;
						width:20px;
						height:27px;
						background-position: -169px 0px;
						position: absolute;
						left: -19px;
					}
					.main {
						background:$white;
						border:1px solid #ff91bd;
						border-radius: 15px;
						box-sizing:border-box;
						padding:10px;
						text-align:center;
						color:#ff93be;
						font-size:14px;
						img {
							vertical-align: top;
							width:100%;
						}
					}
				}
			}
			#main {
				padding:10px;
				background: $white;
				border-radius:10px;
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
							padding-bottom: 15px;
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
						.buttonGroup {
							display: flex;
							justify-content: center;
							padding-bottom:15px;
							border-bottom: 2px solid $friendPayBaseColor;
							div {
								display: flex;
								justify-content: center;
								align-items: center;
								margin:0 10px;
								border-radius: 20px;
								span {
									display: inline-block;
									margin: 3px;
									border:1px dashed $white;
									border-radius: 20px;
									padding:5px 20px;
								}
							}
							div.refuse {
								background:#ffeeac;
								color: #ffac4b;
							}
							div.confirm {
								background:$friendPayBaseColor;
								color: #cd3e5b;
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
		.payTypePanelPop {
			font-size: 14px;
			.van-popup {
				width:80%;
				background: rgba(0,0,0,0);
			}
			.payTypePanelMain {
				width:100%;
				border:3px solid #ff91bd;
				border-radius:15px;
				background: $white;
				position: relative;
				box-sizing: border-box;
				.tinyBorder {
					margin: 5px;
					border:1px solid #ff91bd;
				    border-radius: 15px;
					.payTypePanelPopClose {
						position: absolute;
						display: inline-block;
						right:-7px;
						top:-7px;
						z-index:1;
						width:24px;
						height:24px;
						.closeicon {
							background-position: -196px 0px !important;
						}
					}
					.bell {
						width: 100%;
						text-align: center;
						img {
							width: 237px;
						}
					}
					.payTypePanelBox {
						.payTypeTitle {
							width:100%;
							margin-top:0;
							text-align: center;
							font-size:14px;
							span {
								display: inline-block;
								text-align: center;
								width:40%;
								padding:5px 15px;
								border-radius:25px;
								background:#ededed;
								color: #ff9b05;
							}
						}
						.payType {
							display: flex;
							justify-content: center;
							margin-bottom:20px;
							div {
								width:40%;
								p {
									text-align: center;
									margin:5px 0;
									img {
										width:45px;
									}
								}
							}
						}
					}
					.talkPop {
						color: #ff79af;
						padding:0 35px;
						text-align: center;
					}
					.goH5 {
						display: flex;
						justify-content: center;
						align-items: center;
						margin:10px auto;
						width:80%;
						border-radius: 20px;
						background:$friendPayBaseColor;
						color: #cd3e5b;
						box-sizing: border-box;
						text-align: center;
						span {
							display: inline-block;
							width:100%;
							margin: 3px;
							border:1px dashed $white;
							border-radius: 20px;
							padding:5px 20px;
						}
					}
				}
			}
		}
		.wechat {
			position: fixed;
		    top: 0;
		    bottom: 0;
		    left: 0;
		    z-index: 999;
		    width: 100%;
		    height: 100%;
		    background: rgba(0,0,0,0.5);
		    img {
	    	    width: 90%;
			    position: absolute;
			    right: 0;
		    }
		}
	}
</style>