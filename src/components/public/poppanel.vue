<template>
	<div class="componentBox">
		<van-popup v-model="leaveRoom" :close-on-click-overlay="false" :prevent-scroll="true">
			<div class="componentBoxMain conformPayBox">
				<p class="bell"><img src="@/assets/bellTips.png" /></p>
				<div class="infoContant">
					<p class="info">余额不足，请充值！</p>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
export default {
	props:['leaveRoom'],
	data(){
		return {}
	},
	methods:{}
}
</script>

<style lang="scss">
	.componentBox {
			.van-popup {
				width:90%;
				background: rgba(0,0,0,0);
			}
			.componentBoxMain {
				width:100%;
				border:3px solid #fad642;
				border-radius:15px;
				background: #fff;
				position: relative;
				.close {
					position: absolute;
					display: inline-block;
					right:-10px;
					top:-10px;
					z-index:1;
					width:40px;
					height:40px;
				}
			}	
		}
		.componentBox {
			.componentBoxMain {
				.bell {
					width: 100%;
					text-align: center;
					position: absolute;
    				top: -45px;
					img {
						width: 237px;
					}
				}
				.infoContant {
					margin-top: 35px;
					p.info {
						text-align: center;
						padding:15px 0;
					}
				}
			}
		}
</style>