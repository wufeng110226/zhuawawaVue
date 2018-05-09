<template>
	<van-tabbar v-model="activeCTLValue" @change="actives">
		  <van-tabbar-item v-for="(item, index) in bottomIcon" icon="item.iconName" :key="item.index">
		    	<span>{{item.name}}</span>
		    	<template slot="icon" slot-scope="props">
		      		<img :src="props.active ? item.active : item.normal" />
		    	</template>
		  </van-tabbar-item>
	</van-tabbar>
</template>

<script>
export default {
	props:['activeCTL'],
	data () {
		return {
			activeCTLValue:parseInt(this.activeCTL),
			bottomIcon:[
	    		{
	    			name:'首页',
	    			iconName:'home',
	    			normal:require('@/assets/home.png'),
	    			active:require('@/assets/homeActive.png'),
	    			url:'index'
	    		},{
	    			name:'娃娃',
	    			iconName:'doll',
	    			normal:require('@/assets/doll.png'),
	    			active:require('@/assets/dollActive.png'),
	    			url:'doll'
	    		},{
	    			name:'充值',
	    			iconName:'recharge',
	    			normal:require('@/assets/recharge.png'),
	    			active:require('@/assets/rechargeActive.png'),
	    			url:'recharge'
	    		},{
	    			name:'我的',
	    			iconName:'me',
	    			normal:require('@/assets/me.png'),
	    			active:require('@/assets/meActive.png'),
	    			url:'me'
	    		}
	    	]
		}
	},
	methods: {
		actives(value){
			this.$router.push({name:this.bottomIcon[value].url});
		}
	}
}
</script>

<style lang="scss">
@import '../../style/publicColor.scss';
	.van-tabbar {   /*底部操作栏*/
		.van-tabbar-item, .van-tabbar-item--active {
			color: $bottomCTL;
			.van-tabbar-item__icon {
				img {
					height:22px;
				}
			}
		}
	}
</style>