<template>
	<div id="dollOrder">
		<navbar :title="name"></navbar>
		<van-tabs class="doTab" type="card" @click="handelorderList">
			<van-tab v-for="(item, index) in dollOrderTab" :title="item.name" :key="index">
			</van-tab>
		</van-tabs>
		<van-panel class="dollOrderPanel" v-for="(item, index) in dollOrderList" title="订单状态" :status="(item.status == '1')? '待发货' : '已发货'" :key="index">
		  	<div class="dollOrderGoods" v-for="(items, indexs) in item.goods">
		  		<div class="goodsImg"><img :src="items.cover" v-lazy="item.cover"/></div>
		  		<div class="goodsdetail">
		  			<p>物品名称：{{items.name}}</p>
		  			<p class="gdTime">抓获时间：{{items.createtime}}</p>
		  		</div>
		  	</div>
		  	<div class="footer" slot="footer">
		    	<van-button size="small" v-if="(item.status == '1')? true:false" @click="contactCS(item.oid)">取消订单</van-button>
		    	<span class="track" v-if="(item.status == '1')? false:true">请留意快递电话查收</span>
		    	<span>共{{item.number}}件商品 运费：<a>¥{{item.money}}</a></span>
		  	</div>
		</van-panel>
		<p class="noOrder" v-show="(sight == true)?false:true">加油哦~你没有任何订单</p>
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
			name:'娃娃订单',
			userId:'',
			dollOrderList:[],
			dollOrderTab:[
				{
					name:'待发货',
					status:'1'
				},{
					name:'已发货',
					status:'2'
				}
			],
			sight:false
		}
	},
	methods:{
		contactCS(orderNum){
			Dialog.alert({
			  title: '提示',
			  message: '订单号:'+orderNum+' 已经支付，如取消订单请联系客服'
			}).then(() => {
			  // on close
			});
		},
		handelorderList(index){
			let thisTab = this.dollOrderTab[index].status;
			this.orderList(thisTab);
		},
		orderList(value){
			let form = {
  				uid:this.userId,
  				status:value
  			}
  			this.$axios.post(httpUrl.orderList,form)
  				.then(
  					response => {
  						if(response.data.state == '1'){
  							if(response.data.data.length > 0){
  								this.sight = true;
  								this.dollOrderList = response.data.data;
  							}else{
  								this.sight = false;
  							}
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
		}
	},
	mounted(){
		let getUserCookie = this.getCookie('userInfos');
		if(getUserCookie){
			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
			this.userId = userInfos.uid;
			this.orderList();
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#dollOrder {
		.doTab {
			padding:15px 0;
			.van-tabs__wrap {
				position:relative;
				height:auto;
				.van-tabs__nav--card {
					border:0;
					background: rgba(0,0,0,0);
				}
				.van-tabs__nav {
					justify-content:center;
					height:auto;
					.van-tab {
						flex: none;
						width:auto;
						padding:5px 20px;
						line-height:auto;
						border:0;
					}
					.van-tab--active {
						background:$baseBackground;
						color:$baseTab;
					}
					.van-tab:nth-child(1){
						border-radius: 20px 0 0 20px;
					}
					.van-tab:nth-child(2){
						border-radius: 0 20px 20px 0;
					}
				}	
			}
		}
		.dollOrderPanel {
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
						width: 100px;
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
		.noOrder {
			width:100%;
			text-align:center;
			font-size:12px;
		    height: 100px;
		    display: flex;
		    justify-content: center;
		    align-items: center;
		}
	}
</style>