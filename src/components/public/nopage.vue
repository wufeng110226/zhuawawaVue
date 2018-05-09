<template>
	<div id="nopage">
		<div>
			<img src="../../assets/404.png" />
			<p>没有找到页面，请返回首页</p>
			<a @click="returnIndex">返回首页</a>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return {
			
		}
	},
	methods: {
		returnIndex(){
			this.$router.push({name:'index'});
		}
	}
}
</script>

<style lang="scss">
@import '../../style/publicColor.scss';
	#nopage {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top:30%;
		text-align: center;
		img {
			width:50%;
		}
		a {
			display: inline-block;
		    min-width: 50px;
		    background: #ffef39;
		    border-radius: 5px;
		    padding: 10px 20px;
		    -webkit-box-shadow: 0px 2px 5px 0 #ffa31f;
		    box-shadow: 0px 2px 5px 0 #ffa31f;
		    text-align: center;
		}
	}
</style>