<template>
	
	<div id="index">
		<van-tabs :active="active" :swipe-threshold="5" @click="handelIndex">
		  	<van-tab v-for="(item, index) in tabList" :title="item" :key="index"></van-tab>
		</van-tabs>
		<van-pull-refresh v-model="isLoading">
			<van-swipe class="cutAdvert" :autoplay="5000">
			  	<van-swipe-item v-for="(image, index) in bannerList" :key="index">
			  		<a :href="image.url + '?isH5=trues'" target="_blank">
			    		<img :src="image.image" />
			  		</a>
			  	</van-swipe-item>
			</van-swipe>
			<van-row class="dollListContainer" gutter="10">
				  	<van-col span="12" v-for="(item, index) in dollList" :key="index" v-show="(item.roomid == '26') ? true: false"><!--(item.roomid == '26')-->
				  		<div class="dollContainer" @click="viewRoom(item)">
				  			<img :src="item.cover" v-lazy="item.cover">
				  			<p>{{item.name}}</p> <!--roomid-->
				  			<p>
				  				<span class="coin">{{item.money}}<i class="coinIcon"></i>/次</span>
				  				<span class="status use" v-if="item.status == '0'"><i class="statusIcon"></i>维修中</span>
				  				<span class="status free" v-else-if="item.status == '1'"><i class="statusIcon"></i>空闲中</span>
				  				<span class="status use" v-else><i class="statusIcon"></i>使用中</span>
				  			</p>
				  		</div>
				  	</van-col>
				  	<p class="noDoll" v-show="(dollList == null)? true: false">本分类还没有娃娃呦~</p>
			</van-row>
	  	</van-pull-refresh>
		<!--<span id="chest" v-show="chest" @click="wantSign"><i class="chestimg"></i></span>-->
		<bottomCTL :activeCTL="message"></bottomCTL>
		<div class="chestPanelPop">
			<van-popup v-model="chestPanelPop" :close-on-click-overlay="false" :prevent-scroll="true">
				<div class="chestPanelMain clearfix">
					<a class="chestPanelPopClose" @click="close"><i class="closeicon"></i></a>
					<p class="bell"><img src="../assets/bell.png" /></p>
					<div class="chestPanelBox">
						<p class="signBanner"><img src="../assets/signBanner.png" /></p>
						<p class="signDayCount"><span>已连续签到{{chestSign.conts}}天</span></p>
						<ul class="signInfoList">
							<li v-for="(item, index) in chestSign.sinfo" :key="index">
								<i v-show="(item.is_now == 1) ? true : false" class="tape"></i>
								<div class="signInfoDay" v-if="item.is_sign == 0">
									
									<p class="SID_title">{{item.is_day}}</p>
									<p class="SID_icon"><i class="yellow"></i></p>
									<p class="SID_add">+{{item.is_coin}}金币</p>
								</div>
								<div class="signInfoDay gray" v-else>
									<p class="SID_title">{{item.is_day}}</p>
									<p class="SID_icon"><i class="gray"></i></p>
									<p class="SID_add">+{{item.is_coin}}金币</p>
								</div>
							</li>
						</ul>
						<p class="signNow"><img @click="getSignNow" src="../assets/signNow.png" /></p>
					</div>
				</div>
			</van-popup>
			<van-popup v-model="chestSignPop" :close-on-click-overlay="false" :prevent-scroll="true">
				<div class="chestPanelMain clearfix">
					<div class="chestPanelBox">
						<div class="signConfirm">
							<p>签到成功，已获得<span>10</span>金币</p>
							<p>本周连续签到<span>2</span>天，共获得<span>20</span>金币</p>
							<p><img @click="chestSignPop = false" src="../assets/confirm.png" /></p>
						</div>
					</div>
				</div>
			</van-popup>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant';
import { httpUrl } from '@/api';
import bottomCTL from '@/components/public/bottomCTL';
export default {
	components:{
		bottomCTL
	},
  	data () {
	    return {
	    	isLoading:false,       //下拉刷新
	    	message:0,
	    	active:0,              //tab默认激活
	    	tabList:[],            //tab列表
	    	bannerList:[],         //轮播图列表
	    	dollList:[],           //娃娃列表
	    	//chest:false,            //签到显隐
	    	chestPanelPop:false,   //签到面板显隐
	    	chestSignPop:false,    //签到后信息
	    	userId:'',             //用户ID
	    	chestSign:{},          //签到天数金币状态
	    	signNow:{},            //立即签到
	    	appID:'',  //抓娃娃对接ID
	    	appSecret:'', //抓娃娃secret
	    	wxConfigdata:''  //测试
	    }
  	},
  	watch:{
  		isLoading(){
  			if(this.isLoading){
				this.getTabList();
			}
  		}
  	},
  	methods:{
  		viewRoom(item){  //进入房间
  			let info = {
  				dollName:item.name,
  				dollCover:item.cover
  			}
  			sessionStorage.setItem('dollInfos',JSON.stringify(info));
  			this.$router.push(
	  			{
	  				name:'dollCatch',
	  				params:{
	  					roomid:item.roomid,
	  					dollid:item.id,
	  					gold:item.money
	  				}
	  			}
	  		)
  		},
  		close(){        //关闭按钮
  			this.chestPanelPop = false;
  			this.chestSignPop = false;
  		},
  		wantSign(){     //点击签到箱子
  			this.chestPanelPop = true;
  		},
  		getSignNow(){   //点击签到按钮
  			let form = {
  				uid:this.userId
  			}
  			this.$axios.post(httpUrl.signNow,form)
  				.then(
  					response => {
  						if(response.data.state == '1'){
  							this.signNow = response.data.data;
  							this.chestPanelPop = false;
  							this.chestSignPop = true;
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
  		handelIndex(index){
  			let thisTab = this.tabList[index];
  			this.getTabData(thisTab);
  		},
  		getUserSigninfo(){
  			let form = {
  				uid:this.userId
  			}
  			this.$axios.post(httpUrl.usersignInfo,form)
  				.then(
  					response => {
  						if(response.data.state == '1'){
  							let bigObj = {
  								conts:response.data.data.conts,
  								sinfo:[]
  							}
  							let chestSign = response.data.data.sinfo;
  							let dayArr = ['第一天','第二天','第三天','第四天','第五天','第六天','第七天'];
  							let coinArr = ['10','10','10','10','10','10','30'];
  							let obj = {
  								is_now:'',
  								is_sign:'',
  								is_day:'',
  								is_coin:''
  							};
  							for(let i=0;i<chestSign.length;i++){
  								obj = {
  									is_now:chestSign[i].is_now,
  									is_sign:chestSign[i].is_sign,
  									is_day:dayArr[i],
  									is_coin:coinArr[i]
  								}
  								bigObj.sinfo.push(obj);
  							}
  							this.chestSign = bigObj;
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
  		getUserSignState(){
  			let form = {
  				uid:this.userId
  			}
  			this.$axios.post(httpUrl.usersignState,form)
  				.then(
  					response => {
  						if(response.data.state == '2'){
  							this.chestPanelPop = true;
  							this.getUserSigninfo();
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
  		getTabData(tabValue){
  			let form
  			(this.userId) ? 
  				form = {
	  				label:tabValue,
	  				start:0,
	  				limit:100,
	  				versions:'1',
	  				uid:this.userId
	  			}:
  				form = {
	  				label:tabValue,
	  				start:0,
	  				limit:100,
	  				versions:'1'
	  			};
  			this.$axios.post(httpUrl.dollList,form)
  				.then(
  					response => {
  						if(response.data.state == '1'){
  							this.isLoading = false;
  							this.dollList = response.data.data;
  							if(this.userId !== ''){
  								//this.chest = false;
  								this.chestPanelPop = false;
  								this.getUserSignState();
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
						})
  					}
  				)
  		},
  		getTabList(){
  			this.$axios.post(httpUrl.getTabList)
  				.then(
  					response => {
  						if(response.data.state == '1'){
  							this.tabList = response.data.data;
  							this.getTabData(this.tabList[0]);
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
  		getbannerList(){
  			this.$axios.get(httpUrl.getBannerList)
  				.then(
  					response => {
  						if(response.data.state == '1'){
  							this.bannerList = response.data.data;
  						}else{
  							console.log(response);
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
  		dollServerListInit(){
  			let result = initialize(this.appID, this.appSecret);
  			let accessToken = ''
  			if(result == null || result == ""){
  				Toast('娃娃机程序初始化失败，请刷新页面重试！');
  			}else{
  				accessToken = result;
  			}
  			var roomInfoList = getRoomList(accessToken);
  			sessionStorage.setItem('accessToken',accessToken);
  		},
  		getWXUserInfo(code){
  			let thiscode = {
  				code:code
  			};
  			this.$axios.post(httpUrl.getWXuserinfo,thiscode)
  				.then(
  					response => {
  						this.wxSignin(response.data.data);
  					}
  				)
  				.catch(
  					response => {
  						Toast({
    						message:'code错误，获取微信用户信息失败！',
    						position:'bottom'
    					});
  					}
  				)
  		},
  		wxSignin(userinfo){
  			let form = {
					type:'wx',
					nickname:userinfo.nickname,
					cover:userinfo.headimgurl,
					openid:userinfo.openid,
					source:'H5'
			}
			this.$axios.post(httpUrl.signIn,form)
				.then(
					response => {
						Toast.clear();
						let obj = {
							uid:response.data.data.uid,
							nickname:response.data.data.nickname,
							token:response.data.data.token,
							cover:userinfo.headimgurl
						}
						this.setCookie('userInfos',encodeURIComponent(JSON.stringify(obj)),24);
						this.$router.push({name:'me'});
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
  	},
  	mounted(){
  		//navigator.userAgent
  		let getUserCookie = this.getCookie('userInfos');
  		if(getUserCookie != null){
  			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
			this.userId = userInfos.uid;
			if(!this.ws.isOnopen){
				this.ws.init();
			}
  		}
  		this.dollServerListInit();
  		this.getTabList();
  		this.getbannerList();
  		let getWXCode = this.globals.getQueryString('code');
  		if(getWXCode){
  			this.getWXUserInfo(getWXCode)
  			Toast.loading({
	  			type:'html',
	  			message:"<div style='text-align:center;'><img style='width:50%;' src='"+require('@/assets/loading.gif')+"' /></div>",
				mask: true,
				duration: 0
			});
  		}
  			
  	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--top-nav样式reset-->
<!--
	页面的样式如果不加scoped会影响到其他的页面 
	也就是说router跳转之后样式是不销毁的
	依照这个特性 可以在index页面里把全局的reset样式加上
-->
<!--sass样式-->
<style lang="scss">
@import '../style/publicColor.scss';
	#index {
		.van-tabs--line {  /*tab页面*/
			.van-tabs__wrap {
				padding:0 40px;
				background: $baseBackground;
				.van-tab {
					background: $baseBackground;
					color:$baseTab;
				}
				.van-tabs__nav-bar {
					background-color:$baseTab;
				}
			}
		}
		.van-swipe {   /*滚动图*/
			.van-swipe__indicators {
				height:10px;
				i.van-swipe__indicator--active {
					background-color: $baseBackground;
				}
				i {
					width:10px;
					height:10px;
					border:1px solid $baseTab;
					background: rgba(0,0,0,0);
				}
			}
			a {
				display: inline-block;
				width:100%;
			}
			img {
				width: 100%;
			}
		}
		.van-col:nth-child(odd) {
			padding-left:0 !important;
		}
		.van-col:nth-child(even) {
			padding-right:0 !important;
		}
		.dollListContainer {  /*娃娃机列表*/
			padding:0 10px 100px 10px !important;
			.van-col {
				padding-bottom: 5px;
			}
			.dollContainer {
				border:1px solid $baseBorder;
				border-radius:15px;
				text-align:center;
				background:$white;
				font-size:14px;
				p {
					margin:5px 10px;
					text-align: left;
					color: $dollFont;
					span {
						.coinIcon {
							position:relative;
							top:1px;
							margin:0 1px;
							display:inline-block;
							width:13px;
							height:13px;
							background: url(../assets/ctl_spirit.png);
							background-size:400px;
							background-position:-126px -315px;
						}
					}
					.coin {
						font-size:13px;
						color:$dollCoin;
					}
					.status {
						font-size:13px;
						float: right;
						position:relative;
						top:1px;
						.statusIcon {
							position: absolute;
							left:-15px;
							margin:0 1px;
							display:inline-block;
							width:13px;
							height:17px;
							top:-2px;
							background: url(../assets/ctl_spirit.png);
							background-size:400px;
						}
						
					}
					.status.use {
						.statusIcon {
							background-position:-125px -333px;
						}
					}
					.status.free {
						.statusIcon {
							background-position:-137px -333px;
						}
					}
				}
				
				img {
					width:80%;
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
		#chest {
			position: fixed;
			bottom:50px;
			right:0;
			width:85px;
			height:100px;
			.chestimg {
				display:inline-block;
				background: url(../assets/ctl_spirit.png);
				background-size:400px;
				background-position:90px 0;
				width:100%;
				height:100%;
			}
		}
		.chestPanelPop {
			.van-popup {
				width:90%;
				background: rgba(0,0,0,0);
			}
			.chestPanelMain {
				width:100%;
				border:3px solid #fad642;
				border-radius:15px;
				background: $white;
				position: relative;
				.chestPanelPopClose {
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
				.chestPanelBox {
					margin-top: 35px;
					.signBanner {
						width:100%;
						text-align: center;
						margin:5px 0;
						img {
							width: 86%;
						}
					}
					.signDayCount {
						width:100%;
						margin-top:0;
						text-align: center;
						font-size:14px;
						span {
							display: inline-block;
							text-align: center;
							width:30%;
							padding:5px 15px;
							border-radius:25px;
							background:#ededed;
							color: #ff9b05;
						}
					}
					.signInfoList {
						display:inline-block;
						display: flex;
						justify-content: center;
						flex-direction:row;
						flex-wrap:wrap;
						li {
							width:25%;
							margin:0 auto;
							padding-bottom:10px;
							box-sizing: border-box;
							position: relative;
							.tape {
								position: absolute;
								right:4px;
								top:-2px;
								display: inline-block;
								width:37.5px;
								height:36.5px;
								background:url(../assets/ctl_spirit.png);
								background-size:400px;
								background-position:-126px 0;
							}
							div.signInfoDay {
								width:80%;
								border-radius:15px;
								border:2px solid #fdbf46;
								overflow: hidden;
								margin: 0 auto;
								p {
									width:100%;
									padding:5px 0;
									text-align: center;
									margin:0;
									background: $white;
									font-size: 12px;
								}
								.SID_title {
									background: #ffdd57;
									color: $white;
								}
								.SID_icon {
									background: $white;
									padding:5px 0 0 0;
									i {
										display: inline-block;
										width:26px;
										height:27px;
										background: url(../assets/ctl_spirit.png);
										background-size:800px;
									}
									i.yellow {
										background-position: -252px -631px;
									}
									i.gray {
										background-position: -286px -631px;
									}
								}
								.SID_add {
									color: #ed932b;
								}
							}
							div.signInfoDay.gray {
								border:2px solid $baseBorder;
								p {
									background: $baseBorder;
								}
								.SID_title {
									background: $baseBorder;
									color: $white;
								}
								.SID_icon {
									background: #f3f3f3;
									padding:5px 0 0 0;
								}
								.SID_add {
									color: #c1c1c1;
								}
							}
						}
						li:nth-child(5) {
							margin-left: 35px;
						}
						li:nth-child(7) {
							margin-right: 35px;
						}
					}
					.signNow {
						width:100%;
						text-align: center;
						img {
							width:50%;
						}
					}
					.signConfirm {
						p {
							width:100%;
							text-align: center;
							span {
								display:inline-block;
								margin:0 3px;
								color:#ffba4d;
							}
							img {
								width:50%;
							}
						}
					}
				}
			}	
		}
	}
</style>