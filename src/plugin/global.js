export default {
	isLogin:true,
	init(){
		
	},
	setLoginType (loginType) {  //判断是否登录，废弃
		this.isLogin = loginType;
	},
	getVisibilityState(){      //获取当前浏览器是否支持H5的visibilityState方法
	    let prefixes = ['webkit', 'moz', 'ms', 'o'];
	    if ('visibilityState' in document) return 'visibilityState';
	    for (let i = 0; i < prefixes.length; i++) {
	        if ((prefixes[i] + 'VisibilityState') in document)
	            return prefixes[i] + 'VisibilityState';
	    }
	    // otherwise it's not supported
	    return null;
	},
	browserIsHidden(){ //H5 检测浏览器是否进入后台运行
		let prop = this.getVisibilityState();
		if(!prop) return false;
		return document[prop];
	},
	getQueryString(name) {  //获取url参数
	    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	    let r = window.location.search.substr(1).match(reg); 
	    if (r != null) return unescape(r[2]); 
	    return null; 
	}
}
