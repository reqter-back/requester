const broker = require('../controllers/serviceBroker')
function onOfferCanceled() {
  var _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }

  function _call(token) {
    console.log("onOfferCanceled event triggered.");
    broker.publish("requester", "onoffercanceled", token);
    _onOk(token);
  }
  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    }
  };
}

exports.onOfferCanceled = onOfferCanceled;
