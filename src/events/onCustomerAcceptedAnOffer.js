const broker = require('../controllers/serviceBroker')
function onCustomerAcceptedAnOffer() {
  var _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }

  function _call(offer) {
    console.log("onCustomerAcceptedAnOffer event triggered.");
    broker.publish("requester", "oncustomeracceptedanoffer", offer);
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

exports.onCustomerAcceptedAnOffer = onCustomerAcceptedAnOffer;
