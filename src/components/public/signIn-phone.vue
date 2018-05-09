<template>
	<div id="signPhone" v-bind:style="minHeight">
		<div class="S-inputBox">
			<div class="S-shild">
			  	<div class="S-input-shild phoneNum"><input type="text" v-model="phoneNum" placeholder="请输入手机号"/></div>
			  	<div class="S-input-shild phoneIdeCode"><input type="text" v-model="phoneIdeCode" placeholder="请输入验证码"/>
			  		<a class="sendIdeCode" @click="sendIdeCode" v-if="countStauts == 0">发送验证码</a>
			  		<a class="sendIdeCodeLoading" v-else-if="countStauts == 2">
			  			<van-loading type="spinner" color="black" />
			  		</a>
			  		<a class="countNum" v-else>{{countNum}}s</a></div>
			  	<div class="S-loadButton" @click="loadNow"><img src="../../assets/loadingNow.png" /></div>
		  	</div>
		</div>
	</div>
</template>
<script>
import { Toast } from 'vant';
import { httpUrl } from '@/api'
import { Loading } from 'vant';
export default {
	data () {
		return {
			minHeight: {
				'min-height':window.screen.height + 'px'
			},
			securityPhoneNum:'',
			phoneNum:'',
			phoneIdeCode:'',
			randomIdeCode:'',
			countStauts:0,
			countNum:30
		}
	},
	methods: {
		sendIdeCode(){
			this.countStauts = 2;
			let _this = this;
			let random4Num = function(){
				let Num = "";
				for(let i=0;i<4;i++){
					Num += Math.floor(Math.random()*10)
				}
				return Num
			}
			let checkPhone = function(phoneNum){
				let regexp = /^1[3|4|5|7|8][0-9]{9}$/;
				if(regexp.test(phoneNum)){
					return true
				}else{
					_this.countStauts = 0;
					Toast({
						message:'手机号码格式错误，请确认！',
						position:'bottom'
					});
					return false
				}
			}
			let getRandom4Num = random4Num();
			let form = {
				phone:this.phoneNum,
				code:getRandom4Num
			}
			if(checkPhone(this.phoneNum)){
				this.$axios.post(httpUrl.sendPhoneCode,form)
					.then(
						response => {
							if(response.data.state == '1'){
								_this.securityPhoneNum = _this.phoneNum;
								_this.randomIdeCode = getRandom4Num;
								_this.countStauts = 1;
								let setTimer = setInterval(function(){
									if(_this.countNum > 0){
										_this.countNum -= 1;
									}else{
										clearInterval(setTimer)
										_this.countStauts = 0;
										_this.countNum = 30;
									}
								},1000)
							}else{
								Toast(response.data.data);
							}
						}
					)
					.catch(
						response => {
							this.countStauts = 0;
							Toast({
								message:'服务器响应失败，请重新尝试！',
								position:'bottom'
							});
						}
					)
			}
		},
		loadNow(){
			if(this.phoneIdeCode !== '' && this.randomIdeCode !== '' && this.phoneIdeCode == this.randomIdeCode){
				let form = {
					type:'mobile',
					phone:this.securityPhoneNum,
					source:'H5'
				}
				this.$axios.post(httpUrl.signIn,form)
					.then(
						response => {
							if(response.data.state == '1'){
								let userInfos = response.data.data;
								this.setCookie('userInfos',encodeURIComponent(JSON.stringify(userInfos)),24);
								this.$router.push({name:'me'});
							}
						}
					)
					.catch(
						response => {
							Toast({
								message:'服务器响应失败，请重新尝试！',
								position:'bottom'
							});
						}
					)
			}else if(this.securityPhoneNum == this.phoneNum){
				Toast({
					message:'您输入的手机号码和发送验证码的手机号不对应！',
					position:'bottom'
				});
			}else{
				Toast({
					message:'验证码错误！',
					position:'bottom'
				});
			}
		}
	}
}
</script>

<style lang="scss">
@import '../../style/publicColor.scss';
	#signPhone {
		background:url(../../assets/signphoneBG.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		height:100px;
		width:100%;
		position:relative;
		font-size:14px;
		input {
			margin:10px 0;
			text-align: center;
			background: rgba(0,0,0,0);
			border:0;
			width:100%;
			color:$baseTab;
		}
		input::-webkit-input-placeholder {
			color:$baseTab;
		}
		.S-inputBox {
			width:100%;
			position:absolute;
			top:40%;	
			.S-shild {
				max-width:200px;
				margin:0 auto;
				.S-input-shild {
					border-bottom:1px solid $baseTab;
					display: flex;
					align-items: center;
				}
				.phoneIdeCode {
					input {
						width:55%;
						border-right: 1px solid $baseTab;
						border-radius:0;
						box-sizing: border-box;
					}
					a.countNum {
						width:45%;
						display: inline-block;
						text-align: center;
						color:$dollCoin;
					}
				}
				.sendIdeCode {
					text-decoration:underline;
					width:45%;
					display: inline-block;
					text-align: center;
					font-size:14px;
				}
				.sendIdeCodeLoading {
					display: inline-block;
					margin:0 auto;
				}
				.S-loadButton {
					margin-top:15px;
					text-align: center;
					img {
						width:80%;
					}
				}	
			}
		}
	}
</style>