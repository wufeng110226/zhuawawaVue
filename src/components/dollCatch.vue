<template>
	<div id="dollCatch">
		<div id="mainPage" v-fullpage="{methods:{animationEnd: onAnimationEnd, beginToPage: beginToPage, leavePage: leavePage}}" ref="mainPage">
			<div class="section">
				<!---->
				<navbar class="navbar" :title="name" @quiteRoom="checkQuite" style="position:absolute !important"></navbar>
					<div id="dollWindow" :style="{'height':mathHeight + 'px'}">
						<canvas class="bg" ref="videoStream_front"></canvas>
						<canvas class="bg" ref="videoStream_side" style="display: none"></canvas>
						<div class="player">
							<div class="nowPlayer" v-if="usersInfo.gameuser">
								<div class="nowPlayerHead">
									<img v-if="usersInfo.gameuser.cover" :src="usersInfo.gameuser.cover" />
									<img v-else src="../assets/defaultHead.png" />
								</div>
								<div>
									<p>{{usersInfo.gameuser.nickname}}</p>
									<p>热抓中</p>
								</div>
							</div>
							<div class="nowPlayer" v-else>
								<div class="nowPlayerHead">
									<img src="../assets/defaultHead.png" />
								</div>
								<div>
									<p>等待玩家</p>
								</div>
							</div>
							<div class="linePlayer">
								<div>
									<p>{{usersInfo.total}}人观看</p>
									<p class="inline">{{usersInfo.query}}人排队</p>
								</div>
								<div :style="{'margin-right':-marginRight*15 + 'px'}">
									<img v-for="(item, index) in usersInfo.users" :src="item.cover" :key="index" :style="{right:index*15 +'px','z-index':4 - index}" />
								</div>
							</div>
						</div>
						<div class="msgBox">
							<p v-for="(item, index) in computedMsgContent" :key="index"><span>{{item.nickname}}：</span>{{item.content}}<!--{{item}}--></p>
						</div>
						<div class="catchCount" v-show="(switchCtlPanel == 1)? false: true">
							<span>{{catchStartSecondCount}}’</span>
						</div>
						<div class="changeCamera" @click="change_camera"><img src="../assets/changeCamera.png" /></div>
					</div>
					<div id="catchCtlPanel">
						<div id="waitCatch" v-if="(switchCtlPanel == 1)? true: false">
							<div class="talkPanel"><i @click="showTalkPanel"></i></div>
							<div class="getLine">
								<div v-if="stateInfo == 1" @click="getLine" style="display: inline-block;">
									<p>开始排队</p>
									<p>{{dollGold}}币/次</p>
								</div>
								<div v-if="stateInfo == 2" style="display: inline-block;">
									<p>正在排队</p>
								</div>
								<div v-else-if="stateInfo == 3" @click="startPlaying" style="display: inline-block;">
									<p>开始游戏</p>
									<p>{{waitStartSecondCount}}秒</p>
								</div>
								<div v-else-if="stateInfo == 4" style="display: inline-block;">
									<p>开始游戏中</p>
								</div>
							</div>
							<div class="lure">
								<div class="lureBubbleList">
									<img src="../assets/lureBubble01.png" />
								</div>
								<div class="lureCircle" @click="showMission">
									<i>{{missionSuccessNum}}</i>
									<img style="" src="../assets/lureCircle.png" />
									<img class="dollCovers" :src="dollInfo.dollCover" />
								</div>
							</div>
							<p class="arrow"><i class="fa fa-chevron-up fa-fw"></i></p>
						</div>
						<div id="beginCatch" v-else-if="(switchCtlPanel == 2)? true: false">
							<van-row class="catchCtlPanels">
								<van-col class="catch4Btn" span="16">
									<div class="catch4BtnMain">
										<div>
											<span v-finger:touch-start="touchStart" v-finger:touch-end="touchEnd" class="catchUp"><a></a></span>
										</div>
										<div>
											<span v-finger:touch-start="touchStart" v-finger:touch-end="touchEnd"  class="catchLeft"><a></a></span>
											<span v-finger:touch-start="touchStart" v-finger:touch-end="touchEnd"  class="catchRight"><a></a></span>
										</div>
										<div>
											<span v-finger:touch-start="touchStart" v-finger:touch-end="touchEnd"  class="catchDown"><a></a></span>
										</div>
									</div>
								</van-col>
								<van-col class="catchGoBtn" span="8">
									<div @click="keyCatch"><p>GO</p></div>
								</van-col>
							</van-row>
						</div>
						<div id="catching" v-else-if="(switchCtlPanel == 3)? true: false">
							<van-row class="catchCtlPanels">
								<van-col class="catch4Btn" span="16">
									<div class="catch4BtnMain">
										<div>
											<span class="catchUp"><a></a></span>
										</div>
										<div>
											<span class="catchLeft"><a></a></span>
											<span class="catchRight"><a></a></span>
										</div>
										<div>
											<span class="catchDown"><a></a></span>
										</div>
									</div>
								</van-col>
								<van-col class="catchGoBtn" span="8">
									<div><p>wait..</p></div>
								</van-col>
							</van-row>
						</div>
					</div>
				<!---->
			</div>
			<div class="section">
				<!---->
				<div id="catchRecode" :style="height">
					<div class="crMain" :style="{'height':auotHeight + 'px'}"  v-alloytouch="{options: options, methods:{initAlloyTouch: initAlloyTouch, touchStart:recodeStart, touchEnd:recodeEnd}, min: scrollerMin, max: scrollerMax}">
						<div id="scroller" ref="scroller">
							<van-tabs @click="handelIndex" sticky>
							  	<van-tab v-for="(item, index) in recodeTabList" :title="item.title" :key="index"></van-tab>
							</van-tabs>
							<van-cell-group :style="{'min-height':auotHeight + 'px'}" v-if="recodeTabONEActive">
							 	<van-cell :value="item.createtime" v-for="(item, value) in catchRecodeList" :key="value">
								    <template slot="title">
								    	<div>
								    		<img :src="item.cover" />
								    		<span>{{item.name}}</span>
								    	</div>
								    </template>
							  	</van-cell>
							  	<van-cell v-if="catchRecodeList.length == 0">
							  		<template slot="title">
								    	<div class="noRecode">
								    		<p>还没人抓到过呦~</p>
								    	</div>
								    </template>
							  	</van-cell>
							</van-cell-group>
							<van-cell-group :style="{'min-height':auotHeight + 'px'}" v-else>
								<div class="rankTop3">
									<div class="rankTop top1">
										<div class="topBox">
											<p class="header"><i>2</i><img :src="catchRecodeRankList.top3[0].cover" /></p>
											<p style="height:25px;line-height:25px;overflow:hidden">{{catchRecodeRankList.top3[0].name}}</p>
											<p style="color: #9a3814;">抓取<span>{{catchRecodeRankList.top3[0].count}}</span>次</p>
										</div>
										<img class="zz" src="../assets/toprank2.png" />
									</div>
									<div class="rankTop top2">
										<div class="topBox">
											<p class="header"><i>1</i><img :src="catchRecodeRankList.top3[1].cover" /></p>
											<p style="height:25px;line-height:25px;overflow:hidden">{{catchRecodeRankList.top3[1].name}}</p>
											<p style="color: #9a3814;">抓取<span>{{catchRecodeRankList.top3[1].count}}</span>次</p>
										</div>
										<img class="zz" src="../assets/toprank1.png" />
									</div>
									<div class="rankTop top3">
										<div class="topBox">
											<p class="header"><i>3</i><img :src="catchRecodeRankList.top3[2].cover" /></p>
											<p style="height:25px;line-height:25px;overflow:hidden">{{catchRecodeRankList.top3[2].name}}</p>
											<p style="color: #9a3814;">抓取<span>{{catchRecodeRankList.top3[2].count}}</span>次</p>
										</div>
										<img class="zz" src="../assets/toprank3.png" />
									</div>
								</div>
							 	<van-cell v-for="(item, value) in catchRecodeRankList.anyElse" :key="value">
								    <template slot="title">
								    	<div>
								    		<span>{{value+4}}</span>
								    		<img :src="item.cover" />
								    		<span>{{item.name}}</span>
								    		<span style="position:absolute;right: 10px;">抓取{{item.count}}次</span>
								    	</div>
								    </template>
							  	</van-cell>
							  	<van-cell v-if="catchRecodeRankList.length == 0"> <!--需要重构两种不同的数据为空时-->
							  		<template slot="title">
								    	<div class="noRecode">
								    		<p>还没人抓到过呦~</p>
								    	</div>
								    </template>
							  	</van-cell>
							</van-cell-group>
						</div>
					</div>
				</div>
				<!---->
			</div>
		</div>
		<div class="catchPanelPopStyle">
			<van-popup v-model="catchPanelMissionPop" :close-on-click-overlay="false" :prevent-scroll="true">
				<div class="catchPanelMain clearfix" style="border-radius: 5px;">
					<a class="close" @click="close"><i class="closeicon"></i></a>
					<div id="mission" :style="{'height':auotHeight + 'px'}">
						<div class="header">
							<div class="title" ref="missionheader">
								<div><img :src="dollInfo.dollCover" /></div>
								<div>
									<p class="lit_title">做任务，赚金币</p>
									<p>完成的任务越多，领到到的金币就越多哦~</p>
								</div>
							</div>
							<p class="isTab"><span>每日任务</span></p>
						</div>
						<div class="main" v-alloytouch="{options: options, methods:{}, min: missionScrollerMin, max: scrollerMax}">
							<div id="scroller">
								<van-cell v-for="(item, value) in missionListData" :key="value">
									<div class="left">
										<p><i class="coinIcon"></i></p>
										<p>{{item.price}}金币</p>
									</div>
									<div class="center">
										<p>{{item.text}}</p>
										<p class="progress"><van-progress :show-pivot="false" color="#ffe752" :percentage="mathProgress(item)" /><span>{{item.number}}/{{item.sum}}</span></p>
									</div>
									<div class="right">
										<a class="state2" v-if="item.state == '2'" >已领取</a>
										<a class="state1" v-else-if="item.state == '1'" @click="getTaskGift(item,value)">待领取</a>
										<a class="state3" v-else>待完成</a>
									</div>
								</van-cell>
							</div>
						</div>
					</div>
				</div>
			</van-popup>
		</div>
		<div class="catchPanelPopStyle">
			<van-popup v-model="catchPanelPop" :close-on-click-overlay="false" :prevent-scroll="true">
				<div class="catchPanelMain clearfix">
					<a class="close" @click="close"><i class="closeicon"></i></a>
					<div class="catchPanelBox" v-if="catchResult">
						<p class="t">哇~抓到了耶！ 666</p>
						<p><img :src="dollInfo.dollCover" /></p>
						<p>{{dollInfo.dollName}}</p>
						<div class="buttonGroup">
							<a @click="startPlaying" class="goOn">继续游戏</a>
							<a @click="share" class="share">分享炫耀去</a>
						</div>
						<p class="catchAgainCount">倒计时{{catchAgainSecondCount}}秒</p>
					</div>
					<div class="noCatchPanelBox" v-else>
						<p class="weiqu"><img src="../assets/noCatch.png" /></p>
						<p>差一点点就抓到了</p>
						<p>在抓一次吧！</p>
						<p>（24次后 进入无限抓模式 每局20金币）</p>
						<div class="buttonGroup">
							<a @click="share"><img src="../assets/shareTo.png" /></a>
							<a @click="startPlaying"><img src="../assets/catchAgain.png" /></a>
						</div>
						<p class="catchAgainCount">倒计时{{catchAgainSecondCount}}秒</p>
					</div>
				</div>
			</van-popup>
		</div>
		<div class="bjPanelPopStyle">
			<van-popup v-model="leaveRoom" :close-on-click-overlay="false" :prevent-scroll="true">
				<div class="bjPanelMain conformPayBox">
					<p class="bell"><img src="../assets/bellTips.png" /></p>
					<div class="payTypePanelBox leaveroom">
						<p class="info">正在游戏，是否退出房间！</p>
						<p class="button">
							<img src="../assets/leave.png" @click="quiteRoom" />
							<img src="../assets/cancel.png" @click="leaveRoom = false" />
						</p>
					</div>
				</div>
			</van-popup>
		</div>
		
		<van-actionsheet id="talkPanel" v-model="talkPanel" :class="(talkPanelposition)? 'bottom':'top'">
			<van-search v-model="cacheMsg" show-action @focus="talkPanelfocus">
				<div slot="action" @click="sendMsg">发送</div>
			</van-search>
		</van-actionsheet>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import { Toast } from 'vant';
import { Progress } from 'vant';
import { Dialog } from 'vant';
import { httpUrl } from '@/api';
require('alloytouch/full_page/alloy_touch.full_page');
export default {
	components:{
		navbar
	},
	data(){
		return {
			name:'抓娃娃',
			userId:'',               //用户id
			userName:'',             //用户昵称
			dollId:'',               //娃娃id
			chatRoomId:'',           //房间id
			dollGold:'',             //需要金钱
			stateInfo:1,             //1 开始排队 2正在排队 3 开始游戏 4开始游戏中
			usersInfo:{},            //用户信息和排队信息
			dollInfo:{},             //娃娃信息 dollName：名称、 dollCover：图片
			msgContent:[],           //消息数组
			catchRecodeList:[],      //中奖名单
			catchRecodeRankList:{    //中奖排行榜
				top3:[],
				anyElse:[]
			},
			recodeTabList:[          //中奖名单和排行榜title
				{title:'抓中记录'},
				{title:'排行榜'}
			],
			recodeTabONEActive:true, //中奖名单和排行榜判断第一个tab是否激活
			cacheMsg:'',             //聊天消息
			talkPanel:false,         //聊天弹出层
			waitStartSecondCount:5,  //排到自己后开始游戏前倒计时
			catchStartSecondCount:0, //游戏过程中倒计时
			catchAgainSecondCount:5, //再次游戏倒计时
			accessToken:'',          //触宝获取的Token
			cameraSide:0,            //摄像头位置
			switchCtlPanel:1,        //开始游戏操作面板切换 1 初始未开始 2抓娃娃中 3下抓中
			catchPanelPop:false,     //操作娃娃机后面板显隐
			payPanelPop:false,       //霸机充值支付方式面板显隐  废弃
			conformPay:false,        //确认是否支付 废弃
			leaveRoom:false,         //正在游戏中离开房间
			catchPanelMissionPop:false,//任务弹出框
			missionListData:'',        //任务列表
			missionHeaderHeight:0,     //任务弹窗header高度
			missionSuccessNum:0,       //完成任务待领取数量
			bjCount:45,              //霸机充值倒数  废弃
			bjCountShow:false,       //充值倒数显隐  废弃
			payUrl:'',               //支付地址  废弃
			catchResult:'',          //是否抓到娃娃
			onlineUID:'',            //当前在玩的用户id
			CURRENT_PLAYID:'',       //触宝的随机id
			height: {
	  			'height':window.screen.height + 'px' //当前设备的height
	  		},
	  		socketOPEN:this.ws,
	  		talkPanelposition:true,
	  		//alloytouch初始化设置和fullpage
			options: {
				touch:"",//反馈触摸的dom
	            vertical: true,//不必需，默认是true代表监听竖直方向touch
	            target: '#scroller', //运动的对象
	            property: "translateY",  //被滚动的属性
	            sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
	            factor: 1,//不必需,默认值是1代表touch区域的1px的对应target.y的1
	            step: 40,
	            spring:false
	        },
            // 动态设置属性
            missionScrollerMin:0, //任务弹窗特殊最小值
            scrollerMin: 0, //不必需,滚动属性的最小值
            scrollerMax: 0, //不必需,滚动属性的最大值
            handleAlloyTouch: null,
            currentPage:false,
            beginCoordinate:0
		}
	},
	watch:{
		'socketOPEN.isOnopen':{
			handler:function(e){
				if(e){
					this.ws.sock.onmessage = this.constructorONMSG;
				}
			},
			deep:true
		},
		talkPanel:{
			handler:function(e){
				if(!e){
					this.talkPanelposition = true;
				}
			},
			deep:true
		}
	},
	methods: {
		/*
		 * 客户端私有方法
		 * handelIndex(index) 触发tab切换
		 * initAlloyTouch(handle) 初始化touch滚动条
		 * recodeStart() 开始滚动时触发事件，阻止默认时间并且计算手指点击的Y坐标轴位置
		 * recodeEnd() 结束滚动时触发事件，计算结束时手指离开屏幕时Y坐标轴位置，判断如果开始位置大于结束位置并且大于某值，确定手指向下滑动。fullpage翻页到第一页。
		 * leavePage，onAnimationEnd fullpage离开的页面 运动停止时触发的方法
		 * beginToPage fullpage滚动到第二页得到一个布尔类型的值 用来判断在第二页recodeEnd方法才会执行
		 * talkPanelfocus() fix点击对话框功能，测试用（暂定上线）。
		 * onDoubleTab() 判断双击，禁止双击
		 * close() 关闭抓到和未抓到的弹层面板
		 * showTalkPanel() 聊天输入框弹层显隐
		 * getTaskGift() 领取任务奖励
		 * showMission() 显示任务面板,向服务器端获取当前任务
		 * mathProgress() 计算当前进度条进度
		 * catchRecode() 向服务器端获取当前抓取记录
		 * listenerPopstate() 监听回到上一页，禁止原有事件，调用退出房间入口
		 * beginInit() 初始化客户端面板，回到最初状态
		 * share() 分享，跳转到分享页面去
		 * paying() 霸机充值点击支付方式后，为跳过浏览器禁止window.open()方法，弹出确认支付按钮，并将支付url赋值给确定按钮。这个方法是点击按钮后跳转的支付地址
		 * bjRecharge() 霸机充值弹出面板，重置抓中结果的面板数值和定时器，新加入45秒定时器
		 * nowPay(type) 霸机充值支付类型 wxpay微信 alipay支付宝
		 */
		handelIndex(index){
			if(index == 0){
				this.recodeTabONEActive = true;
			}else{
				this.recodeTabONEActive = false;
			}
		},
		initAlloyTouch(handle){
            this.handleAlloyTouch = handle
        },
        recodeStart(evt){
        	this.beginCoordinate = evt.changedTouches[0].screenY;
        	evt.stopPropagation();
        },
        recodeEnd(evt){
        	if(this.currentPage){
        		if(evt.changedTouches[0].screenY > this.beginCoordinate && evt.changedTouches[0].screenY - this.beginCoordinate > 200){
        			window.rollpage1.alloyTouch.to(0);
        		}
        	}
        	evt.stopPropagation();
        },
        // 回调函数
		leavePage(index) {},
		onAnimationEnd(){},
        beginToPage(index) {
            if(index == '1'){
        		this.currentPage = true;
            }else{
            	this.currentPage = false;
            }
        },
		talkPanelfocus(){
			document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            this.talkPanelposition = false;
		},
		onDoubleTab(){
			let agent = navigator.userAgent.toLowerCase();
			if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0){
				let iNow = new Date().getTime();
				this.iLastTouch = this.iLastTouch || iNow + 1;
				let delta = iNow - this.iLastTouch;
				if(delta < 500 && delta > 0){
					event.preventDefault();
					return false;
				}
				this.iLastTouch = iNow;
			}
		},
		close(){   //关闭显隐面板
			this.overthisGame();
			clearInterval(window.catchAgain);
			clearInterval(window.bjRechargeCount);
			this.catchAgainSecondCount = 5;
  			this.catchPanelPop = false;
  			this.payPanelPop = false;
  			this.conformPay = false;
  			this.bjCountShow = false;
  			this.catchPanelMissionPop = false;
  			this.beginInit();
  		},
		showTalkPanel(){
			this.cacheMsg = '';
			this.talkPanel = true;
		},
		getTaskGift(item,value){
			let form = {
				uid:this.userId,
				taskcode:item.taskcode
			}
			this.$axios.post(httpUrl.missionComplete,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.missionListData[value].state = '2';
						}else{
							Toast({
								message:'任务还没有完成，不能领取',
								position:'bottom'
							})
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
		showMission(){
			this.catchPanelMissionPop = true;
			let form = {
				uid:this.userId
			}
			this.$axios.post(httpUrl.getMissionList,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.missionListData = response.data.data;
							let autoHeight = document.documentElement.clientHeight - 40 - 32;
							if(this.missionListData.length > 0){
								if(autoHeight - 200 < response.data.data.length*67){
									(response.data.data.length*67 - autoHeight) > 0 ? this.missionScrollerMin = -(response.data.data.length*67 - autoHeight) : this.missionScrollerMin = response.data.data.length*67 - autoHeight;
								}
							}
							for(let i=0;i<response.data.data.length;i++){
								if(response.data.data[i].state == '1'){
									this.missionSuccessNum += 1;
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
		},
		mathProgress(item){
			let matchNum = parseInt((parseInt(item.number) / parseInt(item.sum)) * 100);
			return matchNum
		},
		catchRecode(){
			let recodeform = {
				id:this.dollId
			}
			let rankform = {
				id:this.chatRoomId
			}
			let mathgradRecode,mathgrabList,mathResult,autoHeight = document.documentElement.clientHeight - 40 - 32
			this.$axios.post(httpUrl.gradRecode,recodeform)
				.then(
					response => {
						if(response.data.state == '1'){
							this.catchRecodeList = response.data.data;
							mathgradRecode = (response.data.data.length*60 + 102) - autoHeight;
							this.$axios.post(httpUrl.grabList,rankform)
								.then(
									response => {
										if(response.data.state == '1'){
											let [resDate,top3] = [response.data.data,[]];
											if(resDate.length > 3){
												for(let i=0;i<3;i++){
													top3.push(resDate.slice(i,i+1)[0]);
												}
												resDate.splice(0,3);
											}
											this.catchRecodeRankList.top3 = top3;
											this.catchRecodeRankList.anyElse = resDate;
											mathgrabList = (resDate.length*60 + 254) - autoHeight;
											mathResult = (mathgradRecode > mathgrabList) ? mathgradRecode : mathgrabList;
											this.scrollerMin = mathResult > 0 ? -mathResult : mathResult;
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
		listenerPopstate(){
			let _this = this;
			history.pushState(null, null, document.URL);   
			window.addEventListener("popstate", function() {  
	        	history.pushState(null, null, document.URL);
	        	//_this.webSocketClose();
	        });
		},
		beginInit(){  //初始化到开始排队的状态
			this.stateInfo = 1;
			this.bjCount = 45;
			this.waitStartSecondCount = 5;
			this.catchStartSecondCount = 20;
			this.switchCtlPanel = 1;
			this.onlineUID = '';
		},
		share(){
			let _this = this;
			clearTimeout(window.shareTimer);
			let shareTimer = setTimeout(function(){
				_this.$router.push({name:'requestFriends'});
			},1000)
		},
        /*
		 * 触宝系客户端实现方法
		 * getLine() 开始排队
		 * startPlaying() 开始游戏
		 * keyCatch() 下抓
		 * setForce() 调整抓力 不需要考虑回调
		 * change_camera() 切换摄像头
		 * overthisGame() 结束游戏
		 * clientPlayOnReady(count) 游戏准备好后回调方法 count 倒数时间 默认20秒
		 * clientPlayFinish(bool) 游戏结束后回调方法 true抓到 false没抓到
		 */
		startPlaying(){
			clearInterval(window.catchAgain);
			clearInterval(window.readyBeginGame);
			this.catchPanelPop = false;
			this.stateInfo = 4;
			let form = {
				uid:this.userId,
				roomid:this.chatRoomId,
				id:this.dollId
			}
			this.$axios.post(httpUrl.startGame,form)
				.then(
					response => {
						if(response.data.state == '1'){
							let uid = this.userId;
							let dollid = this.dollId;
							startPlay(''+uid+','+dollid+'');
						}else if(response.data.state == '2'){
							this.overthisGame();
							this.stateInfo = 1;
							this.$router.push({path:'/recharge', query:{catchPage:1}});
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
		keyCatch(){
			clearInterval(window.beginGame);
			this.switchCtlPanel = 3;
			control(16);
		},
		change_camera(){
			let [canvas_front, canvas_side] = [this.$refs.videoStream_front, this.$refs.videoStream_side];
			if(this.cameraSide == 0){
				this.cameraSide = 1;
			}else{
				this.cameraSide = 0;
			}
			changeView(this.cameraSide, canvas_front, canvas_side);
		},
		getLine(){
			let form = {
				uid:this.userId,
				roomid:this.chatRoomId,
				id:this.dollId
			}
			this.$axios.post(httpUrl.setQuery,form)
				.then(
					response => {
						//console.log('开始排队返回结果：'+response.data.state);
						//console.log(response);
						if(response.data.state == '2'){
							this.stateInfo = 1;
							this.$router.push({path:'/recharge', query:{catchPage:1}});
						}else if(response.data.state == '1'){
							if(this.stateInfo != 3){
								this.stateInfo = 2;
							}
						}else if(response.data.state == '3'){
							Toast({
	    						message:'链接服务器失败，请检查网络环境！',
	    						position:'bottom'
		    				});
							this.$router.push({name:'index'});
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
		setForce(){  //开始游戏之后调整抓力 不管回调
			let form = {
				id:this.dollId,
				roomid:this.chatRoomId,
				uid:this.userId
			}
			this.$axios.post(httpUrl.setForce,form)
				.then(
					response => {}
				)
				.catch(
					response => {}
				)
		},
		overthisGame(){  //结束游戏时调用 不管回调
			let form = {
				uid:this.userId,
				roomid:this.chatRoomId
			}
			this.$axios.post(httpUrl.overGame,form)
				.then(
					response => {}
				)
				.catch(
					response => {}
				)
		},
		clientPlayOnReady(count){
			//console.log("该你开始游戏了!");
			let _this = this;
			this.setForce();
			this.switchCtlPanel = 2;
			this.catchStartSecondCount = count;
			window.beginGame = setInterval(function(){
    			if(_this.__isDestroyed){  //退出路由会判断路由是否销毁
    				clearInterval(window.beginGame);
    			}else if(_this.globals.browserIsHidden() == 'hidden'){
    				clearInterval(window.beginGame);
    				_this.quiteRoom()
    			}
    			if(_this.catchStartSecondCount > 0){
    				_this.catchStartSecondCount -= 1;
    			}else{
    				clearInterval(window.beginGame);
    				_this.switchCtlPanel = 3;
    			}
    		},1000)
		},
		clientPlayFinish(bool){
			let _this = this;
			this.catchResult = bool;
    		this.catchPanelPop = true;
    		clearInterval(window.catchAgain);
    		this.catchAgainSecondCount = 5;
    		window.catchAgain = setInterval(function(){
    			if(_this.__isDestroyed){  //退出路由会判断路由是否销毁
    				clearInterval(window.catchAgain);
    			}else if(_this.globals.browserIsHidden() == 'hidden'){
    				clearInterval(window.catchAgain);
					_this.quiteRoom()
    			}
    			if(_this.catchAgainSecondCount > 0){
    				_this.catchAgainSecondCount -= 1;
    			}else{
    				clearInterval(window.catchAgain);
    				_this.catchPanelPop = false;
    				_this.overthisGame();
					_this.beginInit();
    			}
    		},1000)
		},
		/*
		 * 触宝系爪子控制方法
		 * touchStart(value) touchEnd(value) 控制爪子上下左右
		 */
		touchStart(value){
			let _this = this;
			let direction = value.target.offsetParent.className;
			switch (direction){
				case 'catchUp':
				if(_this.cameraSide){
					//_this.msgContent.push('侧面按上');
					window.catchUp = setInterval("control(4)",20);
					control(4);
				}else{
					//_this.msgContent.push('正面按上');
					window.catchUp = setInterval("control(1)",20);
					control(1);
				}
				break;
				case 'catchDown':
				if(_this.cameraSide){
					//_this.msgContent.push('侧面按下');
					window.catchDown = setInterval("control(8)",20);
					control(8);
				}else{
					//_this.msgContent.push('正面按下');
					window.catchDown = setInterval("control(2)",20);
					control(2);
				}
				break;
				case 'catchLeft':
				if(_this.cameraSide){
					//_this.msgContent.push('侧面按左');
					window.catchLeft = setInterval("control(2)",20);
					control(2);
				}else{
					//_this.msgContent.push('正面按左');
					window.catchLeft = setInterval("control(4)",20);
					control(4);
				}
				break;
				case 'catchRight':
				if(_this.cameraSide){
					//_this.msgContent.push('侧面按右');
					window.catchRight = setInterval("control(1)",20);
					control(1);
				}else{
					//_this.msgContent.push('正面按右');
					window.catchRight = setInterval("control(8)",20);
					control(8);
				}
				break;
			}
		},
        touchEnd(value){
        	let _this = this;
        	//_this.msgContent.push('抬起');
        	let direction = value.target.offsetParent.className;
			switch (direction){
				case 'catchUp':
				clearInterval(window.catchUp);
				break;
				case 'catchDown':
				clearInterval(window.catchDown);
				break;
				case 'catchLeft':
				clearInterval(window.catchLeft);
				break;
				case 'catchRight':
				clearInterval(window.catchRight);
				break;
			}
        },
		/*
		 * websocket系方法
		 * sendMsg() 直播间发送消息
		 * joinChatroom() 链接ws后收到bind消息 之后请求加入房间接口
		 * constructorONMSG(e) vue原型下的ws.sock.onmessage监听
		 * checkQuite() 退出时检查是否正在游戏中
		 * quiteRoom() 退出房间- 请求触宝的quitRoom后向ws后台发送退出房间消息
		 */
		sendMsg(){
			let obj = {
				'type':'roomchat',
				'data':{
					"roomid":this.chatRoomId,
					"uid":this.userId,
					"content":this.cacheMsg,
					"nickname":this.userName
				}
			}
			this.ws.sock.send(JSON.stringify(obj));
			this.msgContent.push(obj.data);
			this.talkPanel = false;
		},
		joinChatroom(){
			let form = {
				id:this.dollId,
				roomid:this.chatRoomId,
				uid:this.userId
			}
			this.$axios.post(httpUrl.joinChat,form)
				.then(
					response => {
						if(response.data.state == '1'){
							this.usersInfo = response.data.data;
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
		constructorONMSG(e){
			let _this = this;
			if(typeof(e.data) == 'string'){
				let str = JSON.parse(e.data);
				//console.log(str);
				if(str.type == 'bind' && str.data.state == '1'){
					this.joinChatroom();
				}else if(str.type == 'roomchat'){
					this.msgContent.push(str.data);
				}else if(str.type == 'roomdetail'){
					this.usersInfo = str.data;
				}else if(str.type == 'gamestart'){
					this.onlineUID = str.data.uid;
					if(str.data.uid == this.userId){
						if(str.data.count == 1){
							this.startPlaying();
						}else{
							this.stateInfo = 3; //开始游戏
							this.waitStartSecondCount = 5;
							clearInterval(window.readyBeginGame);
							window.readyBeginGame = setInterval(function(){
				    			if(_this.__isDestroyed){ //退出路由会判断路由是否销毁
				    				clearInterval(window.readyBeginGame);
				    			}else if(_this.globals.browserIsHidden() == 'hidden'){
				    				clearInterval(window.readyBeginGame);
				    				_this.quiteRoom()
				    			}
				    			if(_this.waitStartSecondCount > 0){
				    				_this.waitStartSecondCount -= 1;
				    			}else{
				    				clearInterval(window.readyBeginGame);
				    				_this.stateInfo = 1;
				    				_this.waitStartSecondCount = 5;
				    				_this.startPlaying();
				    			}
				    		},1000)	
						}
					}
				}
			}
		},
		checkQuite(){
			if(this.userId == this.onlineUID){
				Toast.clear();
				this.leaveRoom = true;
			}else{
				this.quiteRoom();
			}
		},
		quiteRoom(){
			quitRoom();
			let obj = {
				'type':'outroom',
				'data':{
					"roomid":this.chatRoomId,
					"uid":this.userId
				}
			}
			if(this.ws.isOnopen){
				this.ws.sock.send(JSON.stringify(obj));
			}
			this.$router.push({name:'index'});
		},
		/*
		 * getStream()触宝初始化，建立监听，加入房间
		 */
		getStream(){
			let [_this, cootekCraneEventHandlerImpl] = [this, function(){}];
			cootekCraneEventHandlerImpl.prototype.onPlaySucceed = function(countNum,CURRENT_PLAYID){ /*20秒*/
				if(_this.onlineUID == _this.userId){
					this.CURRENT_PLAYID = CURRENT_PLAYID
					_this.clientPlayOnReady(countNum);
				}
		    } 
		   
		    //set callback function when play failed.
		    cootekCraneEventHandlerImpl.prototype.onPlayFailed = function(){
		        Toast({
					message:'有人在玩，请稍后再试',
					position:'bottom'
				});
		    }
		    
		    //set callback function when play finished.
		    cootekCraneEventHandlerImpl.prototype.onPlayFinish = function(result,CURRENT_PLAYID){
		    	if(_this.onlineUID == _this.userId && this.CURRENT_PLAYID == CURRENT_PLAYID){
		    		_this.clientPlayFinish(result);
		    	}
		    }
		    let [canvas_front, canvas_side] = [this.$refs.videoStream_front, this.$refs.videoStream_side];
		    let ret = joinRoom("26", this.accessToken, canvas_front, canvas_side, cootekCraneEventHandlerImpl);
		}
	},
	computed:{
		marginRight:function(){
			let usersArr = this.usersInfo.users;
			if(usersArr){
				return this.usersInfo.users.length - 1
			}
		},
		computedMsgContent:function(){
			if(this.msgContent.length > 4){
				this.msgContent.splice(0,1);
			}
			return this.msgContent
		},
		mathHeight:function(){
			let clientHeight = document.documentElement.clientHeight;
			return clientHeight - 135
		},
		auotHeight:function(){
			let clientHeight = document.documentElement.clientHeight;
			return clientHeight - 40 - 32
		}
	},
	mounted(){
		let [getUserCookie, accessToken, dollInfos] = [this.getCookie('userInfos'), sessionStorage.getItem('accessToken'), sessionStorage.getItem('dollInfos')];
		if(getUserCookie){
			this.$nextTick(function(){  //阻止双击事件
				document.body.addEventListener('touchend', this.onDoubleTab);
			})
			if(accessToken) this.accessToken = accessToken;
			if(dollInfos) this.dollInfo = JSON.parse(dollInfos);
			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
			this.userId = userInfos.uid;
			this.userName = userInfos.nickname;
			this.token = userInfos.token;
			let _getParams = this.$route.params;   //获取url上带的参数：娃娃id、房间id、娃娃所需金币数
			this.dollId = _getParams.dollid;
			this.chatRoomId = _getParams.roomid;
			this.dollGold = _getParams.gold;
			this.listenerPopstate();  //监听返回事件
			this.catchRecode();
			if(!this.ws.isOnopen){
				this.ws.init();
			}else{
				this.ws.sock.onmessage = this.constructorONMSG;
				this.joinChatroom()	
			}
			this.getStream();         //初始化触宝
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#dollCatch {
		@keyframes arrow
		{  
		    0%   {opacity:0;transform:translate(0, 0);}
		    100%  {opacity:1;transform:translate(0, -10px);}
		}
		@keyframes shake-little { 0% { transform: translate(0px, 0px) rotate(0deg); }
		  2% { transform: translate(0px, 0px) rotate(0deg); }
		  4% { transform: translate(0px, 0px) rotate(0deg); }
		  6% { transform: translate(0px, 0px) rotate(0deg); }
		  8% { transform: translate(0px, 0px) rotate(0deg); }
		  10% { transform: translate(0px, 0px) rotate(0deg); }
		  12% { transform: translate(0px, 0px) rotate(0deg); }
		  14% { transform: translate(0px, 0px) rotate(0deg); }
		  16% { transform: translate(0px, 0px) rotate(0deg); }
		  18% { transform: translate(0px, 0px) rotate(0deg); }
		  20% { transform: translate(0px, 0px) rotate(0deg); }
		  22% { transform: translate(0px, 0px) rotate(0deg); }
		  24% { transform: translate(0px, 0px) rotate(0deg); }
		  26% { transform: translate(0px, 0px) rotate(0deg); }
		  28% { transform: translate(0px, 0px) rotate(0deg); }
		  30% { transform: translate(0px, 0px) rotate(0deg); }
		  32% { transform: translate(0px, 0px) rotate(0deg); }
		  34% { transform: translate(0px, 0px) rotate(0deg); }
		  36% { transform: translate(0px, 0px) rotate(0deg); }
		  38% { transform: translate(0px, 0px) rotate(0deg); }
		  40% { transform: translate(0px, 0px) rotate(0deg); }
		  42% { transform: translate(0px, 0px) rotate(0deg); }
		  44% { transform: translate(0px, 0px) rotate(0deg); }
		  46% { transform: translate(0px, 0px) rotate(0deg); }
		  48% { transform: translate(0px, 0px) rotate(0deg); }
		  50% { transform: translate(0px, 0px) rotate(0deg); }
		  52% { transform: translate(0px, 0px) rotate(0deg); }
		  54% { transform: translate(0px, 0px) rotate(0deg); }
		  56% { transform: translate(0px, 0px) rotate(0deg); }
		  58% { transform: translate(0px, 0px) rotate(0deg); }
		  60% { transform: translate(0px, 0px) rotate(0deg); }
		  62% { transform: translate(0px, 0px) rotate(0deg); }
		  64% { transform: translate(0px, 0px) rotate(0deg); }
		  66% { transform: translate(0px, 0px) rotate(0deg); }
		  68% { transform: translate(0px, 0px) rotate(0deg); }
		  70% { transform: translate(0px, 0px) rotate(0deg); }
		  72% { transform: translate(0px, 0px) rotate(0deg); }
		  74% { transform: translate(0px, 0px) rotate(0deg); }
		  76% { transform: translate(0px, 0px) rotate(0deg); }
		  78% { transform: translate(0px, 0px) rotate(0deg); }
		  80% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  81% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  82% { transform: translate(0px, -1px) rotate(-0.5deg); }
		  83% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  84% { transform: translate(-1px, -1px) rotate(-0.5deg); }
		  85% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  86% { transform: translate(0px, -1px) rotate(-0.5deg); }
		  87% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  88% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  89% { transform: translate(0px, -1px) rotate(-0.5deg); }
		  90% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  91% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  92% { transform: translate(0px, -1px) rotate(-0.5deg); }
		  93% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  94% { transform: translate(0px, -1px) rotate(-0.5deg); }
		  95% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  96% { transform: translate(-1px, -1px) rotate(-0.5deg); }
		  97% { transform: translate(-1px, 0px) rotate(-0.5deg); }
		  98% { transform: translate(0px, -1px) rotate(-0.5deg); } }
		#dollWindow {
			position:relative;
			display: -webkit-flex;
		    align-items: flex-end;
		    background:url(../assets/catchRoom.png);
		    background-size: cover;
			canvas {
				width:100%;
				max-height:100%;
			}
			.player {
				position: absolute;
				top:55px;
				left: 0;
				right: 0;
				display: flex;
			    justify-content: space-between;
			    width: 100%;
				.nowPlayer {
					width: max-content;
					display: flex;
					align-items: center;
					color:$white;
					background:rgba(0,0,0,0.5);
					border-radius:100px;
					padding:0 5px;
					margin-left:10px;
					div {
						img {
							border-radius:100%;
							width:34px;
							height:34px;
						}
						p {
						    margin:0 10px;
						    max-width: 60px;
						    font-size: 12px;
						    overflow: hidden;
						    height: 20px;
						    line-height: 20px;
						    text-overflow: ellipsis;
						    white-space: nowrap;
						}
					}
					.nowPlayerHead {
						display: flex;
					}
				}
				.linePlayer {
					width: max-content;
					display: flex;
					align-items: center;
					color:$white;
					background:rgba(0,0,0,0.5);
					border-radius:100px 0 0 100px;
					padding:0 10px 0 5px;
					overflow: hidden;
					div {
						img {
							border-radius:100%;
							width:34px;
							height:34px;
							position: relative;
							vertical-align: middle;
						}
						p {
							margin:5px 10px;
							font-size:12px;
						}
						p.inline {
							color: $baseBackground;
						}
					}
				}
			}
			.msgBox {
				width:50%;
				position: absolute;
				bottom:15px;
				left:0;
				margin-left:10px;
				p {
					word-break: break-all;
					word-wrap: break-word;
					color: $white;
					font-size:12px;
					margin:3px 0;
					span {
						color:$baseBackground
					}
				}
			}
			.catchCount {
				position: absolute;
				bottom:15px;
				right: 0;
				width:20%;
				display: flex;
				align-items: center;
				justify-content: center;
				span {
					color: $white;
					font-size:28px;
					font-family: STXinwei;
				}
			}
			.changeCamera {
				position:absolute;
				bottom:50%;
				right: 0;
				background: rgba(255, 255, 255, 1);
				border-radius: 100px 0 0 100px;
				display: inline;
			    width:49px;
			    height:43px;
				img {
				    padding: 10px;
				    box-sizing: border-box;
				    width: 100%;
				}
			}
		}
		#catchCtlPanel {
			background: $white;
			box-shadow: 0px 4px 5px 1px #dedede;
			margin-bottom:10px;
			#waitCatch {
				display: flex;
				justify-content: space-between;
				padding: 0 10px;
				position:relative;
				p.arrow {
					animation: arrow 3s infinite;
					position: absolute;
				    bottom: 0;
				    margin: 0;
				    left: 0;
				    right: 0;
					width: 100%;
					text-align: center;
					i {
						color: #cacaca;
					}
				}
				.talkPanel {
					width:33%;
					display:flex;
					justify-content: left;
					align-items:center;
					i {
						display: inline-block;
						width: 33px;
						height: 33px;
						background: url(../assets/ctl_spirit.png);
						background-size: 400px;
						background-position:-127px -367px;
						margin-left:10px;
					}
				}
				.getLine {
					width:33%;
					background: url(../assets/ctl_spirit.png);/*800x800*/
					background-size:400px;
					background-position: -106px -208px;
					width: 100px;
					height:100px;
					border:10px solid $white;
					border-radius:100%;
					position: relative;
					bottom:30px;
				    display: flex;
				    flex-direction: column;
				    justify-content: center;
					p {
						margin:5px 0;
						text-align: center;
					}
					p:nth-child(1) {
						font-size: 16px;
						color: #1b1b1b;
						font-weight: bold;
					}
					p:nth-child(2) {
						font-size:12px;
						color: #757575;
					}
				}
				.lure {
					width:33%;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						width:80%;
					}
					.lureBubbleList {
						width:80%;
						position: relative;
						top:-30px;
					    left: 15px;
					}
					.lureCircle {
						width:80%;
						position: relative;
						text-align: center;
						i {
							display:flex;
							justify-content: center;
							align-items: center;
							background: red;
							color: #fff;
							border-radius: 50%;
						    width: 15px;
						    height: 15px;
						    position: absolute;
						    right: 0;
						    top: 0;
						    font-style: normal;
						    font-size: 12px;
							animation-name: shake-little;
							animation-duration: 5000ms;
							animation-iteration-count: infinite;
							animation-timing-function: ease-in-out;
							animation-delay: 0s;
							animation-play-state: running;
						}
						.dollCovers {
							width:50%;
							position: absolute;
							left: 25%;
							top:15%;
							border-radius:100%;
						}
					}
				}
			}
			#beginCatch {
				.catchCtlPanels{
					.catch4Btn {
						margin-bottom: -95px;
						.catch4BtnMain {
							position: relative;
							bottom:60px;
							text-align: center;
							span {
								display: inline-block;
								position: relative;
								border-radius:100%;
								a {
									display: inline-block;
	    							width: 52px;
	    							height:52px;
	    							background: url(../assets/ctl_spirit.png);/*800x800*/
	    							background-size:400px;
	    							border: 10px solid $white;
	    							border-radius: 100%;
								}
							}
							span.catchLeft {
								right:20px;
								a {
									background-position:0 -103px;
								}
							}
							span.catchRight {
								left:20px;
								a {
									background-position:0 -156px;
								}
							}
							span.catchUp {
								top:40px;
								a {
									background-position:0 0;
								}
							}
							span.catchDown {
								bottom:40px;
								a {
									background-position:0 -51px;
								}
							}
						}
					}
					.catchGoBtn {
						margin-top:20px;
						div {
							display:flex;
							align-items: center;
							justify-content: center;
							background: url(../assets/ctl_spirit.png);/*800x800*/
							background-size:400px;
							background-position: -106px -208px;
							width: 100px;
							height:100px;
							border-radius:100%;
							position: relative;
							p {
								font-weight: bold;
								font-size:24px;
								color: #3f3f3f;
							}
						}
					}
				}
			}
			#catching {
				.catchCtlPanels{
					.catch4Btn {
						margin-bottom: -95px;
						.catch4BtnMain {
							position: relative;
							bottom:60px;
							text-align: center;
							span {
								display: inline-block;
								position: relative;
								border-radius:100%;
								a {
									display: inline-block;
	    							width: 52px;
	    							height:52px;
	    							background: url(../assets/ctl_spirit.png);/*800x800*/
	    							background-size:400px;
	    							border: 10px solid $white;
	    							border-radius: 100%;
								}
							}
							span.catchLeft {
								right:20px;
								a {
									background-position:-52px -103px;
								}
							}
							span.catchRight {
								left:20px;
								a {
									background-position:-52px -156px;
								}
							}
							span.catchUp {
								top:40px;
								a {
									background-position:-52px 0;
								}
							}
							span.catchDown {
								bottom:40px;
								a {
									background-position:-52px -51px;
								}
							}
						}
					}
					.catchGoBtn {
						margin-top:20px;
						div {
							display:flex;
							align-items: center;
							justify-content: center;
							width: 104px;
							height:104px;
							background: url(../assets/ctl_spirit.png);/*800x800*/
							background-size:400px;
							background-position: 0 -206px;
							position: relative;
							p {
								font-weight: bold;
								font-size:24px;
								color: #3f3f3f;
							}
						}
					}
				}
			}
		}
		#catchRecode {
			width:100%;
			background: $white;
			padding:20px 0;
			.crMain {
				margin-left:10px;
				margin-right:10px;
				border:1px solid $baseBackground;
				border-radius:20px;
				background: $white;
				overflow:hidden;
				.van-hairline--top-bottom::after {
					border:0;
				}
				.van-tabs--line {  /*tab页面*/
					.van-tabs__wrap {
						padding:0 20%;
						.van-tab {
							color:$baseTab;
						}
						.van-tab:active {
							background-color: rgba(0,0,0,0);
						}
						.van-tab--active {
							color:#ff4400;
						}
						.van-tabs__nav-bar {
							background-color:#ff4400;
						}
					}
				}
				.rankTop3 {
					display: flex;
					justify-content: center;
					align-items: flex-end;
					.rankTop {
						width:100%;
					    border-bottom-width: 3px;
					    border-bottom-style: solid;
					    text-align:center;
				        padding-top: 50px;
				        position:relative;
				        .topBox {
				        	position: absolute;
				        	top:10px;
				        	width: 100%;
				        	font-size: 14px;
				        	p {
				        		margin:0;
				        		padding:0;
				        		span {
				        			display: inline-block;
				        			color: #fff;
				        			padding:0 2px;
				        			font-size: 25px;
				        		}
				        	}
					        .header {
					        	margin-bottom:10px;
					        	img {
					        		width:55px;
					        		border-radius: 50%;
					        	}
					        	i {
					        		font-style: normal;
					        		display: inline-block;
					        		padding:3px;
					        		border-radius: 50%;
				        		    width: 15px;
								    height: 15px;
								    display: flex;
								    justify-content: center;
								    align-items: center;
								    position: absolute;
								    right: 60%;
								    color: #fff;
					        	}
					        }
				        }
				        img.zz {
					    	width:80%;
					    	vertical-align: middle;
					    }
					}
					.top1 {
						border-bottom-color:#ff6266;
						.header {
				        	img {
				        		border:3px solid #ff6266;
				        	}
				        	i {
				        		background-color: #ff6266;
				        	}
				        }
					}
					.top2 {
						border-bottom-color:#ffd65b;
						.header {
				        	img {
				        		border:3px solid #ffd65b;
				        	}
				        	i {
				        		background-color: #ffd65b;
				        	}
				        }
					}
					.top3 {
						border-bottom-color:#ffb76a;
						.header {
				        	img {
				        		border:3px solid #ffb76a;
				        	}
				        	i {
				        		background-color: #ffb76a;
				        	}
				        }
					}
				}
				.catchRecodeTitle {
					width:100%;
					text-align: center;
					margin:5px 0;
					span {
						display:inline-block;
						padding:5px;
						font-size:14px;
						border-bottom:2px solid #ff4400;
					}
				}
				.van-cell-group {
					border-radius: 20px;
					.van-cell {
						background: none;
					}
				}
				.van-cell__title {
					div {
						display:flex;
						align-items: center;
						img {
							width:40px;
							border-radius:100%;
							margin:0 10px;
						}
					}
				}
				.noRecode {
					p {
						width:100%;
						text-align: center;
						font-size:12px;
						color: #c9c9c9;
					}
				}
			}
		}
		.slimScrollBar {
			visibility: hidden;
		}
		#talkPanel {
			.van-search__input-wrap {
				padding:5px 24px 5px 35px;
				.van-icon-search:before {
					content:'\F01F';
				}
				.van-search__input {
					height: auto;
					line-height: 0px;
				}
			}
			.van-search__action {
				div {
					padding:0 20px;
				}
			}
		}
		#talkPanel.top {
			top:0 !important;
			bottom:auto !important;
		}
		#talkPanel.bottom {
			bottom:0 !important;
			top:auto !important;
		}
		.catchPanelPopStyle,.bjPanelPopStyle {
			.van-popup {
				width:90%;
				background: rgba(0,0,0,0);
			}
			.catchPanelMain,.bjPanelMain {
				width:100%;
				border:3px solid #fad642;
				border-radius:15px;
				background: $white;
				position: relative;
				.close {
					position: absolute;
					display: inline-block;
					right:-10px;
					top:-10px;
					z-index:10;
					width:40px;
					height:40px;
				}
				.noCatchPanelBox,.catchPanelBox {
					position: relative;
					top:-30px;
					p {
						text-align: center;
						color: #ffaf23;
					}
					p.weiqu {
						img {
							width:30%;
						}
					}
					.buttonGroup {
						display: flex;
						justify-content: center;
						a {
							img {
								width:115px;
							}
							padding:0 10px;
						}
					}
					.catchAgainCount {
					    color: $white;
					    position: absolute;
					    bottom: -90px;
					    width: 100%;
					}
				}
				.catchPanelBox {
					top:0px;
					margin-bottom:25px;
					p {
						color: #242424;
					}
					img {
						width:113px;
					}
					.buttonGroup {
						a {
							display: inline-block;
							padding:5px 15px;
							border-radius:100px;
							margin:0 10px;
						}
						a.goOn {
							border:2px solid #d5d5d5;
						}
						a.share {
							color: #414141;
							background: $baseBackground;
						}
					}
				}
				#mission {
					overflow: hidden;
					.header {
						z-index:1;
						position:relative;
						.title {
							background:#ffe752;
							display: flex;
							justify-content: center;
							align-items: center;
							padding: 0 10px;
							div {
								width:50%;
								padding:10px 0;
								img {
									width:80%;
								}
								p {
									margin: 0;
									padding:0;
									font-size: 14px;
								}
								p.lit_title {
									font-size: 18px;
									margin:10px 0;
								}
							}
							div:first-child {
								text-align: center;
							}
						}
						.isTab {
							width:100%;
							text-align: center;
							background: #ffe752;
							margin:0;
							line-height: 25px;
							span {
								color: #9c7032;
								display: inline-block;
								padding: 0 10px;
								border-bottom:2px solid #9c7032;
							}
						}
					}
					.main {
						.van-cell {
							padding:5px 0;
							.van-cell__value {
								display: flex;
								justify-content: space-between;
								align-items: center;
								div {
									text-align: center;
									p {
										margin:0;
										i.coinIcon {
										    position: relative;
										    top: 1px;
										    margin: 0 1px;
										    display: inline-block;
										    width: 26px;
										    height: 26px;
										    background: url(../assets/ctl_spirit.png);
										    background-size: 800px;
										    background-position: -252px -630px;
										}
									}
								}
								div.left,div.right {
									width:25%;
									a {
										display: inline-block;
										border:1px solid #5c5c5c;
										border-radius: 25px;
										padding:1px 10px;
										text-align: center;
										color:#5c5c5c;
									}
								}
								div.left {
									color:#f4c938;
								}
								div.center {
									width:50%;
									.progress {
										display: flex;
										justify-content: space-between;
										align-items:center;
										div {
											width:75%;
											overflow: hidden;
											.van-progress__pivot {
												display: none;
											}
										}
										span {
											padding:0 3px;
										}
									}
								}
								div.right {
									.state1,.state2 {
										color:#fdc72f !important;
										border-color:#fdc72f !important;
									}
								}
							}
						}
					}
				}
			}	
		}
		.bjPanelPopStyle {
			.conformPayBox {
				p.info {
					text-align: center;
				}
				p.button {
					display: flex;
					justify-content: center;
					a {
						display: inline-block;
						padding:5px 30px;
						border-radius:100px;
						margin:0 10px;
						border:2px solid #d5d5d5;
					}
					a.on {
						border-color:rgba(0,0,0,0);
						color: #414141;
						background: $baseBackground;
					}
				}
			}
			.bjCount {
				width: 100%;
				text-align: center;
				font-size: 40px;
				color:$white;
				font-weight: bold;
				position: absolute;
				top:0px;
				color: #fe0;
				z-index: 9999;
			}
			.bjPanelMain {
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
							padding:5px 3px;
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
				.leaveroom {
					p.info {
						padding:15px 0;
					}
					p.button {
						align-items:center;
						img {
							width:35%;
							padding:0 5px;
						}
					}
				}
			}
		}
	}
</style>