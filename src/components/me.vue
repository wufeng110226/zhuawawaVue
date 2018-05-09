<template>
	<div id="me" :style="height">
		<div class="userData">
			<img src="../assets/meBG.png" />
			<div class="usersDetail">
				<p><img :src="userData.default" /></p>
				<p>{{userData.name}}</p>
				<p>ID:{{userData.id}}</p>
			</div>
			<img class="userline" src="../assets/meLine.png" />
		</div>
		<div class="userAllMain">
			<div class="userAllCTL">
				<van-cell-group>
				  	<van-cell is-link v-for="(item, index) in userAllCTL" :key="index">
					    <template slot="title">
					    	<div class="userAllCTL_content" @click="pushInside(index)">
						    	<p class="userAllCTLIcon" :class="item.router"><span></span></p>
						      	<span class="van-cell-text">{{item.name}}</span>
					      	</div>
					    </template>
				  	</van-cell>
				</van-cell-group>
			</div>
			<div class="logoutbox">
				<a class="logout" @click="logout">退出登录</a>
			</div>
		</div>
		<bottomCTL :activeCTL="message"></bottomCTL>
	</div>
</template>

<script>
import bottomCTL from '@/components/public/bottomCTL';
import { Dialog } from 'vant';
export default {
	components:{
		bottomCTL	
	},
	data () {
		return {
			message:3,
			userData:{
				default:require('@/assets/defaultHead.png'),
				name:'',
				id:''
			},
			height:{
				'height':window.screen.height + 'px' //当前设备的height
			},
			userAllCTL:[
				{
					name:'订单',
					router:'dollOrder'
				},{
					name:'金币明细',
					router:'goldDetail'
				},{
					name:'邀请码',
					router:'requestFriends'
				},{
					name:'联系我们',
					router:'contactus'
				}
			]
		}
	},
	methods: {
		pushInside(value){
			this.$router.push({name:this.userAllCTL[value].router});
		},
		logout(){
			Dialog.confirm({
			  	title: '提示',
			  	message: '确定是否退出登录？'
			}).then(() => {
				sessionStorage.clear();
				this.delCookie('userInfos');
				this.$router.push({name:'/signIn'});
			}).catch(() => {});
		}
	},
	mounted(){
		let getUserCookie = this.getCookie('userInfos');
		if(getUserCookie){
			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
  			if("cover" in userInfos) this.userData.default = userInfos.cover;
			this.userData.id = userInfos.uid;
			this.userData.name = userInfos.nickname;
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#me {
		.userData {
			position:relative;
			width:100%;
			z-index:1;
			img {
				width:100%;
				display:-webkit-box;
			}
			div.usersDetail {
				width: 100%;
			    text-align: center;
			    position: absolute;
			    bottom: 20px;
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
			}
		}
		.userAllMain {
			position:relative;
			top:-25px;
			.userline {
				width:100%;
			}
			.userAllCTL {
				background:$white;
			    padding-top: 20px;
			    .van-cell {
			    	padding:5px 15px !important;
			    }
				.userAllCTL_content {
					display: flex;
					align-items: center;
					P.userAllCTLIcon {
						height:25px;
						span {
							background: url(../assets/ctl_spirit.png);
							background-size:400px;
							width: 25px;
						    height: 25px;
							display: inline-block;
						}
					}
					p.dollOrder {
						span {
							width:24px;
						    background-position: -25px -316px;
						}
					}
					p.goldDetail {
						span {
						    background-position: -50px -316px;
						}
					}
					p.requestFriends {
						span {
						    background-position: 0px -317px;
						}
					}
					p.contactus {
						span {
						    background-position: -78px -318px;
						}
					}
					p {
						font-size:14px;
						margin-right: 15px;
						img {
							width:24px;
						}
					}
				}
			}
			.userAllCTL {
				.van-hairline--top-bottom::after {
					border-width:0 !important;
				}
				.van-cell:not(:last-child)::after {
					right:15px !important;
				}
			}
			.logoutbox {
				width:100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height:100px;
				.logout {
				    display: inline-block;
					width:100%;
					box-sizing: border-box;
					margin:0 20px;
					background: #ffef39;
					border-radius: 12px;
					padding: 8px 10px;
					-webkit-box-shadow: 0px 2px 5px 0 #ffa31f;
					box-shadow: 0px 2px 5px 0 #ffa31f;
					text-align: center;
				}
			}
		}
	}
</style>