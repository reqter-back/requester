function onNewTokenCreated() {
  var _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }

  function _call(token) {
    console.log("onnewtokencreated event triggered.");
    //broker.publish("requester", "onnewtokencreated", token);
    _onOk(token);
  }
  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    }
  };
}

exports.onNewTokenCreated = onNewTokenCreated;
