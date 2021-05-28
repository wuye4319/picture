import configdata from './config'
import cache from './cache'

module.exports = {
    config: function (name) {
        var info = null;
        if (name) {
            var name2 = name.split("."); //字符分割
            if (name2.length > 1) {
                info = configdata[name2[0]][name2[1]] || null;
            } else {
                info = configdata[name] || null;
            }
            if (info == null) {
                let web_config = cache.get("web_config");
                if (web_config) {
                    if (name2.length > 1) {
                        info = web_config[name2[0]][name2[1]] || null;
                    } else {
                        info = web_config[name] || null;
                    }
                }
            }
        }
        return info;
    },
    init: function (url, type, data, token, isJson) {
        let header = isJson ? "application/json" : "application/x-www-form-urlencoded";
        url = this.config("APIHOST") + url;
        return new Promise((succ, error) => {
            let confreq = {
                url: url,
                method: type,
                header: {
                    "content-type": header
                },
                success: function (result) {
                    // console.error(result);
                    succ.call(self, result.data)
                },
                fail: function (e) {
                    error.call(self, e)
                }
            }
            if (data) confreq.data = data
            if (token) confreq.header.token = uni.getStorageSync("token");
            uni.request(confreq)
        })
    },
    post: async function (url, data, token, isJson) {
        return await this.init(url, "POST", data, isJson, token)
    },
    get: async function (url, token, isJson) {
        return await this.init(url, "GET", 0, isJson, token)
    }
}