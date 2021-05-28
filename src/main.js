import Vue from 'vue'
import App from './App'
import HttpRequest from './common/httpRequest'
import queue from './common/queue'

Vue.config.productionTip = false
App.mpType = 'app'

// Vue.prototype.$serverUrl = '';
Vue.prototype.$serverUrl = 'https://unidemo.dcloud.net.cn';
Vue.prototype.$Request = HttpRequest;
Vue.prototype.$queue = queue;

const app = new Vue({
    ...App
})
app.$mount()