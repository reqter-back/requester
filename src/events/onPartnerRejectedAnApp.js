const broker = require('../controllers/serviceBroker')
function onPartnerRejectedAnApp() {
  var _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }

  function _call(request) {
    console.log("onpartnerrejectedanapp event triggered." + request);
    broker.publish("requester", "onpartnerrejectedanapp", request);
    _onOk(request);
  }
  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    }
  };
}

exports.onPartnerRejectedAnApp = onPartnerRejectedAnApp;
