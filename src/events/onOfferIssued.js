const broker = require('../controllers/serviceBroker')
function onOfferIssued() {
  var _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }

  function _call(token) {
    console.log("onOfferIssued event triggered.");
    broker.publish("requester", "onofferissued", token);
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

exports.onOfferIssued = onOfferIssued;
