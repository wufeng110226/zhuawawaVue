<template>
	<div id="plusAddress">
		<navbar :title="name"></navbar>
		<div id="plusAddMain">
			<van-address-edit
			  :area-list="areaList"
			  :address-info="addressInfo"
			  @save="onSave"
			/>
		</div>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
import areaJson from '@/plugin/area.json'
import { Toast } from 'vant'
import { httpUrl } from '@/api'
export default {
	components:{
		navbar
	},
	data(){
		return {
			name:'添加/编辑地址',
			userId:'',
			areaList:areaJson,
			addressInfo:{},
			type:'',
			_cacheAid:''
		}
	},
	methods: {
		onSave(value) {
	      	if(this.type == 'add'){
	      		let form = {
		      		uid:this.userId,
		      		name:value.name,
		      		phone:value.tel,
		      		province:value.province,
		      		city:value.city,
		      		area:value.county,
		      		detail:value.address_detail
		      	}
		      	this.$axios.post(httpUrl.addAddress,form)
		      		.then(
		      			response => {
		      				if(response.data.state == '1'){
		      					Toast(response.data.data);
		      					this.$router.push({name:'addressList'});
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
	      	}else if(this.type == 'edit'){
	      		let form = {
	      			aid:this._cacheAid,
		      		uid:this.userId,
		      		name:value.name,
		      		phone:value.tel,
		      		province:value.province,
		      		city:value.city,
		      		area:value.county,
		      		detail:value.address_detail
		      	}
	      		this.$axios.post(httpUrl.editAddress,form)
		      		.then(
		      			response => {
		      				if(response.data.state == '1'){
		      					Toast(response.data.data);
		      					this.$router.push({name:'addressList'});
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
	      	}
	      	sessionStorage.removeItem('myAddress');
	    },
	},
	mounted(){
		let getUserCookie = this.getCookie('userInfos');
		if(getUserCookie){
			let userInfos = decodeURIComponent(getUserCookie);
  			userInfos = JSON.parse(userInfos);
			this.userId = userInfos.uid;
			let myAddress = JSON.parse(sessionStorage.getItem('myAddress'));
			if(myAddress){
				this.type = 'edit';
				let arrArea = myAddress.pca.split(" ");
				let objAreacode = ''
				for(let item in areaJson.county_list){
					if(areaJson.county_list[item] == arrArea[2]){
						objAreacode = item;
					}
				}
				this._cacheAid = myAddress.aid
				this.addressInfo = {
					name:myAddress.get_name,
					tel:myAddress.get_phone,
					province:arrArea[0],
					city:arrArea[1],
					county:arrArea[2],
					address_detail:myAddress.detail,
					area_code:objAreacode,
					postal_code:'',
					is_default:''
				}
			}else{
				this.type = 'add';
			}
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#plusAddress {
		#plusAddMain {
			.van-address-edit__buttons {
				margin:0 auto;
				.van-button--primary {
					width:100px;
					margin:0 auto;
					background:$baseBackground;
					border-radius:10px;
					height:40px;
					line-height:40px;
					color:#1b1b1b;
					border:0;
					box-shadow:0px 2px 0px 0px #ffde00;
				}
				.van-button--default {
					display:none;
				}
			}
		}
	}
</style>