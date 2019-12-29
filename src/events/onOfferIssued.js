const broker = require('../controllers/serviceBroker');
const Contents = require('../models/content');
const ContentTypes = require('../models/contentType');
function onOfferIssued() {
  var _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }

  function _call(offer) {
    if (!offer) {
      console.log("Offer is undefind");
      return;
    }
    console.log("onOfferIssued event triggered.");
    ContentTypes.findById(offer.contentType).exec((err, ctype) => {
      if (err) {
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
            offer.fields[fld.name] &&
            offer.fields[fld.name].length > 0
          ) {
            if (isArray(offer.fields[fld.name])) {
              offer.fields[fld.name].forEach(item => {
                if (
                  item.length > 0 &&
                  mongoose.Types.ObjectId.isValid(item)
                )
                  ids.push(item);
              });
            } else {
              if (mongoose.Types.ObjectId.isValid(offer.fields[fld.name]))
                ids.push(offer.fields[fld.name]);
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
                offer.fields[fld.name] &&
                offer.fields[fld.name].length > 0
              ) {
                if (isArray(offer.fields[fld.name])) {
                  for (i = 0; i < offer.fields[fld.name].length; i++) {
                    var item = offer.fields[fld.name][i];
                    var row = rels.filter(
                      a => a._id.toString() === item.toString()
                    );
                    if (row.length > 0) {
                      offer.fields[fld.name][i] = row[0];
                    }
                  }
                } else {
                  var row = rels.filter(
                    a =>
                      a._id.toString() ===
                      offer.fields[fld.name].toString()
                  );
                  if (row.length > 0) {
                    offer.fields[fld.name] = row[0];
                  }
                }
              }
            });
            console.log(JSON.stringify(offer));
            broker.publish("requester", "onofferissued", offer);
          });
      }
    });
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
