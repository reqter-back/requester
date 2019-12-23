const broker = require('../controllers/serviceBroker')
function onCustomerRejectedAnOffer() {
  var _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }

  function _call(offer) {
    console.log("oncustomerrejectedanoffer event triggered.");
    broker.publish("requester", "oncustomerrejectedanoffer", offer);
    _onOk(offer);
  }
  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    }
  };
}

exports.onCustomerRejectedAnOffer = onCustomerRejectedAnOffer;
