<template>
	<div id="imgs">
		<img :src="url" />
	</div>
</template>

<script>
import { Toast } from 'vant';
export default {
	data(){
		return {
			name:'shareimg',
			url:''
		}
	},
	methods: {
		
	},
	mounted(){
		let getUID = this.globals.getQueryString('uid');
		if(getUID){
			let shareIMG = 'http://index.php/zww/user/share_image.html?uid='+getUID+'';
			this.url = shareIMG;
		}else{
			Toast('错误的进入方式！');
			this.$router.push({name:'index'});
		}
	}
}
</script>

<style lang="scss">
	#imgs {
		img {
			width:100%;
		}
	}
</style>