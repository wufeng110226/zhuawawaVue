<template>
	<div id="contactus">
		<navbar :title="name"></navbar>
		<div class="contantMain">
			<p style="font-size:14px;color:#8b8b8b;">如有疑问请联系客服</p>
			<p><i class="contantQQ"></i></p>
			<p><i class="contantPHONE"></i></p>
		</div>
	</div>
</template>

<script>
import navbar from '@/components/public/navbar'
export default {
	components:{
		navbar
	},
	data(){
		return {
			name:'联系我们'
		}
	}
}
</script>

<style lang="scss">
@import '../style/publicColor.scss';
	#contactus {
		div.contantMain {
			padding:10px 15px;
			background: $white;
			color: $dollCoin;
			p {
				margin:5px 0;
				i {
					display: inline-block;
					width:20px;
					height:20px;
					background: url(../assets/ctl_spirit.png);
					background-size: 400px;
					position: relative;
    				top: 4px;
    				margin-right:5px;
				}
				i.contantQQ {
					background-position: 0 -368px;
				}
				i.contantPHONE {
					background-position: -22px -368px;
				}
				img {
					display: inline-block;
				    position: relative;
				    top: 6px;
				    margin-right:10px;
				}
			}
		}
	}
</style>