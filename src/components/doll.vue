<template>
	<div id="mydoll">
		<navbar :title="name"></navbar>
		<div id="mydollMain">
			<van-cell-group class="myHeader">
			  	<van-cell>
			  		<template slot="title">
			  			<div style="justify-content: space-between;">
			  				<div>
			  					<img :src="userInfo.cover" />
					      		<span class="van-cell-text">{{userInfo.nickname}}</span>
			  				</div>
				  			<div>
				  				<span style="color: #ff5858;">共抓{{userInfo.grab_sum}}次</span>
				  			</div>
			  			</div>
				    </template>
			  	</van-cell>
			</van-cell-group>
			<van-tabs class="doTab" type="card" @click="handelorderList">
				<van-tab v-for="(item, index) in dollOrderTab" :title="item.name" :key="index">
				</van-tab>
			</van-tabs>
			<div class="orderGroup" v-show="sight">
				<van-cell-group v-if="(tabStatus == '3') ? false : true">
					<van-cell>
						<template slot="title">
							<van-checkbox v-model="checkedAll" @change="checkAll">全选</van-checkbox>
						</template>
					</van-cell>
				</van-cell-group>
				<van-checkbox-group v-model="checkResult">
				  	<van-cell-group>
				    	<van-cell v-for="(item, index) in dollOrderList" :key="index">
				      		<template slot="title">
				      			<div class="dollOrderGoodsBox">
					      			<van-checkbox :name="item.gid" v-if="(tabStatus == '3') ? false : true"></van-checkbox>
								    <div class="dollOrderGoods">
								    	<div class="goodsImg"><img :src="item.cover" /></div>
								    	<div class="goodsdetail" v-if="tabStatus !== '3'">
								    		<p>物品名称：{{item.name}}</p>
								    		<p class="gdTime">抓获时间：{{item.createtime}}</p>
								    	</div>
								    	<div class="goodsdetail" v-if="tabStatus == '3'">
								    		<p>{{item.name}}兑换为金币：<span class="speOrderGolds"><i class="yellow"></i>{{item.gold}}</span></p>
								    		<p class="gdTime">抓获时间：{{item.createtime}}</p>
								    	</div>
								    </div>
				      			</div>
						    </template>
				    	</van-cell>
				  	</van-cell-group>
				</van-checkbox-group>
				<div class="buttonGroup" v-if="tabStatus == '1'">
					<a @click="setGrab"><img src="../assets/nowReceive.png" /></a>
					<a @click="setConvertsGold"><img src="../assets/nowExchangeGold.png" /></a>
				</div>
				<div class="buttonGroup" v-if="tabStatus == '2'">
					<a @click="confirmOrder"><img src="../assets/nowPay.png" /></a>
					<a @click="unsetGrab"><img src="../assets/abort.png" /></a>
				</div>
			</div>
			<p class="noDoll" v-show="(sight == true)?false:true">加油哦~你没有任何娃娃</p>
		</div>
		<bottomCTL :activeCTL="message"></bottomCTL>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import bottomCTL from '@/components/public/bottomCTL';
import { Dialog } from 'vant';
import { Toast } from 'vant';
import { httpUrl } from '@/api';
export default {
	components:{
		navbar,bottomCTL
	},
	data(){
		return {
			name:'我的娃娃',
			userId:'',
			tabStatus:'1',
			dollOrderList:[],
			checkedAll:false,
			checkResult:[],
			sight:false,
			message:1,
			userInfo:{},
			dollOrderTab:[
				{
					name:'待领取',
					status:'1'
				},{
					name:'待支付',
					status:'2'
				},{
					name:'已兑换',
					status:'3'
				}
			]
		}
	},
	methods: {
		confirmOrder(){
			let goodsArr = this.checkResult;
			if(goodsArr.length > 0){
				Dialog.confirm({
				  title: '提示',
				  message: '确定是否购买选中娃娃？'
				}).then(() => {
					sessionStorage.setItem('goodsGidList',JSON.stringify(goodsArr));
					this.$router.push({name:'placeOrder'});
				}).catch(() => {
				  // on cancel
				});
			}else{
				Toast({
					message:'你没有选择任何娃娃',
					position:'bottom'
				});
			}
		},
		setGrab(){  //领取娃娃
			let checkResults = this.checkResult;
			if(checkResults.length > 0){
				Dialog.confirm({
				  title: '提示',
				  message: '确定是否领取选中娃娃？'
				}).then(() => {
					let form = {
						uid:this.userId,
						gids:JSON.stringify(this.checkResult)
					}
					this.$axios.post(httpUrl.setGrab,form)
						.then(
							response => {
								if(response.data.state == '1'){
		  							Toast(response.data.data);
		  							this.orderList('1');
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
				}).catch(() => {
				  // on cancel
				});
			}
		},
		setConvertsGold(){ //娃娃兑换金币
			let checkResults = this.checkResult;
			if(checkResults.length > 0){
				Dialog.confirm({
				  title: '提示',
				  message: '确定是否将选中娃娃兑换为金币？'
				}).then(() => {
					let form = {
						uid:this.userId,
						gids:JSON.stringify(this.checkResult)
					}
					this.$axios.post(httpUrl.setConvertsGold,form)
						.then(
							response => {
								if(response.data.state == '1'){
		  							Toast(response.data.data);
		  							this.orderList('1');
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
				}).catch(() => {
				  // on cancel
				});
			}
		},
		unsetGrab(){  //取消领取
			let checkResults = this.checkResult;
			if(checkResults.length > 0){
				Dialog.confirm({
				  title: '提示',
				  message: '确定是否取消领取选取的娃娃？，娃娃会回到待领取列表下'
				}).then(() => {
					let form = {
						uid:this.userId,
						gids:JSON.stringify(this.checkResult)
					}
					this.$axios.post(httpUrl.unsetGrab,form)
						.then(
							response => {
								if(response.data.state == '1'){
		  							Toast(response.data.data);
		  							this.orderList('2');
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
				}).catch(() => {
				  // on cancel
				});
			}
		},
		checkAll(value){  //全选
			if(value == true){
				let arr = this.dollOrderList;
				let litArr = [];
				for(let i=0;i<arr.length;i++){
					litArr.push(arr[i].gid)
				}
				this.checkResult = litArr;
			}else{
				this.checkResult = [];
			}
		},
		handelorderList(index){  //点击tab切换
			let thisTab = this.dollOrderTab[index].status;
			this.tabStatus = thisTab;
			this.checkResult = [];
			this.checkedAll = false;
			if(thisTab == 3){
				this.getExchangeGold();
			}else{
				this.orderList(thisTab);
			}
		},
		getExchangeGold(){    //兑换金币
			let form = {
				uid:this.userId
			}
			this.$axios.post(httpUrl.getConvertsList,form)
				.then(
					response => {
						if(response.data.state == '1'){
							if(response.data.data == null){
								this.sight = false;
							}else{
								this.sight = true;
								this.dollOrderList = response.data.data;
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
		},
		orderList(value){   //订单列表
			let form = {
				uid:this.userId,
				status:value
			}
			this.$axios.post(httpUrl.myOrderList,form)
				.then(
					response => {
						if(response.data.state == '1'){
							if(response.data.data == null){
								this.sight = false;
							}else{
								this.sight = true;
								this.dollOrderList = response.data.data;
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
		},
		getUserInfo(){  //用户信息
			let form = {
				uid:this.userId
			}
			this.$axios.post(httpUrl.getUserInfo,form)
				.then(
					response => {
						if(response.data.state == '1'){
  							this.userInfo = response.data.data;
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
			this.orderList('1');
			this.getUserInfo();
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#mydoll {
		#mydollMain {
			.myHeader {
				.van-cell__title {
					div {
						display:flex;
						align-items: center;
						img {
							width:40px;
							height:40px;
							border-radius:100%;
							margin-right:10px;
							border:1px solid $baseBackground;
						}
					}
				}
			}
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
						.van-tab:nth-child(3){
							border-radius: 0 20px 20px 0;
						}
					}	
				}
			}
			.orderGroup {
				.van-checkbox__control:checked + .van-icon-success {
					background: none;
					border-color: #e4e4e4;
				}
				.van-checkbox .van-icon-success {
					border-color: #e4e4e4;
				}
				.van-checkbox__control:checked + .van-icon-success::before {
					content: ' ';
					width:14px;
					height:14px;
					border-radius:100%;
					background:$baseBackground;
					margin-top:2px;
				}
				.dollOrderGoodsBox {
					display: flex;
					align-items: center;
					justify-content: flex-start;
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
							.speOrderGolds {
								color:$dollCoin;
								i.yellow {
									display:inline-block;
									background: url(../assets/ctl_spirit.png);
								    width: 26px;
    								height: 27px;
									background-size:800px;
									background-position:-252px -631px;
									position: relative;
									top:7px;
								}
							}
						}
					}
				}
				.buttonGroup {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top:20px;
					padding-bottom:65px;
					a {
						text-align:center;
						img {
							width:60%;
						}
					}
				}
			}
			.noDoll {
				width:100%;
				text-align:center;
				font-size:12px;
			    height: 100px;
			    display: flex;
			    justify-content: center;
			    align-items: center;
			}
		}
	}
</style>