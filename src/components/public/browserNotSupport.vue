<template>
	<div id="nopage">
		<div>
			<img src="../../assets/noCatch.png" />
			<p>对不起，您的浏览器版本过低</p>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return {
			
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