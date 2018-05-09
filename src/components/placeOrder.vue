<template>
	<div id="placeOrder">
		<navbar :title="name"></navbar>
		<div id="placeOrderMain">
			<van-cell-group class="address">
			  	<van-cell @click="chouseAddress" v-show="(goodsList.address == '') ? true : false" title="请选择收货地址" icon="location" is-link />
			  	<van-cell @click="chouseAddress" v-show="(goodsList.address == '') ? false : true" class="addressBox" is-link>
			  		<p>{{goodsList.address.get_name}}{{goodsList.address.get_phone}}</p>
			  		<p>{{goodsList.address.pca}}</p>
			  	</van-cell>
			</van-cell-group>
			<van-panel class="dollOrderPanel" title="商品信息">
			  	<div class="dollOrderGoods" v-for="(item, index) in goodsList.goodsListArr">
			  		<div class="goodsImg"><img :src="item.cover" /></div>
			  		<div class="goodsdetail">
			  			<p>物品名称：{{item.name}}</p>
			  			<p class="gdTime">抓获时间：{{item.createtime}}</p>
			  		</div>
			  	</div>
			  	<div class="footer" slot="footer">
			    	<span class="placeholder"></span>
			    	<span>共{{goodsList.count}}件商品 运费：<a>¥{{goodsList.money}}</a></span>
			  	</div>
			</van-panel>
		  	<van-radio-group v-model="radio" class="payType">
			  	<van-cell-group>
			  		<van-cell-group>
				  		<van-cell value="选择支付方式" />
					</van-cell-group>
				    <van-cell class="aliPay"><van-radio name="1"><img src="../assets/aliPay.png" /><span>支付宝支付</span></van-radio></van-cell>
				    <van-cell class="wecharPay"><van-radio name="2"><img src="../assets/payWechar.png" /><span>微信支付</span></van-radio></van-cell>
			  	</van-cell-group>
			</van-radio-group>
			<p class="nowPay" @click="checkPay"><img src="../assets/nowPay.png" /></p>
		</div>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import { Dialog } from 'vant';
import { Toast } from 'vant';
import { httpUrl } from '@/api';
export default {
	components:{
		navbar
	},
	data(){
		return {
			name:'确认订单',
			userId:'',
			goodsGidList:'',
			goodsList:{
				goodsListArr:[],
				count:'',
				money:'',
				address:''
			},
			radio:'1'
		}
	},
	methods: {
		readyPay(){
			Dialog.confirm({
			  	title: '支付提示',
			  	message: '是否支付完成？',
			  	confirmButtonText:'已经支付',
			  	cancelButtonText:'支付遇到问题'
			}).then(() => {
				sessionStorage.removeItem("paying");
				this.$router.push({name:'dollOrder'});
			}).catch(() => {
				sessionStorage.removeItem("paying");
			  	this.$router.push({name:'contactus'});
			});
		},
		checkPay(){
			let form = {
				uid:this.userId,
				gids:this.goodsGidList
			}
			this.$axios.post(httpUrl.checkPay,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.nowPay();
						}else if(response.data.state == '2'){
							Toast({
								message:response.data.msg,
								position:'bottom'
		    				});
							sessionStorage.removeItem('goodsGidList');
							this.$router.push({name:'/doll'});
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
		nowPay(){
			let goodsList = this.goodsList
			let arr = [];
			if(goodsList.address){
				for(let i=0;i<goodsList.goodsListArr.length;i++){
					arr.push(goodsList.goodsListArr[i].gid)
				}
				let form = {
					uid:this.userId,
					gids:JSON.stringify(arr),
					aid:this.goodsList.address.aid,
					paytype:(this.radio == '1')?'alipay':'wxpay',
					source:'H5',
					ip:returnCitySN.cip
				}
				this.$axios.post(httpUrl.orderPay,form)
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
			}else{
				Toast('请填写收货地址！');
			}
		},
		chouseAddress(){
			this.$router.push({name:'addressList'});
		},
		getOrderInfo(){
			let form = {
				uid:this.userId,
				gids:this.goodsGidList
			}
			this.$axios.post(httpUrl.getOrderInfo,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.goodsList.goodsListArr = response.data.data.goods;
							this.goodsList.count = response.data.data.count;
							this.goodsList.money = response.data.data.money;
							this.goodsList.address = (response.data.data.address) ? response.data.data.address : '';
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
		}
	},
	mounted(){
		let getUserCookie = this.getCookie('userInfos');
		if(getUserCookie){
			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
			this.userId = userInfos.uid;
			let goodsGidList = sessionStorage.getItem('goodsGidList');
			if(goodsGidList){
				this.goodsGidList = goodsGidList;
				this.getOrderInfo();
			}else{
				this.$router.push({name:'doll'});
			}
			let getPaying = sessionStorage.getItem('paying');
			if(getPaying){
				sessionStorage.removeItem("goodsGidList");
				this.readyPay();
			}
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#placeOrder {
		#placeOrderMain {
			.address {
				.addressBox {
					p {
						margin:5px 0;
					}
				}
			}
			.van-cell {
				padding:20px 15px;
				.van-icon-location:before {
					color:#ff9b9b;
				}
			}
			.dollOrderPanel {
				margin-top:5px;
				margin-bottom:5px;
				.van-panel__content {
					padding:15px 0;
				}
				.dollOrderGoods {
					display: flex;
					align-items: center;
					justify-content: center;
					.goodsImg {
						width: 64px;
						height:64px;
						margin-right:20px;
						overflow:hidden;
						img {
							width: 100%;
						}
					}
					.goodsdetail {
						p {
							font-size:14px;
							margin:5px 0;
						}
						p.gdTime {
							color: $dollCatchTime;
						}
					}
				}
				.footer {
					display: flex;
				    align-items: center;
				    justify-content: space-between;
					.van-button {
					    border-radius: 15px;
	    				padding: 0 15px;
	    				color:$ButtonFontColor;
					}
					span.track {
						color: $dollCoin;
					}
					span {
						display:inline-block;
						font-size:12px;
						a {
							color: $dollCoin;
						}
					}
				}
			}
			.payType {
				.van-cell {
					padding:10px 15px;
					.van-radio {
						display: flex;
						align-items: center;
						flex-direction:row-reverse;
						justify-content: space-between;
						.van-radio__label {
							display: flex;
							align-items: center;
							width:100%;
							img {
								width:45px;
								margin-right:10px;
							}
						}
						.van-icon-checked {
							color: $dollCoin;
						}
						.van-radio__input {
							padding-right:5px;
						}
					}
				}
			}
			.nowPay {
				width:100%;
				text-align: center;
				img {
					width:100px;
				}
			}
		}
	}
</style>