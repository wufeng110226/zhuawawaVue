<template>
	<div id="coinDetail">
		<navbar :title="name"></navbar>
		<div class="contantMain">
			<div class="coinAccount">
				<img src="../assets/coinAccBG.png" />
				<div>
					<p>账户余额</p>
					<p><span>{{price}}</span>币</p>
				</div>
			</div>
			<van-cell-group>
			  	<van-cell :title="item.code" :value="item.money" :label="item.createtime" v-for="(item, index) in coinList" :key="index" />
			</van-cell-group>
		</div>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import { Toast } from 'vant';
import { httpUrl } from '@/api'
export default {
	components:{
		navbar
	},
	data() {
		return {
			name:'金币明细',
			userId:'',
			price:'',
			coinList:[],
			iLastTouch:null
		}
	},
	methods: {
		getGoldDetail(){
			let form = {
				uid:this.userId,
				start:0,
				limit:100
			}
			this.$axios.post(httpUrl.goldDetail,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.coinList = response.data.data;
							this.price = response.data.price;
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
			this.getGoldDetail();
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#coinDetail {
		.contantMain {
			.coinAccount {
				position: relative;
				img {
					width:100%;
				}
				div {
					position: absolute;
					bottom:10px;
					width:100%;
					p {
						width:100%;
						margin:0;
						padding-bottom:10px;
						text-align: center;
						span {
							font-size:25px;
							margin:0 5px;
							color: $dollCoin;
						}
					}
				}
			}
			.van-cell__value {
				span {
					font-size:16px;
					color: $dollCoin;
				}
			}
		}
	}
</style>