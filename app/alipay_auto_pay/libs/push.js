let request = require('request');
let crypto = require('crypto');
let logger = require("./logger").logger;
let Push = (function () {
    let _push = function (apiUrl, appId, appKey, secret) {
        this.url = apiUrl + '?appId=' + appId + '&appKey=' + appKey + '&event=new_order';
        this.secret = secret;
    };
    _push.prototype.pushState = function (orderData, callback) {
        // 签名
        // let md5 = crypto.createHash('md5');
        // let sig = [orderData.time.toString(), orderData.tradeNo.toString(), orderData.status.toString(), this.secret.toString()].join('|');
        // sig = md5.update(sig, 'utf8').digest('hex');
        // // Post body
        // orderData.sig = sig;
        // let form = orderData;

        request.post(this.url, {
            timeout: 10000,
            rejectUnauthorized: false,
            form: orderData
        }, function (error, response, body) {
            if (error) {
                logger.info(error.code + ',' + error.message, 'pushError');
                if (typeof(callback) === 'function') {
                    error.isError = true;
                    callback.call(this, error);
                }
                //return false;
            } else if (!error && response.statusCode === 200) {
                logger.info('push order: ' + orderData.tradeNo + ' completed, Response: ' + body, 'push');
                //console.log(body);
                if (typeof(callback) === 'function') {
                    callback.call(this, body.toString());
                }
                // if(body == 'success'){
                //     return true;
                // }else{
                //     return false;
                // }
            } else {
                logger.info('push order: ' + orderData.tradeNo + ' completed, Response(Not 200 OK): ' + body, 'push');
            }
        });
    };
    return _push;
})();

module.exports = Push;