const broker = require('../controllers/serviceBroker');
const Contents = require('../models/content');
const ContentTypes = require('../models/contentType');
const mongoose = require("mongoose");
const async = require("async");
function onOfferIssued() {
  var _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  }
  function _call(offer) {
    if (!offer) {
      console.log("Offer is undefind");
      return;
    }
    console.log("onOfferIssued event triggered." + JSON.stringify(offer));
    ContentTypes.findById(offer.data.contentType).exec((err, ctype) => {
      if (err || !ctype) {
        return;
      }
      var relfields = [];
      for (var field in ctype.fields) {
        if (ctype.fields[field].type === "reference") {
          var references = ctype.fields[field].references;
          if (references) {
            references.forEach(ref => {
              relfields.push({
                name: ctype.fields[field].name,
                ctype: ref,
                select: ctype.fields[field].fields
              });
            });
          }
        }
      }
      if (relfields.length > 0) {
        var ids = [];
        relfields.forEach(fld => {
          if (
            offer.data.fields[fld.name] &&
            offer.data.fields[fld.name].length > 0
          ) {
            if (isArray(offer.data.fields[fld.name])) {
              offer.data.fields[fld.name].forEach(item => {
                if (
                  item.length > 0 &&
                  mongoose.Types.ObjectId.isValid(item)
                )
                  ids.push(item);
              });
            } else {
              if (mongoose.Types.ObjectId.isValid(offer.data.fields[fld.name]))
                ids.push(offer.data.fields[fld.name]);
            }
          }
        });
        Contents.find({
          _id: { $in: ids }
        })
          .select("fields _id contentType")
          .exec((err, rels) => {
            if (err) {
              console.log(err);
              return;
            }
            relfields.forEach(fld => {
              if (
                offer.data.fields[fld.name] &&
                offer.data.fields[fld.name].length > 0
              ) {
                if (isArray(offer.data.fields[fld.name])) {
                  for (i = 0; i < offer.data.fields[fld.name].length; i++) {
                    var item = offer.data.fields[fld.name][i];
                    var row = rels.filter(
                      a => a._id.toString() === item.toString()
                    );
                    if (row.length > 0) {
                      offer.data.fields[fld.name][i] = row[0];
                    }
                  }
                } else {
                  var row = rels.filter(
                    a =>
                      a._id.toString() ===
                      offer.data.fields[fld.name].toString()
                  );
                  if (row.length > 0) {
                    offer.data.fields[fld.name] = row[0];
                  }
                }
              }
            });
            console.log(JSON.stringify(offer));
            broker.publish("requester", "onofferissued", offer);
          });
      }
    });
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

exports.onOfferIssued = onOfferIssued;
