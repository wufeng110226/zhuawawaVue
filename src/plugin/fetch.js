import axios from 'axios'
import qs from 'qs'
//axios通用配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.transformRequest = [function(data) {
    return qs.stringify(data)
}];
export default {
	axios
}