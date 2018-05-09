<template>
	<van-nav-bar class="cut_navbar" :title="title" leftArrow fixed>
		<van-icon @click="historyback" class="arrow" name="arrow" slot="left"></van-icon>
		<span v-if="thisRouterName == 'addressList'" slot="right" class="fa fa-plus fa-fw" @click="addressPlus"></span>
	</van-nav-bar>
</template>

<script>
import router from '@/router'
import { Toast } from 'vant';
import { Loading } from 'vant';
export default {
	props:["title"],
	data(){
		return {
			thisRouterName:''
		}
	},
	methods: {
		addressPlus(){
			this.$emit('addressPlus');
		},
		historyback(){
			if(router.history.current.name == 'dollCatch'){
				this.$emit('quiteRoom');
			}else if(router.history.current.name == 'plusAddress'){
				sessionStorage.removeItem('myAddress');
				this.$router.go(-1);
			}else{
				this.$router.go(-1);
			}
		}
	},
	mounted(){
		this.thisRouterName = router.history.current.name
	}
}
</script>

<style lang="scss">
@import '../../style/publicColor.scss';
	.cut_navbar {
		background: $baseBackground !important;
		color: $baseTab;
		z-index: 2000 !important;
		position:relative !important;
		.van-nav-bar__left {
			left: 0;
		}
		.van-icon {
			color: $baseTab !important;
		}
		.arrow {
			height: 46px;
		    line-height: 46px;
		    padding: 0 15px;
		    transform: rotate(180deg);
		    transform: -webkit-ratate(180deg);
		}
		.van-hairline--top-bottom:after {
			border:none;
		}
		span.fa-plus {
			color: #1b1b1b;
		}
	}
</style>