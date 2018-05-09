<template>
	<div id="recharge">
		<navbar :title="name"></navbar>
		<div id="rechargeMain">
			<div class="userData">
				<img src="../assets/meBG.png" />
				<div>
					<p class="price">{{userInfo.price}}</p>
					<p>账户余额（币）</p>
				</div>
				<img class="userline" src="../assets/meLine.png" />
			</div>
			<van-panel title="新手特惠" id="rechargeActivity">
				<div id="sale">
					<div class="saleBox" v-for="(item, value) in userSale" :key="value" @click="payMath(item)">
						<p class="up">特价套餐{{(value == 0)?'一':'二'}}</p>
						<p class="center"><i>{{item.buy}}+{{item.give}}</i>金币</p>
						<p class="down">￥{{item.money}}</p>
					</div>
				</div>
			</van-panel>
			<van-panel title="普通套餐" id="rechargePay">
				<van-cell-group>
					<van-cell class="rechargePayBox" v-for="(item, value) in userPay" :key="value">
					  	<template slot="title">
					  		<div>
						      	<img class="coin" :src="coinIcon[value]" />
						      	<div style="display: block;">
							      	<p class="sum">{{item.buy}}+{{item.give}}金币</p>
							      	<p class="give">送{{item.give}}金币</p>
						      	</div>
					  		</div>
					      	<div>
					      		<a @click="payMath(item)" class="payButton">￥{{item.money}}</a>
					      	</div>
					   </template>
				   	</van-cell>
				</van-cell-group>
			</van-panel>
		</div>
		<div class="payTypePanelPop">
			<van-popup v-model="rechargePop" :close-on-click-overlay="false" :prevent-scroll="true">
				<div class="payTypePanelMain clearfix">
					<a class="payTypePanelPopClose" @click="close"><i class="closeicon"></i></a>
					<p class="bell"><img src="../assets/payBell.png" /></p>
					<div class="payTypePanelBox">
						<p class="payTypeTitle"><span>选择一种支付方式</span></p>
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
			</van-popup>
		</div>
		<poppanel :leaveRoom="catchPage"></poppanel>
		<bottomCTL :activeCTL="message"></bottomCTL>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import bottomCTL from '@/components/public/bottomCTL';
import poppanel from '@/components/public/poppanel'
import { Dialog } from 'vant';
import { Toast } from 'vant';
import { httpUrl } from '@/api';
export default {
	components:{
		navbar,bottomCTL,poppanel
	},
	data () {
		return {
			name:'充值金币',
			message:2,
			userId:'',
			userInfo:{},
			userSale:[],
			userPay:[],
			rechargePop:false,
			_cachePayItem:'',
			catchPage:null,
			coinIcon:{
				0:require('@/assets/coin0.png'),
				1:require('@/assets/coin1.png'),
				2:require('@/assets/coin2.png'),
				3:require('@/assets/coin3.png'),
				4:require('@/assets/coin4.png'),
				5:require('@/assets/coin4.png')
			}
		}
	},
	methods:{
		readyPay(){
			Dialog.confirm({
			  	title: '支付提示',
			  	message: '是否支付完成？',
			  	confirmButtonText:'已经支付',
			  	cancelButtonText:'支付遇到问题'
			}).then(() => {
				sessionStorage.removeItem("paying");
				this.$router.push({name:'goldDetail'});
			}).catch(() => {
				sessionStorage.removeItem("paying");
			  	this.$router.push({name:'contactus'});
			});
		},
		nowPay(type){
			let payItem = this._cachePayItem;
			let form = {
				uid:this.userId,
				paytype:type,
				money:payItem.money,
				gold:payItem.sum,
				source:'H5',
				ip:returnCitySN.cip
			}
			this.$axios.post(httpUrl.rechargePay,form)
					.then(
						response => {
							if(response.data.state == '3'){
								Toast('支付成功,请在我的订单中查询记录')
							}else if(response.data.state == '4'){
								let say = '你正在支付中'
								sessionStorage.setItem('paying',JSON.stringify(say));
								window.location.href = response.data.data.url;
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
		close(){
  			this.rechargePop = false;
  		},
  		payMath(item){
  			this._cachePayItem = item;
  			this.rechargePop = true;
  		},
		getPayInfo(){
			let form = {
				uid:this.userId
			}
			this.$axios.post(httpUrl.getPayInfo,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.userInfo = response.data.data.user;
							this.userSale = response.data.data.sale;
							this.userPay = response.data.data.pay;
						}
					}
				)
				.catch(
					response => {
						Toast({
							message:'你没有选择任何娃娃',
							position:'bottom'
						});
					}
				)
		}
	},
	mounted(){
		let getUserCookie = this.getCookie('userInfos');
		if(getUserCookie){
			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
			this.userId = userInfos.uid;
			let getPaying = sessionStorage.getItem('paying');
			if(getPaying){
				this.readyPay();
			}
			this.getPayInfo();
			if(this.$route.query.catchPage == '1'){
				let shit;
				let _this = this;
				this.catchPage = true;
				clearTimeout(shit);
				shit = setTimeout(function(){
					_this.catchPage = false;
				},2000)
			}
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#recharge {
		#rechargeMain {
			.userData {
				position:relative;
				width:100%;
				z-index:1;
				img {
					width:100%;
					display:-webkit-box;
				}
				div {
					width: 100%;
				    text-align: center;
				    position: absolute;
				    top: 20px;
				    display: flex;
				    flex-direction: column;
				    justify-content: center;
				    p {
				    	margin:0 0 5px 0;
				    	img {
				    		width:20%;
				    		display: inline-block;
				    		border-radius:100%;
				    	}
				    }
				    p:last-child {
				    	margin:0;
				    }
				    p.price {
				    	font-size: 40px;
				    	color: #000;
				    }
				}
			}
			#rechargeActivity {
				margin-top:5px;
				font-size:14px;
				background:rgba(0,0,0,0);
				&::after {
					border-width:0px !important;
				}
				.van-panel__header {
					padding:10px 0;
					margin:0 15px;
					.van-panel__title {
						color: $dollCoin;
					}
					&::after {
						border-bottom-width:0px !important;
					}
				}
				#sale {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 10px 0px;
				    margin: 0 10px;
				    background: #fff;
				    border-radius: 10px;
					div.saleBox {
						margin:0 5px;
						border-radius:10px;
						width:50%;
						overflow: hidden;
						position: relative;
						&::before,&::after {
							content: '';
							position: absolute;
							background: url(../assets/rechargeCircle.png) no-repeat;
						    width: 94px;
						    height: 94px;
						    background-size: 93.5px;
						    opacity: 0.8;
						}
						&::before {
					        bottom: -30px;
    						left: -30px;
						}
						&::after {
						    top: -30px;
						    right: -30px;
						}
					}
					div.saleBox:first-child {
						background: #ffa4cd;
						p {
							text-shadow: 0 2px 5px #922b59;
						}
					}
					div.saleBox:last-child {
						background: #b2d5f6;
						p {
							text-shadow: 0 2px 5px #26527b;
						}
					}
					p {
						margin:5px 10px;
						color: #fff;
					}
					p.top {
						text-align: left;
					}
					p.center {
						text-align: center;
						i {
							font-style: normal;
							font-size: 20px;
						}
					}
					p.down {
						text-align: right;
					}
				}
			}
			#rechargePay {
				margin-top:5px;
				font-size:14px;
				margin-bottom:60px;
				background: transparent;
				&::after {
					border-width:0px !important;
				}
				.van-panel__header {
					padding:10px 0 0 0;
					margin:0 15px;
					.van-panel__title {
						color: $dollCoin;
					}
					&::after {
						border-bottom-width:0px !important;
					}
				}
				.van-cell-group {
					background: rgba(0,0,0,0);
				    margin: 0 10px;
				    &::after {
						border-width:0;
					}
					.rechargePayBox {
						padding:10px 15px;
						margin:10px 0;
						border-radius: 10px;
						background: #fff;
						box-shadow: 1px 1px 5px 0px #dedede;
						&::after {
							border-bottom-width:0;
						}
						div {
							display: flex;
							align-items: center;
							justify-content: space-between;
							img.coin {
							    padding: 10px;
							    border: 1px solid #e8e8e8;
							    border-radius: 10px;
							}
							p {
								margin: 0 10px;
							}
							.give {
								color: $dollCoin;
							}
							a.payButton {
								display: inline-block;
								min-width: 50px;
								background: #ffef39;
								border-radius: 25px;
								padding:2px 10px;
								box-shadow: 0px 2px 5px 0 #ffa31f;
							    text-align: center;
							}
						}
					}
				}
			}
		}
		.payTypePanelPop {
			.van-popup {
				width:90%;
				background: rgba(0,0,0,0);
			}
			.payTypePanelMain {
				width:100%;
				border:3px solid #fad642;
				border-radius:15px;
				background: $white;
				position: relative;
				.payTypePanelPopClose {
					position: absolute;
					display: inline-block;
					right:-10px;
					top:-10px;
					z-index:1;
					width:40px;
					height:40px;
				}
				.bell {
					width: 100%;
					text-align: center;
					position: absolute;
    				top: -45px;
					img {
						width: 237px;
					}
				}
				.payTypePanelBox {
					margin-top: 35px;
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
							width:30%;
							p {
								text-align: center;
								margin:5px 0;
								img {
									width:55px;
								}
							}
						}
					}
				}
			}	
		}
	}
</style>