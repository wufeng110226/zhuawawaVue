<template>
  <div id="app" v-bind:style="minHeight">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
  	return {
  		minHeight: {
  			'min-height':window.screen.height + 'px'
  		}
  	}
  }
}
</script>

<style>
* {
	-webkit-touch-callout:none;
	-webkit-user-select:none;
	-khtml-user-select:none;
	-moz-user-select:none;
	-ms-user-select:none;
	user-select:none;
}
#app {
  font-family:"PingFang SC","FZHei-B01S", Arial, Helvetica, "STHeiti STXihei", "Microsoft YaHei", Tohoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1f1f1f;
  background: #f8f8f8;
}
[contenteditable = "true"], input, textarea {
    -webkit-user- select: auto!important;
    -khtml-user-select: auto!important;
    -moz-user-select: auto!important;
    -ms-user-select: auto!important;
    -o-user-select: auto!important;
    user-select: auto!important;
}
.clearfix:before, .clearfix:after {
		display: table;
    content: "";
    line-height: 0;
}
i.closeicon {
	display: inline-block;
	width: 100%;
	height:100%;
	background:url(assets/ctl_spirit.png);
	background-size:400px;
	background-position:-50px -346px;
}

.van-toast--html {
	background-color:rgba(0,0,0,0) !important;
}
</style>
