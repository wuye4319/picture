const ROOTPATH = "https://www.wssso.com/web/v1";
const ROOTPATH_DIS = "http://127.0.0.1:7001/web/v1";

let ispro = process.env.NODE_ENV === 'production'
let domain='https://www.wssso.com'

module.exports = {
    APIHOST: ispro ? ROOTPATH : ROOTPATH_DIS,
    domain
};
