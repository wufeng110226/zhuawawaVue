<template>
	<div id="addressBox">
		<navbar :title="name" @addressPlus="addressPlus"></navbar>
		<div id="addressList">
			<van-radio-group v-model="radio" class="dollOrderPanel" @change="setAddress">
				<van-panel v-for="(item, index) in address" :key="index">
				  	<p><span>{{item.get_name}}</span>{{item.get_phone}}</p>
				  	<p class="address">{{item.pca}}{{item.detail}}</p>
				  	<div class="footer" slot="footer">
				    	<van-radio :name="item.aid">设为默认</van-radio>
				    	<div class="ctlButton">
				    		<p @click="editAddress(item)"><i class="edit"></i>编辑</p>
				    		<p @click="delAddress(item.aid)"><i class="delete"></i>删除</p></div>
				  	</div>
				</van-panel>
			</van-radio-group>
		</div>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { httpUrl } from '@/api';
export default {
	components:{
		navbar
	},
	data(){
		return {
			name:'管理收货地址',
			userId:'',
			address:[],
			radio:''
		}
	},
	methods:{
		editAddress(item){
			let myAddress = item;
			sessionStorage.setItem('myAddress',JSON.stringify(myAddress));
			this.$router.push({name:'plusAddress'});
		},
		delAddress(aids){
			Dialog.confirm({
			  title: '提示',
			  message: '确定是否删除选中地址？'
			}).then(() => {
				let form = {
					uid:this.userId,
					aid:aids
				}
				this.$axios.post(httpUrl.delAddress,form)
					.then(
						response => {
							if(response.data.state == '1'){
								this.getAddressList();
							}else{
								Toast(response.data.msg);
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
		},
		addressPlus(){
			this.$router.push({name:'plusAddress'});
		},
		setAddress(){
			let form = {
				uid:this.userId,
				aid:this.radio
			}
			this.$axios.post(httpUrl.setAddress,form)
				.then(
					response => {
						Toast('默认地址更新');
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
		getAddressList(){
			let form = {
				uid:this.userId
			}
			this.$axios.post(httpUrl.getAddress,form)
				.then(
					response => {
						if(response.data.state == '1'){
							let data = response.data.data
							this.address = data;
							for(let i=0;i<data.length;i++){
								if(data[i].is_default == '1'){
									this.radio = data[i].aid;
								}
							}
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
			this.getAddressList();
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#addressBox {
		#addressList {
			.dollOrderPanel {
				margin-bottom:5px;
				padding-top:1px;
				.van-panel {
					margin:10px;
					border-radius:10px;
					.van-panel__header {
						display:none;
					}
					.van-panel__content {
						padding:15px 0;
						p {
							margin:0 15px;
							font-size:14px;
							span {
								margin-right:10px;
							}
						}
						p.address {
							color: #4b4b4b;
							word-wrap: break-word;
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
						.van-icon-checked {
							color: $dollCoin;
						}
						.ctlButton {
							display: flex;
							align-items: center;
							p {
								display: flex;
								align-items: center;
								margin:0;
								font-size:12px;
								margin-left:10px;
								color: #8b8b8b;
								img {
									width:15px;
									margin-right:5px;
								}
								i {
									display:inline-block;
									background: url(../assets/ctl_spirit.png);
									background-size:400px;
									margin-right:5px;
									width:15px;
									height:15px;
								}
								i.edit {
									background-position: -17px -347px;
								}
								i.delete {
									background-position:0 -347px;
								}
							}
						}
					}
				}
				.van-hairline--top-bottom::after {
					border:0;
				}
			}
		}
	}
</style>